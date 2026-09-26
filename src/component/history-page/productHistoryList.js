"use client";
import { Table } from "@heroui/react";
import { OutletSelection } from "@/component/outletSelection";
import { TimeFilter } from "@/component/timeFilter";
import { ProductPagination } from "@/component/pagination";
import { useState, useEffect } from "react";

export function ProductHistoryList({ outlets, history }) {
  const [selectedOutletId, setSelectedOutletId] = useState(
    outlets[0]?.id ?? null,
  );
  const [timeFilter, setTimeFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    const savedOutletId = localStorage.getItem("selectedOutletId");

    if (savedOutletId) {
      setSelectedOutletId(savedOutletId);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOutletId, timeFilter]);

  const handleOutletChange = (outletId) => {
    setSelectedOutletId(outletId);
    localStorage.setItem("selectedOutletId", outletId);
  };

  const filteredHistory = history.filter((item) => {
    // Filter outlet
    if (item.outletId !== selectedOutletId) {
      return false;
    }

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
      <h1 className="text-2xl font-bold">Daftar Riwayart barang</h1>
      <OutletSelection
        outlets={outlets}
        selectedOutletId={selectedOutletId}
        onOutletChange={handleOutletChange}
      />
      <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Riwayat barang" className="min-w-150">
            <Table.Header>
              <Table.Column isRowHeader>Produk</Table.Column>
              <Table.Column>Tipe</Table.Column>
              <Table.Column>Brand</Table.Column>
              <Table.Column>Aktivitas Barang</Table.Column>
              <Table.Column>Jumlah</Table.Column>
              <Table.Column>Nama</Table.Column>
              <Table.Column>Tanggal</Table.Column>
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
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredHistory.length}
      />
    </>
  );
}
