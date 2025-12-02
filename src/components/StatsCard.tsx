interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, change, isPositive, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700">
          {icon}
        </div>
        <span className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-neutral-600 mb-1">{title}</p>
        <p className="text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
