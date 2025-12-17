import React, { useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function TrafficPage() {
  const trafficData = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
        visitors: Math.round(8000 + Math.random() * 8000 - i * 200),
        postViews: Math.round(3000 + Math.random() * 4000 - i * 80),
      })),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Traffic (12 months)</h2>
          <Link href="/admin/pages">
            <button className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Chart */}
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="postViews" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
