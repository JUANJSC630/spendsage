"use client";
import { COLORS } from "@/utils/Colors.data";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Alquiler", value: 4000, fill: "#0088FE" },
  { name: "Comida", value: 3000, fill: "#00C49F" },
  { name: "Transporte", value: 2000, fill: "#FFBB28" },
  { name: "Entretenimiento", value: 1000, fill: "#FF8042" },
  // Agrega más categorías según sea necesario
];

const ExpensePieChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart width={400} height={200}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={150}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default ExpensePieChart;
