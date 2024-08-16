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
  { name: "Davivienda", value: 1200000 },
  { name: "Nu", value: 150000 },
  { name: "Nequi", value: 230000 },
  { name: "Bancolombia", value: 500000 },
  { name: "Banco de Bogotá", value: 200000 },
  { name: "Banco de Occidente", value: 100000 },
  { name: "Efectivo", value: 50000 },
];

const AccountDistributionPieChart = () => (
  <ResponsiveContainer width="100%" height={500}>
    <PieChart width={600} height={300}>
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

export default AccountDistributionPieChart;
