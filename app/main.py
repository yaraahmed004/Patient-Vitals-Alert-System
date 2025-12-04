from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
import joblib
from app.utils import load_process_data
import pandas as pd
import os
import asyncio
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="ICU Patient Vitals Anomaly Prediction and Alert System")
dt_model = joblib.load("C:\\Users\\hp\\Desktop\\ACP_project\\models\\decision_tree_model.pkl")
iso_model = joblib.load("C:\\Users\\hp\\Desktop\\ACP_project\\models\\isolation_forest_model.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


data = pd.read_csv("patient readings dataset.csv")

def preprocess(data):
    data = data.copy()
    data = data.dropna()

    if "timestamp" in data.columns and data["timestamp"].dtype == "object":
        data["timestamp"] = (
        pd.to_timedelta("00:" + data["timestamp"])
        .dt.total_seconds()
    )
        
    data['oxygen_stress'] = (
        data['heartbeat'] + data['respiratory_rate']
    ) / data['spo2']

    return data


STATUS_MAP = {
    0: "Normal",
    1: "Mild Abnormality",
    2: "Moderate Abnormality",
    3: "Critical Condition",
    4: "Outlier"
}

@app.get("/patients")
def get_all_patients():
    all_patients = data[['patient_id']].drop_duplicates()
    return [
        {
            "patient_id": int(row.patient_id),
            "name": f"Patient {int(row.patient_id)}",
            "status": 0  # default as normal
        }
        for row in all_patients.itertuples()
    ]




@app.get("/prediction/{patient_id}")
def predict_status(patient_id : int):
    patient = data[data['patient_id'] == patient_id]
    if patient.empty:
        raise HTTPException(status_code=404, detail="Patient not found.")
    
    patient_process = preprocess(patient)
    patient_data = patient_process.drop(columns=['patient_id', 'status'], errors='ignore')

    status = dt_model.predict(patient_data)[0]
    anomaly = iso_model.predict(patient_data)[0]

    status_label = STATUS_MAP[int(status)]


    alert = False
    reasons = []
    if status > 2:
        alert = True
        reasons.append("Critical status!")

    if anomaly == -1:
        alert = True
        reasons.append("Anomaly detected!")

    return {
        "patient_id": int(patient_id),
        "predicted_status": STATUS_MAP[int(status)],
        "anomaly": "Yes" if int(anomaly) == -1 else "No",
        "alert": bool(alert),
        "alert_reasons": reasons
    }

@app.websocket("/ws/alerts")
async def alerts_websocket(websocket: WebSocket):
    await websocket.accept()
    patient_ids = data['patient_id'].unique()
    batch_size = 3
    index = 0

    try:
        while True:
            batch_patients = []

            # Take a batch of 3 patients
            for i in range(batch_size):
                pid = patient_ids[(index + i) % len(patient_ids)]
                patient = data[data['patient_id'] == pid]
                patient_process = preprocess(patient)
                patient_data = patient_process.drop(columns=['patient_id', 'status'], errors='ignore')

                status = dt_model.predict(patient_data)[0]
                anomaly = iso_model.predict(patient_data)[0]

                # Convert numeric status to label
                if status == 0:
                    status_label = "Normal"
                elif status == 1:
                    status_label = "Mild Abnormality"
                else:
                    status_label = "Critical Condition"

                batch_patients.append({
                    "patient_id": int(pid),
                    "name": f"Patient {int(pid)}",
                    "room": f"Room {int(pid)}",
                    "heartbeat": int(patient['heartbeat'].iloc[0]),
                    "spo2": int(patient['spo2'].iloc[0]),
                    "status": status_label,
                    "anomaly": "Yes" if anomaly == -1 else "No",
                    "reasons": ["Critical status!"] if status > 2 else []
                })

            # Send the batch of 3 patients
            await websocket.send_json(batch_patients)

            # Move index forward
            index = (index + batch_size) % len(patient_ids)

            await asyncio.sleep(5)  # wait 5 seconds before next batch

    except WebSocketDisconnect:
        print("Client disconnected")


# add these imports at top if not present
from fastapi import WebSocket, WebSocketDisconnect
import asyncio

# new websocket: rotating batches of 3 patients
@app.websocket("/ws/live_patients")
async def live_patients_websocket(websocket: WebSocket):
    await websocket.accept()
    patient_ids = list(data['patient_id'].unique())
    if len(patient_ids) == 0:
        await websocket.send_json([])  # nothing to send
        return

    batch_size = 3
    index = 0

    try:
        while True:
            batch_patients = []

            for i in range(batch_size):
                pid = patient_ids[(index + i) % len(patient_ids)]
                patient = data[data['patient_id'] == pid]

                # If patient frame exists, grab first row for current vitals
                if patient.empty:
                    continue

                patient_process = preprocess(patient)
                patient_data = patient_process.drop(columns=['patient_id', 'status'], errors='ignore')

                # predict — use the first row's features (your models expect a row)
                try:
                    status_num = int(dt_model.predict(patient_data)[0])
                except Exception:
                    # fallback if prediction fails
                    status_num = 0

                try:
                    anomaly_num = int(iso_model.predict(patient_data)[0])
                except Exception:
                    anomaly_num = 1  # assume normal by default

                # map status_num to label string (same labels you used)
                status_label = STATUS_MAP.get(status_num, "Normal")

                # pull vitals (use iloc[0] to get scalar values)
                # Use column names present in your CSV: heartbeat, spo2, temperature, respiratory_rate, systolic_bp, diastolic_bp
                row = patient.iloc[0]
                heartbeat = int(row.get('heartbeat', 0))
                spo2 = int(row.get('spo2', 0))
                temp = float(row.get('temperature', 0.0))
                resp_rate = int(row.get('respiratory_rate', 0))

                reasons = []
                if status_num > 2:
                    reasons.append("Critical status!")
                if anomaly_num == -1:
                    reasons.append("Anomaly detected!")

                batch_patients.append({
                    "patient_id": int(pid),
                    "name": f"Patient {int(pid)}",
                    "room": f"Room {int(pid)}",
                    "heartbeat": heartbeat,
                    "spo2": spo2,
                    "temperature": temp,
                    "respiratory_rate": resp_rate,
                    "status": status_label,
                    "anomaly": "Yes" if anomaly_num == -1 else "No",
                    "reasons": reasons
                })

            # send exactly the batch (may be <3 if dataset smaller)
            await websocket.send_json(batch_patients)

            # advance index
            index = (index + batch_size) % len(patient_ids)
            await asyncio.sleep(5)  # 5 seconds between batches

    except WebSocketDisconnect:
        print("Client disconnected (live_patients)")
    except Exception as e:
        # log and close gracefully
        print("Error in live_patients_websocket:", e)
        try:
            await websocket.close()
        except:
            pass
