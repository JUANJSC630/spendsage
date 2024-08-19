"use client";
import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Alquiler", A: 4000 },
  { subject: "Comida", A: 3000 },
  { subject: "Transporte", A: 2000 },
  { subject: "Entretenimiento", A: 1000 },
];

export function ExpenseRadarChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart outerRadius={150} width={600} height={400} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 5000]} />
        <Radar
          name="Gastos"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}
