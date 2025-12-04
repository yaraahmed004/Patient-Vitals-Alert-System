interface PatientInfoProps {
  patient: {
    id: string;
    name: string;
    age: number;
    room: string;
    vitals: {
      heartRate: number;
      bloodPressure: string;
      temperature: number;
      oxygenSaturation: number;
      respiratoryRate: number;
    };
    status: "stable" | "warning" | "critical";
    lastUpdated: string;
    alert?: boolean;
    alert_reasons?: string[];
    anomaly?: string;
  };
}

export function PatientInfo({ patient }: PatientInfoProps) {
  const statusColors = {
    stable: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div>
      {/* Patient Header */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-stone-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-stone-800">{patient.name}</h3>
            <p className="text-stone-600">
              ID: {patient.id} • Age: {patient.age} • Room: {patient.room}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm border ${
              statusColors[patient.status]
            }`}
          >
            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
          </span>
        </div>
        <p className="text-stone-500 text-sm">
          Last updated: {patient.lastUpdated}
        </p>

        {patient.alert &&
          patient.alert_reasons &&
          patient.alert_reasons.length > 0 && (
            <div className="mt-2 text-red-700 text-sm">
              <strong>Alerts:</strong> {patient.alert_reasons.join(", ")}
            </div>
          )}
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Replace with VitalCard as before */}
      </div>
    </div>
  );
}
