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

export function BarChartUI({ serviceData, saleData, timeFilter }) {
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
        totalService: 0,
        totalSale: 0,
      };
    }

    serviceData.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      if (groupedData[key]) {
        groupedData[key].totalService++;
      }
    });

    saleData.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      if (groupedData[key]) {
        groupedData[key].totalSale++;
      }
    });
  }

  // Bulan ini, per minggu
  else if (timeFilter === "thisMonth") {
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
        totalService: 0,
        totalSale: 0,
      };
    }

    serviceData.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = Math.floor((date.getDate() - 1) / 7);

      if (groupedData[key]) {
        groupedData[key].totalService++;
      }
    });

    saleData.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = Math.floor((date.getDate() - 1) / 7);

      if (groupedData[key]) {
        groupedData[key].totalSale++;
      }
    });
  }

  // Tahun ini, per bulan
  else if (timeFilter === "thisYear") {
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);

      groupedData[i] = {
        date: date.toLocaleDateString("id-ID", {
          month: "short",
        }),
        totalService: 0,
        totalSale: 0,
      };
    }

    serviceData.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = date.getMonth();

      if (groupedData[key]) {
        groupedData[key].totalService++;
      }
    });

    saleData.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = date.getMonth();

      if (groupedData[key]) {
        groupedData[key].totalSale++;
      }
    });
  }

  const chartData = Object.values(groupedData);

  const maxValue = Math.max(
    ...chartData.map((item) => Math.max(item.totalService, item.totalSale)),
    0,
  );

  return (
    <div className="w-full rounded-xl border bg-white p-5 space-y-3">
      <h2 className="text-lg font-semibold">
        Statistik Nota Servis & Penjualan
      </h2>

      <div>
        <div className="flex space-x-3 items-center">
          <ColorSwatch aria-label="Blue" color="#1e293b" size="xs" />
          <p>Total Nota Servis</p>
        </div>

        <div className="flex space-x-3 items-center">
          <ColorSwatch aria-label="Blue" color="#94a3b8" size="xs" />
          <p>Total Nota Penjualan</p>
        </div>
      </div>

      <div className="h-100 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="date" />

            <YAxis allowDecimals={false} domain={[0, maxValue + 2]} />

            <Bar
              dataKey="totalService"
              name="Jumlah Nota Servis"
              fill="#1e293b"
              radius={[5, 5, 0, 0]}
            >
              <LabelList dataKey="totalService" position="top" />
            </Bar>

            <Bar
              dataKey="totalSale"
              name="Jumlah Nota Penjualan"
              fill="#94a3b8"
              radius={[5, 5, 0, 0]}
            >
              <LabelList dataKey="totalSale" position="top" />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
