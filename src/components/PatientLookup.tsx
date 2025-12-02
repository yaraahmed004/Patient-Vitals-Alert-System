import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { PatientInfo } from './PatientInfo';

// Mock patient database
const patients = {
  'P001': {
    id: 'P001',
    name: 'Sarah Johnson',
    age: 45,
    room: '302-A',
    vitals: {
      heartRate: 78,
      bloodPressure: '120/80',
      temperature: 98.6,
      oxygenSaturation: 98,
      respiratoryRate: 16
    },
    status: 'stable',
    lastUpdated: '2 minutes ago'
  },
  'P002': {
    id: 'P002',
    name: 'Michael Chen',
    age: 62,
    room: '305-B',
    vitals: {
      heartRate: 105,
      bloodPressure: '145/92',
      temperature: 99.8,
      oxygenSaturation: 94,
      respiratoryRate: 22
    },
    status: 'warning',
    lastUpdated: '1 minute ago'
  },
  'P003': {
    id: 'P003',
    name: 'Emily Rodriguez',
    age: 34,
    room: '208-C',
    vitals: {
      heartRate: 72,
      bloodPressure: '118/76',
      temperature: 98.4,
      oxygenSaturation: 99,
      respiratoryRate: 14
    },
    status: 'stable',
    lastUpdated: '5 minutes ago'
  }
};

export function PatientLookup() {
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[keyof typeof patients] | null>(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    const patient = patients[patientId.toUpperCase() as keyof typeof patients];
    
    if (patient) {
      setSelectedPatient(patient);
    } else {
      setSelectedPatient(null);
      setError('Patient not found. Try P001, P002, or P003');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
      <div className="mb-6">
        <h2 className="text-stone-800 mb-4">Manual Patient Lookup</h2>
        
        {/* Search Input */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Patient ID (e.g., P001)"
              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent text-stone-800 placeholder:text-stone-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-amber-800 text-stone-50 rounded-xl hover:bg-amber-900 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Patient Information */}
      {selectedPatient && <PatientInfo patient={selectedPatient} />}

      {/* Helper Text */}
      {!selectedPatient && !error && (
        <div className="text-center py-12">
          <p className="text-stone-500">Enter a patient ID to view their vital signs</p>
          <p className="text-stone-400 text-sm mt-2">Available IDs: P001, P002, P003</p>
        </div>
      )}
    </div>
  );
}
