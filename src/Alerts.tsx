import { useState, useEffect } from "react";

type Alert = {
  patient_id: number;
  status: string;
  anomaly: "Yes" | "No";
  reasons: string[];
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/alerts");

    ws.onmessage = (event) => {
      const data: Alert = JSON.parse(event.data);
      setAlerts((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Real-Time Alerts</h2>
      {alerts.map((a, i) => (
        <div key={i} className="alert-card">
          <strong>{a.status}</strong><br />
          Patient ID: {a.patient_id}<br />
          Anomaly: {a.anomaly}<br />
          Reasons:
          <ul>
            {a.reasons.map((r, i2) => (
              <li key={i2}>{r}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
