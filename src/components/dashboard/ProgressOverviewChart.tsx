"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface ChartDataPoint {
  day: string;
  sabaq: number;
  sabqi: number;
  manzil: number;
}

interface Props {
  data: ChartDataPoint[];
}

export const ProgressOverviewChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
        Aktivitas Hafalan Harian (Sabaq, Sabqi, Manzil)
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="sabaq" name="Sabaq (Baru)" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="sabqi" name="Sabqi (Pekan Ini)" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="manzil" name="Manzil (Lama)" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
