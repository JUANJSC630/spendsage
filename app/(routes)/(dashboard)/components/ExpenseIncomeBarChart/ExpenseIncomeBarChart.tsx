"use client";
import React from "react";
import {
  BarChart,
  Bar,
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

type ExpenseIncomeBarChartProps = {
  data: {
    name: string;
    gastos: number;
    ingresos: number;
  }[];
};

const ExpenseIncomeBarChart = (props: ExpenseIncomeBarChartProps) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart width={300} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="gastos" fill="#8884d8" />
      <Bar dataKey="ingresos" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);

export default ExpenseIncomeBarChart;
