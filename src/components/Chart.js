import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ selectedRange }) => {
  // Sample data based on selected range
  const getChartData = () => {
    const baseData = {
      'Today': [
        { name: 'Morning', revenue: 12000, expenses: 8000 },
        { name: 'Afternoon', revenue: 18000, expenses: 10000 },
        { name: 'Evening', revenue: 15000, expenses: 7000 }
      ],
      'This Week': [
        { name: 'Mon', revenue: 25000, expenses: 15000 },
        { name: 'Tue', revenue: 30000, expenses: 18000 },
        { name: 'Wed', revenue: 28000, expenses: 16000 },
        { name: 'Thu', revenue: 35000, expenses: 20000 },
        { name: 'Fri', revenue: 40000, expenses: 22000 },
        { name: 'Sat', revenue: 45000, expenses: 25000 },
        { name: 'Sun', revenue: 32000, expenses: 18000 }
      ],
      'This Month': [
        { name: 'Week 1', revenue: 180000, expenses: 120000 },
        { name: 'Week 2', revenue: 220000, expenses: 140000 },
        { name: 'Week 3', revenue: 195000, expenses: 125000 },
        { name: 'Week 4', revenue: 250000, expenses: 160000 }
      ]
    };
    
    return baseData[selectedRange] || baseData['Today'];
  };

  const data = getChartData();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Sales Trends</h3>
        <p className="text-sm text-gray-600">Revenue vs Expenses - {selectedRange}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip 
            formatter={(value) => [formatCurrency(value), '']}
            labelStyle={{ color: '#374151' }}
          />
          <Legend />
          <Bar 
            dataKey="revenue" 
            fill="#3B82F6" 
            name="Revenue"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="expenses" 
            fill="#EF4444" 
            name="Expenses"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart; 
