import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 3800 },
  { name: 'Wed', value: 3200 },
  { name: 'Thu', value: 4500 },
  { name: 'Fri', value: 3900 },
  { name: 'Sat', value: 4800 },
  { name: 'Sun', value: 4200 },
];

export function ActivityChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200">
      <h3 className="text-neutral-900 mb-6">Weekly Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#a3a3a3"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#a3a3a3"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#171717" 
            strokeWidth={2}
            dot={{ fill: '#171717', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
