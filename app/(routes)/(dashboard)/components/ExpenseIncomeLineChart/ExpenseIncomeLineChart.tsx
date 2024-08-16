"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Enero", gastos: 4000, ingresos: 2400 },
  { name: "Febrero", gastos: 3000, ingresos: 1398 },
  { name: "Marzo", gastos: 2000, ingresos: 9800 },
  // Agrega más datos según sea necesario
];

const ExpenseIncomeLineChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="gastos" stroke="#8884d8" />
      <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

export default ExpenseIncomeLineChart;
