import { VitalCard } from './VitalCard';
import { Heart, Activity, Thermometer, Wind, Droplets } from 'lucide-react';

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
    status: 'stable' | 'warning' | 'critical';
    lastUpdated: string;
  };
}

export function PatientInfo({ patient }: PatientInfoProps) {
  const statusColors = {
    stable: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div>
      {/* Patient Header */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-stone-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-stone-800">{patient.name}</h3>
            <p className="text-stone-600">ID: {patient.id} • Age: {patient.age} • Room: {patient.room}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[patient.status]}`}>
            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
          </span>
        </div>
        <p className="text-stone-500 text-sm">Last updated: {patient.lastUpdated}</p>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-3">
        <VitalCard
          icon={<Heart className="w-5 h-5" />}
          label="Heart Rate"
          value={patient.vitals.heartRate}
          unit="bpm"
          status={patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60 ? 'warning' : 'normal'}
          range="60-100"
        />
        <VitalCard
          icon={<Activity className="w-5 h-5" />}
          label="Blood Pressure"
          value={patient.vitals.bloodPressure}
          unit="mmHg"
          status={patient.vitals.bloodPressure.startsWith('145') ? 'warning' : 'normal'}
          range="90/60-120/80"
        />
        <VitalCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Temperature"
          value={patient.vitals.temperature}
          unit="°F"
          status={patient.vitals.temperature > 99.5 ? 'warning' : 'normal'}
          range="97.8-99.1"
        />
        <VitalCard
          icon={<Droplets className="w-5 h-5" />}
          label="O₂ Saturation"
          value={patient.vitals.oxygenSaturation}
          unit="%"
          status={patient.vitals.oxygenSaturation < 95 ? 'warning' : 'normal'}
          range="95-100"
        />
        <VitalCard
          icon={<Wind className="w-5 h-5" />}
          label="Respiratory Rate"
          value={patient.vitals.respiratoryRate}
          unit="bpm"
          status={patient.vitals.respiratoryRate > 20 || patient.vitals.respiratoryRate < 12 ? 'warning' : 'normal'}
          range="12-20"
          fullWidth
        />
      </div>
    </div>
  );
}
