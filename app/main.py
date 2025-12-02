from fastapi import FastAPI, HTTPException
import joblib
from app.utils import load_process_data
import pandas as pd
import os

app = FastAPI(title="ICU Patient Vitals Anomaly Prediction and Alert System")
dt_model = joblib.load("C:\\Users\\hp\\Desktop\\ACP_project\\models\\decision_tree_model.pkl")
iso_model = joblib.load("C:\\Users\\hp\\Desktop\\ACP_project\\models\\isolation_forest_model.pkl")

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
