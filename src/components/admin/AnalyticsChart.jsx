import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Real Data Processor
const generateRealData = (type, dailyViewsMap) => {
  if (!dailyViewsMap) return [];
  
  const data = [];
  const now = new Date();

  if (type === 'weekly') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      data.push({
        name: days[d.getDay()],
        views: dailyViewsMap[dateString] || 0,
      });
    }
  } else if (type === 'monthly') {
    // Sum views for the past 4 weeks (7 day chunks)
    for (let i = 4; i >= 1; i--) {
      let weekViews = 0;
      for (let j = 0; j < 7; j++) {
        const d = new Date();
        d.setDate(now.getDate() - ((i - 1) * 7 + j));
        const dateString = d.toISOString().split('T')[0];
        weekViews += dailyViewsMap[dateString] || 0;
      }
      data.push({
        name: `Week ${5 - i}`,
        views: weekViews,
      });
    }
  } else if (type === 'yearly') {
    // Sum views for the past 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      let m = now.getMonth() - i;
      let y = now.getFullYear();
      if (m < 0) {
        m += 12;
        y -= 1;
      }
      
      let monthViews = 0;
      const prefix = `${y}-${String(m + 1).padStart(2, '0')}`;
      
      Object.keys(dailyViewsMap).forEach(dateStr => {
        if (dateStr.startsWith(prefix)) {
          monthViews += dailyViewsMap[dateStr];
        }
      });

      data.push({
        name: months[m],
        views: monthViews,
      });
    }
  }
  
  return data;
};

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
  const [dailyViewsMap, setDailyViewsMap] = useState({});
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Real Analytics Data from Firebase
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'analytics', 'visitors'));
        if (docSnap.exists() && docSnap.data().dailyViews) {
          const fetchedMap = docSnap.data().dailyViews;
          setDailyViewsMap(fetchedMap);
          setChartData(generateRealData(timeRange, fetchedMap));
        } else {
          // If no dailyViews exist yet, initialize an empty map so it shows 0s
          setChartData(generateRealData(timeRange, {}));
        }
      } catch (error) {
        console.error("Failed to load analytics chart data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const handleTabChange = (range) => {
    setTimeRange(range);
    setChartData(generateRealData(range, dailyViewsMap));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 w-full mb-12">
      
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Visitor Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time traffic overview</p>
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
      <div className="w-full h-72 sm:h-96 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
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
        )}
      </div>

    </div>
  );
}
