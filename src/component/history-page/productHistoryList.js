"use client";
import { Table, Label } from "@heroui/react";
import { OutletSelection } from "@/component/outletSelection";
import { TimeFilter } from "@/component/timeFilter";
import { ActivityFilter } from "@/component/activityFilter";
import { PaginationUi } from "@/component/pagination";
import { RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { parseDate } from "@internationalized/date";

export function ProductHistoryList({
  outlets,
  history,
  selectedOutletId,
  timeFilter,
  activityFilter,
  currentPage,
  totalPages,
  totalItems,
  customStartDate,
  customEndDate,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState(() => {
    if (!customStartDate || !customEndDate) return null;

    return {
      start: parseDate(customStartDate),
      end: parseDate(customEndDate),
    };
  });

  useEffect(() => {
    if (!customStartDate || !customEndDate) {
      setDateRange(null);
      return;
    }

    setDateRange({
      start: parseDate(customStartDate),
      end: parseDate(customEndDate),
    });
  }, [customStartDate, customEndDate]);

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

  const timeOptions = [
    { id: "all", label: "Semua" },
    { id: "today", label: "Hari Ini" },
    { id: "week", label: "Minggu Ini" },
    { id: "month", label: "Bulan Ini" },
    { id: "custom", label: "Kustom" },
  ];

  function handleTimeFilterChange(value) {
    setDateRange(null);

    updateQuery({
      timeFilter: value,
      startDate: null,
      endDate: null,
      page: 1,
    });
  }

  function handleDateRangeChange(value) {
    setDateRange(value);

    if (!value) {
      updateQuery({
        startDate: null,
        endDate: null,
        page: 1,
      });
      return;
    }

    updateQuery({
      timeFilter: "custom",
      startDate: value.start.toString(),
      endDate: value.end.toString(),
      page: 1,
    });
  }

  function handleActivityChange(value) {
    updateQuery({
      activityFilter: value === "all" ? null : value,
      page: 1,
    });
  }
  function handlePageChange(page) {
    updateQuery({ page });
  }

  return (
    <>
      <div className="flex gap-3 items-center">
        <RefreshCw size={30} />
        <h1 className="text-2xl font-bold">Daftar Mutasi Stok</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />
      <div className="flex space-x-5">
        <TimeFilter
          timeFilter={timeFilter}
          setTimeFilter={handleTimeFilterChange}
          dateRange={dateRange}
          setDateRange={handleDateRangeChange}
          options={timeOptions}
        />
        <ActivityFilter
          activityFilter={activityFilter}
          setActivityFilter={handleActivityChange}
        />
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Riwayat barang" className="min-w-150">
            <Table.Header>
              <Table.Column isRowHeader className="w-[25%]">
                Nama Produk
              </Table.Column>
              <Table.Column className="w-[13%]">Kategori</Table.Column>
              <Table.Column className="w-[16%]">Mutasi Stok</Table.Column>
              <Table.Column className="w-[13%]">Transfer Produk</Table.Column>
              <Table.Column className="w-[8%]">Jumlah</Table.Column>
              <Table.Column className="w-[10%]">Staff</Table.Column>
              <Table.Column className="w-[15%]">Waktu</Table.Column>
            </Table.Header>

            <Table.Body>
              {history.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.productName}</Table.Cell>
                  <Table.Cell>{item.productCategory}</Table.Cell>
                  <Table.Cell>
                    <Label
                      className={
                        item.activity === "Keluar"
                          ? "rounded-2xl px-4 py-2 bg-danger/20 text-danger font-bold"
                          : "rounded-2xl px-4 py-2 bg-success/20 text-success font-bold"
                      }
                    >
                      {item.type}
                    </Label>
                  </Table.Cell>
                  <Table.Cell
                    className={
                      item.activity === "Keluar"
                        ? "text-danger font-bold"
                        : "text-success font-bold"
                    }
                  >
                    {item.activity === "Keluar" ? item.sendTo : item.getFrom}
                  </Table.Cell>

                  <Table.Cell
                    className={
                      item.activity === "Keluar"
                        ? "text-danger font-bold"
                        : "text-success font-bold"
                    }
                  >
                    {item.activity === "Keluar"
                      ? `- ${item.quantity}`
                      : `+ ${item.quantity}`}
                  </Table.Cell>
                  <Table.Cell>{item.userName}</Table.Cell>
                  <Table.Cell>
                    {new Date(item.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <PaginationUi
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />
    </>
  );
}
