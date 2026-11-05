'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const RANGES = { weekly: 'Last 7 days', monthly: 'Last 4 weeks', yearly: 'Last 6 months' };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const iso = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// Turn the { 'YYYY-MM-DD': views } map into chart points for the chosen range.
function buildSeries(range, views) {
  if (range === 'weekly') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = daysAgo(6 - i);
      return { name: DAYS[d.getDay()], views: views[iso(d)] || 0 };
    });
  }
  if (range === 'monthly') {
    return Array.from({ length: 4 }, (_, w) => {
      let sum = 0;
      for (let j = 0; j < 7; j++) sum += views[iso(daysAgo((3 - w) * 7 + j))] || 0;
      return { name: `Week ${w + 1}`, views: sum };
    });
  }
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const sum = Object.entries(views).reduce((s, [date, v]) => (date.startsWith(prefix) ? s + v : s), 0);
    return { name: MONTHS[d.getMonth()], views: sum };
  });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-sm shadow-xl">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold">{payload[0].value} views</p>
    </div>
  );
}

export function AnalyticsChart({ dailyViews }) {
  const [range, setRange] = useState('weekly');
  const data = useMemo(() => buildSeries(range, dailyViews), [range, dailyViews]);
  const total = data.reduce((s, p) => s + p.views, 0);

  return (
    <div className="card p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Page views · {RANGES[range]}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{total.toLocaleString()}</p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-bg p-1">
          {Object.keys(RANGES).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${range === r ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)' }} />
            <Area type="monotone" dataKey="views" stroke="var(--accent)" strokeWidth={2.5} fill="url(#viewsFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
