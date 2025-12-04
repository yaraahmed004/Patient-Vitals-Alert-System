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
    try:
        while True:
            # Simulate real-time checking of patients every 3 seconds
            for patient_id in data['patient_id'].unique():
                patient = data[data['patient_id'] == patient_id]
                patient_process = preprocess(patient)
                patient_data = patient_process.drop(columns=['patient_id', 'status'], errors='ignore')

                status = dt_model.predict(patient_data)[0]
                anomaly = iso_model.predict(patient_data)[0]

                alert = False
                reasons = []

                if status > 2:
                    alert = True
                    reasons.append("Critical status!")

                if anomaly == -1:
                    alert = True
                    reasons.append("Anomaly detected!")

                if alert:
                    await websocket.send_json({
                        "patient_id": int(patient_id),
                        "status": STATUS_MAP[int(status)],
                        "anomaly": "Yes" if int(anomaly) == -1 else "No",
                        "reasons": reasons
                    })

            await asyncio.sleep(10)

    except WebSocketDisconnect:
        print("Client disconnected")
