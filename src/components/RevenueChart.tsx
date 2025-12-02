import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4200 },
  { name: 'Feb', revenue: 3800 },
  { name: 'Mar', revenue: 5100 },
  { name: 'Apr', revenue: 4600 },
  { name: 'May', revenue: 6200 },
  { name: 'Jun', revenue: 5800 },
];

export function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200">
      <h3 className="text-neutral-900 mb-6">Monthly Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Bar 
            dataKey="revenue" 
            fill="#171717" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
