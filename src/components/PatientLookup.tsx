import { useState, useEffect } from "react";
import { Search, AlertCircle, Clock } from "lucide-react";
import { PatientInfo } from "./PatientInfo";

export function PatientLookup() {
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW: Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // (Optional) Load history from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem("patientHistory");
    if (saved) setSearchHistory(JSON.parse(saved));
  }, []);

  // (Optional) Save to localStorage
  useEffect(() => {
    localStorage.setItem("patientHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async () => {
    if (!patientId) return;

    setError("");
    setLoading(true);
    setPatientData(null);

    try {
      const res = await fetch(`http://localhost:8000/prediction/${patientId}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("Patient not found");

      const data = await res.json();

      const patient = {
        id: data.patient_id.toString(),
        name: `Patient ${data.patient_id}`,
        age: 0,
        room: "N/A",
        status:
          data.predicted_status === "Normal"
            ? "stable"
            : data.predicted_status === "Mild Abnormality"
            ? "warning"
            : "critical",
        lastUpdated: "Just now",
        vitals: {
          heartRate: 0,
          bloodPressure: "N/A",
          temperature: 0,
          oxygenSaturation: 0,
          respiratoryRate: 0,
        },
        alert: data.alert,
        alert_reasons: data.alert_reasons,
        anomaly: data.anomaly,
      };

      setPatientData(patient);

      // NEW: Update search history
      setSearchHistory((prev) => {
        const updated = prev.filter((id) => id !== patientId);
        return [patientId, ...updated].slice(0, 10); // keep max 10
      });
    } catch (err) {
      setError("Patient not found.");
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
      <div className="mb-6">
        <h2 className="text-stone-800 mb-4">Manual Patient Lookup</h2>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Patient ID (e.g., 101)"
            className="w-full px-4 py-3 bg-white border rounded-xl"
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-amber-800 text-stone-50 rounded-xl flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Show patient info */}
      {patientData && <PatientInfo patient={patientData} />}

      {!patientData && !error && (
        <div className="text-center py-12">
          <p className="text-stone-500">
            Enter a patient ID to view prediction
          </p>
        </div>
      )}

      {/* ---------------- HISTORY SECTION ---------------- */}
      <div className="mt-8 p-4 bg-white rounded-xl border border-stone-200">
        <h3 className="text-stone-800 font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-500" />
          Recent Lookups
        </h3>

        {searchHistory.length === 0 ? (
          <p className="text-sm text-stone-400">No recent lookups.</p>
        ) : (
          <ul className="space-y-2">
            {searchHistory.map((id, idx) => (
              <li
                key={idx}
                onClick={() => setPatientId(id)}
                className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg cursor-pointer flex justify-between"
              >
                <span className="font-medium text-stone-700">Patient {id}</span>
                <span className="text-xs text-stone-400">Tap to load</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
