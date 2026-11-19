"use client";
import {
  Table,
  Switch,
  Dropdown,
  Label,
  Separator,
  Button,
  Chip,
} from "@heroui/react";
import { EllipsisVertical, ChartColumn, Printer } from "lucide-react";
import { useState, useEffect } from "react";

import { PaginationUi } from "@/component/pagination";
import { updateProcessStatus } from "@/app/action/serviceReceipt/updateProcessStatus";
import { useRouter, useSearchParams } from "next/navigation";
import { OutletSelection } from "@/component/outletSelection";
import { SearchBar } from "@/component/searchBar";
import { TimeFilter } from "@/component/timeFilter";
import { WarrantyFilter } from "@/component/warrantyFilter";
import { ServiceDetailModal } from "@/component/service-page/ServiceDetailModal";
import { parseDate } from "@internationalized/date";
import { ReceiptStatusFilter } from "@/component/receiptStatusFilter";
import { BarChartUI } from "@/component/transaction-chart-page/barChart";

export function TransactionChart({
  outlets,
  selectedOutletId,
  timeFilter,
  serviceReceipt,
  saleReceipt,
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
  console.log("Service :", serviceReceipt.chartDataService);
  console.log("sale :", saleReceipt.chartDataSale);

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center">
        <ChartColumn size={30} />
        <h1 className="text-2xl font-bold">Grafik Transaksi</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />

      <TimeFilter
        timeFilter={timeFilter}
        setTimeFilter={handleTimeFilterChange}
        options={chartTimeOptions}
      />
      <BarChartUI
        serviceData={serviceReceipt.chartDataService}
        saleData={saleReceipt.chartDataSale}
        timeFilter={timeFilter}
      />
    </div>
  );
}
