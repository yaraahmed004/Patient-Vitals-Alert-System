import { useState } from 'react';
import { PatientLookup } from './components/PatientLookup';
import { RealtimeDashboard } from './components/RealtimeDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-stone-800 mb-1">Patient Vitals Alert System</h1>
          <p className="text-stone-600">Monitor and track patient vital signs</p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Manual Patient Lookup */}
          <PatientLookup />

          {/* Right Side - Real-time Dashboard */}
          <RealtimeDashboard />
        </div>
      </div>
    </div>
  );
}
