interface VitalCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  range: string;
  fullWidth?: boolean;
}

export function VitalCard({ icon, label, value, unit, status, range, fullWidth }: VitalCardProps) {
  const statusColors = {
    normal: 'border-stone-200 bg-white',
    warning: 'border-amber-300 bg-amber-50',
    critical: 'border-red-300 bg-red-50'
  };

  const iconColors = {
    normal: 'bg-stone-100 text-stone-700',
    warning: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700'
  };

  return (
    <div className={`${fullWidth ? 'col-span-2' : ''} rounded-xl p-4 border ${statusColors[status]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColors[status]}`}>
          {icon}
        </div>
        <span className="text-stone-600 text-sm">{label}</span>
      </div>
      <div className="mb-1">
        <span className="text-stone-900">{value}</span>
        <span className="text-stone-600 text-sm ml-1">{unit}</span>
      </div>
      <p className="text-stone-500 text-xs">Normal: {range}</p>
    </div>
  );
}
