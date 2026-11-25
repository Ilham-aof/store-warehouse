"use client";
import { Table, Dropdown, Label, Separator, Button } from "@heroui/react";
import { EllipsisVertical, ShoppingBag, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { PaginationUi } from "@/component/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { OutletSelection } from "@/component/outletSelection";
import { SearchBar } from "@/component/searchBar";
import { TimeFilter } from "@/component/timeFilter";
import { ListProductModal } from "@/component/sale-history-page/listProductModal";
import { parseDate } from "@internationalized/date";

export function SaleHistoryList({
  outlets,
  receipts,
  selectedOutletId,
  timeFilter,
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
    const keyword = searchKeyword.trim();

    updateQuery({
      search: keyword.length >= 2 ? keyword : null,
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

  function handlePageChange(page) {
    updateQuery({ page });
  }

  return (
    <section className="space-y-5">
      <div className="flex gap-3 items-center">
        <ShoppingBag size={30} />
        <h1 className="text-2xl font-bold">Daftar Riwayat Penjualan</h1>
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
        <Separator orientation="vertical" />
        <SearchBar
          keyword={searchKeyword}
          onKeywordChange={setSearchKeyword}
          onSearch={handleSearch}
          placeholder="Cari nota..."
        />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar nota servis" className="min-w-250">
            <Table.Header>
              <Table.Column isRowHeader className="w-[20%]">
                Kode Nota
              </Table.Column>
              <Table.Column className="w-[20%]">Produk</Table.Column>
              <Table.Column className="w-[20%]">Total Transaksi</Table.Column>
              <Table.Column className="w-[10%]">Staf</Table.Column>
              <Table.Column className="w-[20%]">Tanggal</Table.Column>
              <Table.Column className="w-[10%]"></Table.Column>
            </Table.Header>

            <Table.Body>
              {receipts.map((receipt) => (
                <Table.Row key={receipt.id}>
                  <Table.Cell className="whitespace-nowrap">
                    {receipt.invoiceNumber}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(receipt)}
                        className="text-blue-600 hover:underline text-left"
                      >
                        Lihat {receipt.saleItems.length} produk
                      </button>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(receipt.totalAmount)}
                  </Table.Cell>

                  <Table.Cell className="whitespace-nowrap">
                    {receipt.user.name}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(receipt.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                                router.push(`/saleReceipt/${receipt.id}`)
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
      <ListProductModal
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
