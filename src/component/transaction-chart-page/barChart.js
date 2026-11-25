"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { ColorSwatch } from "@heroui/react";

export function BarChartUI({
  firstData,
  secondData,
  timeFilter,
  title,
  firstLabel,
  secondLabel,
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const groupedData = {};

  if (timeFilter === "7days") {
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      groupedData[key] = {
        date: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        totalFirst: 0,
        totalSecond: 0,
      };
    }

    firstData.forEach((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      if (groupedData[key]) {
        groupedData[key].totalFirst += item.total;
      }
    });

    secondData.forEach((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      if (groupedData[key]) {
        groupedData[key].totalSecond += item.total;
      }
    });
  } else if (timeFilter === "thisMonth") {
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let start = 1; start <= lastDay; start += 7) {
      const end = Math.min(start + 6, lastDay);
      const key = Math.floor((start - 1) / 7);

      groupedData[key] = {
        date: `${start} - ${end} ${new Date(year, month).toLocaleDateString(
          "id-ID",
          {
            month: "short",
          },
        )}`,
        totalFirst: 0,
        totalSecond: 0,
      };
    }

    firstData.forEach((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const key = Math.floor((date.getDate() - 1) / 7);

      if (groupedData[key]) {
        groupedData[key].totalFirst += item.total;
      }
    });

    secondData.forEach((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const key = Math.floor((date.getDate() - 1) / 7);

      if (groupedData[key]) {
        groupedData[key].totalSecond += item.total;
      }
    });
  } else if (timeFilter === "thisYear") {
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);

      groupedData[i] = {
        date: date.toLocaleDateString("id-ID", {
          month: "short",
        }),
        totalFirst: 0,
        totalSecond: 0,
      };
    }

    firstData.forEach((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const key = date.getMonth();

      if (groupedData[key]) {
        groupedData[key].totalFirst += item.total;
      }
    });

    secondData.forEach((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const key = date.getMonth();

      if (groupedData[key]) {
        groupedData[key].totalSecond += item.total;
      }
    });
  }

  const chartData = Object.values(groupedData);

  const maxValue = Math.max(
    ...chartData.map((item) => Math.max(item.totalFirst, item.totalSecond)),
    0,
  );

  const safeMax = Math.max(0, maxValue ?? 0);
  const yPadding = safeMax === 0 ? 5 : Math.max(3, Math.ceil(safeMax * 0.15));
  const yMax = safeMax + yPadding;

  return (
    <div className="w-full rounded-xl border bg-white p-5 space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div>
        <div className="flex space-x-3 items-center">
          <ColorSwatch aria-label="Blue" color="#1e293b" size="xs" />
          <p>{firstLabel}</p>
        </div>

        <div className="flex space-x-3 items-center">
          <ColorSwatch aria-label="Blue" color="#94a3b8" size="xs" />
          <p>{secondLabel}</p>
        </div>
      </div>

      <div className="h-100 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} domain={[0, yMax]} />

            <Bar
              dataKey="totalFirst"
              name="Data Pertama"
              fill="#1e293b"
              radius={[5, 5, 0, 0]}
            >
              <LabelList dataKey="totalFirst" position="top" />
            </Bar>

            <Bar
              dataKey="totalSecond"
              name="Data Kedua"
              fill="#94a3b8"
              radius={[5, 5, 0, 0]}
            >
              <LabelList dataKey="totalSecond" position="top" />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
