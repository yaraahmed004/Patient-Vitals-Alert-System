import { useState, useEffect } from "react";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { MonitorCard } from "./MonitorCard";

interface Patient {
  id: string;
  name: string;
  room: string;
  heartRate: number;
  oxygenSaturation: number;
  status: "stable" | "warning" | "critical";
  anomaly?: string;
  alert_reasons?: string[];
}

export function RealtimeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [patients, setPatients] = useState<Patient[]>([]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // WebSocket for rotating 3-patient batches
  useEffect(() => {
    const url = "ws://localhost:8000/ws/live_patients";
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected to live_patients websocket");
    };

    ws.onmessage = (event) => {
      try {
        const batch: any[] = JSON.parse(event.data);

        // Map backend fields -> frontend Patient type
        const formatted: Patient[] = batch.map((p) => ({
          id: `P${p.patient_id.toString().padStart(3, "0")}`,
          name: p.name || `Patient ${p.patient_id}`,
          room: p.room || "N/A",
          heartRate: p.heartbeat ?? 0,
          oxygenSaturation: p.spo2 ?? 0,
          status:
            p.status === "Normal"
              ? "stable"
              : p.status === "Mild Abnormality"
              ? "warning"
              : "critical",
          anomaly: p.anomaly,
          alert_reasons: p.reasons ?? [],
        }));

        // Replace the current batch with the incoming batch (exactly 3)
        setPatients(formatted);
      } catch (err) {
        console.error("Failed parsing WS batch:", err, event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error (live_patients):", err);
    };

    ws.onclose = () => {
      console.log("Live patients WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const stableCount = patients.filter((p) => p.status === "stable").length;
  const warningCount = patients.filter((p) => p.status === "warning").length;
  const criticalCount = patients.filter((p) => p.status === "critical").length;

  return (
    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-stone-800">Real-time Monitoring</h2>
          <div className="flex items-center gap-2 text-stone-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="bg-stone-800 text-stone-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Activity className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="mb-1">Real-time Updates Active</p>
            <p className="text-stone-300 text-sm">
              Displaying 3 patients at a time; batches rotate every 5 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Monitored Patients */}
      <div className="space-y-3">
        <h3 className="text-stone-700 mb-3">Monitored Patients</h3>
        {patients.length === 0 ? (
          <div className="text-stone-500">Waiting for live data...</div>
        ) : (
          patients.map((patient) => (
            <MonitorCard key={patient.id} patient={patient} />
          ))
        )}
      </div>
    </div>
  );
}
