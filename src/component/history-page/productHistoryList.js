"use client";
import { Table, Label } from "@heroui/react";
import { OutletSelection } from "@/component/outletSelection";
import { TimeFilter } from "@/component/timeFilter";
import { PaginationUi } from "@/component/pagination";
import { RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ProductHistoryList({
  outlets,
  history,
  selectedOutletId,
  timeFilter,
  currentPage,
  totalPages,
  totalItems,
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

  function handleTimeFilterChange(value) {
    updateQuery({
      timeFilter: value === "all" ? null : value,
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
      <TimeFilter
        timeFilter={timeFilter}
        setTimeFilter={handleTimeFilterChange}
      />
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Riwayat barang" className="min-w-150">
            <Table.Header>
              <Table.Column isRowHeader className="w-[25%]">
                Nama Produk
              </Table.Column>
              <Table.Column className="w-[15%]">Kategori</Table.Column>
              <Table.Column className="w-[15%]">Merek</Table.Column>
              <Table.Column className="w-[12%]">Tipe Mutasi</Table.Column>
              <Table.Column className="w-[8%]">Jumlah</Table.Column>
              <Table.Column className="w-[10%]">Staff</Table.Column>
              <Table.Column className="w-[15%]">Waktu</Table.Column>
            </Table.Header>

            <Table.Body>
              {history.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.productName}</Table.Cell>
                  <Table.Cell>{item.productCategory}</Table.Cell>
                  <Table.Cell>{item.productBrand}</Table.Cell>
                  <Table.Cell>
                    <Label
                      className={
                        item.activity === "Keluar"
                          ? "rounded-2xl px-4 py-2 bg-danger/20 text-danger font-bold"
                          : "rounded-2xl px-4 py-2 bg-success/20 text-success font-bold"
                      }
                    >
                      {item.activity}
                    </Label>
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
