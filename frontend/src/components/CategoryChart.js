import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#14b8a6",
];

function CategoryChart({ data }) {

  if (!data || data.length === 0) {
    return (
      <div className="analytics-card">
        <h3>Expense Categories</h3>
        <p>No category data available</p>
      </div>
    );
  }

  return (
    <div className="analytics-card">

      <h3>Expense Categories</h3>

      <div className="chart-container">

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default CategoryChart;