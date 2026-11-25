"use client";

import { ChartColumn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { OutletSelection } from "@/component/outletSelection";
import { TimeFilter } from "@/component/timeFilter";
import { BarChartUI } from "@/component/transaction-chart-page/barChart";

export function TransactionChart({
  outlets,
  selectedOutletId,
  timeFilter,
  serviceReceipt,
  saleReceipt,
  stockIns,
  stockOuts,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(params) {
    const query = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value == null) {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    });

    const queryString = query.toString();
    router.push(queryString ? `?${queryString}` : "?");
  }

  const chartTimeOptions = [
    { id: "7days", label: "7 Hari Terakhir" },
    { id: "thisMonth", label: "Bulan Ini" },
    { id: "thisYear", label: "Tahun Ini" },
  ];

  function handleTimeFilterChange(value) {
    updateQuery({
      timeFilter: value,
      page: 1,
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center">
        <ChartColumn size={30} />
        <h1 className="text-2xl font-bold">Statistik</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />

      <TimeFilter
        timeFilter={timeFilter}
        setTimeFilter={handleTimeFilterChange}
        options={chartTimeOptions}
      />

      <BarChartUI
        firstData={serviceReceipt.chartDataService}
        secondData={saleReceipt.chartDataSale}
        timeFilter={timeFilter}
        title="Statistik Nota"
        firstLabel="Total Nota Servis"
        secondLabel="Total Nota Penjualan"
      />

      <BarChartUI
        firstData={stockIns}
        secondData={stockOuts}
        timeFilter={timeFilter}
        title="Statistik Stok Barang"
        firstLabel="Stok Masuk"
        secondLabel="Stok Keluar"
      />
    </div>
  );
}
