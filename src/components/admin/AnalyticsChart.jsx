import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Mock Data Generators for realistic looking charts
const generateMockData = (type) => {
  const data = [];
  const now = new Date();
  
  if (type === 'weekly') {
    // Generate data for the past 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      data.push({
        name: days[d.getDay()],
        views: Math.floor(Math.random() * 50) + 10,
      });
    }
  } else if (type === 'monthly') {
    // Generate data for the past 4 weeks
    for (let i = 4; i >= 1; i--) {
      data.push({
        name: `Week ${5 - i}`,
        views: Math.floor(Math.random() * 200) + 50,
      });
    }
  } else if (type === 'yearly') {
    // Generate data for the past 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      let m = now.getMonth() - i;
      if (m < 0) m += 12;
      data.push({
        name: months[m],
        views: Math.floor(Math.random() * 800) + 200,
      });
    }
  }
  
  return data;
};

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700">
        <p className="text-sm font-semibold mb-1 text-slate-300">{label}</p>
        <p className="text-xl font-bold text-blue-400">
          {payload[0].value} <span className="text-sm font-medium text-slate-400">views</span>
        </p>
      </div>
    );
  }
  return null;
};

export function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState('weekly');
  const [chartData, setChartData] = useState(generateMockData('weekly'));

  const handleTabChange = (range) => {
    setTimeRange(range);
    setChartData(generateMockData(range));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 w-full mb-12">
      
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Visitor Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Traffic overview over time (Simulated)</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          {['weekly', 'monthly', 'yearly'].map((range) => (
            <button
              key={range}
              onClick={() => handleTabChange(range)}
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${
                timeRange === range 
                  ? 'text-white' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {timeRange === range && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{range}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-72 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorViews)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
