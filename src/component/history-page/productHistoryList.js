"use client";
import { Table } from "@heroui/react";
import { OutletSelection } from "@/component/outletSelection";
import { TimeFilter } from "@/component/timeFilter";
import { PaginationUi } from "@/component/pagination";
import { useState, useEffect } from "react";
import { ClipboardClock } from "lucide-react";

export function ProductHistoryList({ outlets, history, selectedOutletId }) {
  const [timeFilter, setTimeFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOutletId, timeFilter]);

  const filteredHistory = history.filter((item) => {
    // Kalau "Semua", tidak perlu filter waktu
    if (timeFilter === "all") {
      return true;
    }

    const createdAt = new Date(item.createdAt);
    const now = new Date();

    if (timeFilter === "today") {
      return (
        createdAt.getDate() === now.getDate() &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }

    if (timeFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);

      return createdAt >= oneWeekAgo;
    }

    if (timeFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      return createdAt >= oneMonthAgo;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex gap-3 items-center">
        <ClipboardClock size={30} />
        <h1 className="text-2xl font-bold">Daftar Riwayat barang</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />
      <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Riwayat barang" className="min-w-150">
            <Table.Header>
              <Table.Column isRowHeader className="w-[30%]">
                Nama Produk
              </Table.Column>
              <Table.Column className="w-[13%]">Tipe</Table.Column>
              <Table.Column className="w-[12%]">Brand</Table.Column>
              <Table.Column className="w-[12%]">Aktivitas Barang</Table.Column>
              <Table.Column className="w-[8%]">Jumlah</Table.Column>
              <Table.Column className="w-[10%]">Nama Staff</Table.Column>
              <Table.Column className="w-[15%]">Tanggal</Table.Column>
            </Table.Header>

            <Table.Body>
              {paginatedHistory.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.productName}</Table.Cell>
                  <Table.Cell>{item.productType}</Table.Cell>
                  <Table.Cell>{item.productBrand}</Table.Cell>
                  <Table.Cell>{item.activity}</Table.Cell>
                  <Table.Cell>
                    {item.activity === "Keluar"
                      ? `- ${item.quantity}`
                      : `+ ${item.quantity}`}
                  </Table.Cell>
                  <Table.Cell>{item.userName}</Table.Cell>
                  <Table.Cell>
                    {new Date(item.createdAt).toLocaleString("id-ID", {
                      dateStyle: "short",
                      timeStyle: "short",
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
        onPageChange={setCurrentPage}
        totalItems={filteredHistory.length}
      />
    </>
  );
}
