import { Heart, Droplets } from 'lucide-react';

interface MonitorCardProps {
  patient: {
    id: string;
    name: string;
    room: string;
    heartRate: number;
    oxygenSaturation: number;
    status: 'stable' | 'warning' | 'critical';
  };
}

export function MonitorCard({ patient }: MonitorCardProps) {
  const statusColors = {
    stable: 'border-green-200 bg-white',
    warning: 'border-amber-300 bg-amber-50',
    critical: 'border-red-300 bg-red-50'
  };

  const statusDots = {
    stable: 'bg-green-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500'
  };

  return (
    <div className={`rounded-xl p-4 border ${statusColors[patient.status]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusDots[patient.status]} animate-pulse`} />
          <div>
            <p className="text-stone-800">{patient.name}</p>
            <p className="text-stone-600 text-sm">{patient.id} • Room {patient.room}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-stone-700" />
          </div>
          <div>
            <p className="text-stone-900">{patient.heartRate}</p>
            <p className="text-stone-500 text-xs">bpm</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
            <Droplets className="w-4 h-4 text-stone-700" />
          </div>
          <div>
            <p className="text-stone-900">{patient.oxygenSaturation}%</p>
            <p className="text-stone-500 text-xs">O₂</p>
          </div>
        </div>
      </div>
    </div>
  );
}
