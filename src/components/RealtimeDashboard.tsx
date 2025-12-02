import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { MonitorCard } from './MonitorCard';

// Mock real-time patient data
const monitoredPatients = [
  {
    id: 'P001',
    name: 'Sarah Johnson',
    room: '302-A',
    heartRate: 78,
    oxygenSaturation: 98,
    status: 'stable' as const
  },
  {
    id: 'P002',
    name: 'Michael Chen',
    room: '305-B',
    heartRate: 105,
    oxygenSaturation: 94,
    status: 'warning' as const
  },
  {
    id: 'P003',
    name: 'Emily Rodriguez',
    room: '208-C',
    heartRate: 72,
    oxygenSaturation: 99,
    status: 'stable' as const
  }
];

export function RealtimeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stableCount = monitoredPatients.filter(p => p.status === 'stable').length;
  const warningCount = monitoredPatients.filter(p => p.status === 'warning').length;

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

        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-700" />
              <span className="text-green-900">Stable</span>
            </div>
            <p className="text-green-700">{stableCount} patients</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <span className="text-amber-900">Warning</span>
            </div>
            <p className="text-amber-700">{warningCount} patients</p>
          </div>
        </div>

        {/* Real-time Notice */}
        <div className="bg-stone-800 text-stone-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Activity className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="mb-1">Real-time Updates (Coming Soon)</p>
            <p className="text-stone-300 text-sm">
              This dashboard will automatically refresh with live patient data. Currently showing mock data for demonstration.
            </p>
          </div>
        </div>
      </div>

      {/* Monitored Patients */}
      <div className="space-y-3">
        <h3 className="text-stone-700 mb-3">Monitored Patients</h3>
        {monitoredPatients.map((patient) => (
          <MonitorCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
