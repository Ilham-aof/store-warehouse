"use client";

import { Table, Dropdown, Label, Button } from "@heroui/react";
import { EllipsisVertical, ClipboardClock, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { PaginationUi } from "@/component/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { OutletSelection } from "@/component/outletSelection";
import { SearchBar } from "@/component/searchBar";
import { TimeFilter } from "@/component/timeFilter";
import { WarrantyFilter } from "@/component/warrantyFilter";
import { ServiceDetailModal } from "@/component/service-page/ServiceDetailModal";
import { parseDate } from "@internationalized/date";
import { ReceiptStatusFilter } from "@/component/receiptStatusFilter";

export function ServiceHistoryList({
  outlets,
  receipts,
  selectedOutletId,
  receiptStatusFilter,
  timeFilter,
  warrantyFilter,
  currentPage,
  totalPages,
  totalItems,
  customStartDate,
  customEndDate,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    if (!customStartDate || !customEndDate) return null;

    return {
      start: parseDate(customStartDate),
      end: parseDate(customEndDate),
    };
  });
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("search") ?? "",
  );

  useEffect(() => {
    setSearchKeyword(searchParams.get("search") ?? "");
  }, [searchParams]);

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
      if (value === "" || value == null || value === "all") {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    });

    const queryString = query.toString();
    router.push(queryString ? `?${queryString}` : "?");
  }

  function handleSearch() {
    updateQuery({
      search: searchKeyword.trim(),
      page: 1,
    });
  }

  function handleReceiptStatusFilterChange(value) {
    updateQuery({
      receiptStatusFilter: value,
      page: 1,
    });
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

  function handleWarrantyFilterChange(value) {
    updateQuery({
      warrantyFilter: value,
      page: 1,
    });
  }

  function handlePageChange(page) {
    updateQuery({ page });
  }

  return (
    <section className="space-y-5">
      <div className="flex gap-3 items-center">
        <ClipboardClock size={30} />
        <h1 className="text-2xl font-bold">Daftar Riwayat Servis</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />
      <SearchBar
        keyword={searchKeyword}
        onKeywordChange={setSearchKeyword}
        onSearch={handleSearch}
        placeholder="Cari nota / nama pelanggan..."
      />

      <div className="flex space-x-5">
        <ReceiptStatusFilter
          receiptStatusFilter={receiptStatusFilter}
          setReceiptStatusFilter={handleReceiptStatusFilterChange}
        />
        <TimeFilter
          timeFilter={timeFilter}
          setTimeFilter={handleTimeFilterChange}
          dateRange={dateRange}
          setDateRange={handleDateRangeChange}
          options={timeOptions}
        />
        <WarrantyFilter
          warrantyFilter={warrantyFilter}
          setWarrantyFilter={handleWarrantyFilterChange}
        />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar nota servis" className="min-w-250">
            <Table.Header>
              <Table.Column isRowHeader className="w-[15%]">
                Kode Nota
              </Table.Column>
              <Table.Column className="w-[25%]">Pelanggan</Table.Column>
              <Table.Column className="w-[15%]">Detail Servis</Table.Column>
              <Table.Column className="w-[10%]">Status Nota</Table.Column>
              <Table.Column className="w-[12%]">Staf</Table.Column>
              <Table.Column className="w-[13%]">Tanggal Nota</Table.Column>
              <Table.Column className="w-[10%]"></Table.Column>
            </Table.Header>

            <Table.Body>
              {receipts?.map((receipt) => (
                <Table.Row key={receipt.id}>
                  <Table.Cell className="whitespace-nowrap">
                    {receipt.invoiceNumber}
                  </Table.Cell>

                  <Table.Cell>
                    <p className="text-md font-bold">{receipt.customerName}</p>
                    <p className="text-sm text-muted">
                      No. HP/WA : {receipt.customerPhone || "-"}
                    </p>
                    <p className="text-sm text-muted">
                      Tipe HP : {receipt.device}
                    </p>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(receipt)}
                        className="text-blue-600 hover:underline text-left"
                      >
                        Lihat {receipt.serviceItems.length} perbaikan
                      </button>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <Label
                      className={
                        receipt.receiptStatus === "Cancel"
                          ? "rounded-2xl px-4 py-2 bg-danger/20 text-danger font-bold"
                          : "rounded-2xl px-4 py-2 bg-success/20 text-success font-bold"
                      }
                    >
                      {receipt.receiptStatus}
                    </Label>
                  </Table.Cell>

                  <Table.Cell> {receipt.user.name}</Table.Cell>

                  <Table.Cell>
                    {receipt.createdAt.toLocaleDateString("id-ID")}
                  </Table.Cell>

                  <Table.Cell className="ring-0 outline-none shadow-none ring-offset-0">
                    <div className="flex justify-center">
                      <Dropdown>
                        <Button
                          aria-label="Menu"
                          variant="secondary"
                          isIconOnly
                        >
                          <EllipsisVertical className="text-slate-800" />
                        </Button>
                        <Dropdown.Popover className="p-1">
                          <Dropdown.Menu className="space-y-2">
                            <Dropdown.Item
                              id="cetak"
                              textValue="Cetak Nota"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                              onAction={() =>
                                router.push(`/serviceReceipt/${receipt.id}`)
                              }
                            >
                              <Printer />
                              <Label>Cetak Nota</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <ServiceDetailModal
        isOpen={!!selectedReceipt}
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <PaginationUi
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />
    </section>
  );
}
