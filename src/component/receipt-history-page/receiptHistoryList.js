"use client";
import {
  Table,
  Switch,
  Dropdown,
  Label,
  Separator,
  Button,
} from "@heroui/react";
import { EllipsisVertical, Files, Printer } from "lucide-react";
import { useState, useEffect } from "react";

import { PaginationUi } from "@/component/pagination";
import { updateServiceReceiptStatus } from "@/app/action/serviceReceipt/updateServiceReceiptStatus";
import { useRouter } from "next/navigation";
import { OutletSelection } from "@/component/outletSelection";
import { SearchBar } from "@/component/searchBar";
import { TimeFilter } from "@/component/timeFilter";
import { WarrantyFilter } from "@/component/warrantyFilter";

export function ReceiptHistoryList({ outlets, receipts, selectedOutletId }) {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState("all");
  const [warrantyFilter, setWarrantyFilter] = useState("all");

  async function handleStatusChange(receiptId, status, value) {
    const result = await updateServiceReceiptStatus(receiptId, status, value);

    if (!result.success) {
      console.error(result.error);
      return;
    }

    router.refresh();
  }

  const [searchKeyword, setSearchKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const today = new Date();
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOutletId, searchKeyword, timeFilter, warrantyFilter]);

  const filteredReceipts = receipts.filter((receipt) => {
    const keyword = searchKeyword.trim().toLowerCase();

    const matchesSearch =
      keyword.length < 2 ||
      receipt.customerName.toLowerCase().includes(keyword);

    const createdAt = new Date(receipt.createdAt);
    const now = new Date();

    let matchesTime = true;

    if (timeFilter === "today") {
      matchesTime = createdAt.toDateString() === now.toDateString();
    } else if (timeFilter === "week") {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      matchesTime = createdAt >= oneWeekAgo && createdAt <= now;
    } else if (timeFilter === "month") {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      matchesTime = createdAt >= oneMonthAgo && createdAt <= now;
    }

    const warrantyUntil = receipt.warrantyUntil
      ? new Date(receipt.warrantyUntil)
      : null;

    let matchesWarranty = true;

    if (warrantyFilter === "active") {
      matchesWarranty =
        receipt.warrantyDays > 0 &&
        warrantyUntil !== null &&
        warrantyUntil >= now;
    } else if (warrantyFilter === "expired") {
      matchesWarranty =
        receipt.warrantyDays > 0 &&
        warrantyUntil !== null &&
        warrantyUntil < now;
    } else if (warrantyFilter === "noWarranty") {
      matchesWarranty = receipt.warrantyDays === 0;
    }

    return matchesSearch && matchesTime && matchesWarranty;
  });

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedReceipts = filteredReceipts.slice(startIndex, endIndex);

  return (
    <section className="space-y-5">
      <div className="flex gap-3 items-center">
        <Files size={30} />
        <h1 className="text-2xl font-bold">Daftar Riwayat Nota</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />
      <div className="flex space-x-5">
        <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        <WarrantyFilter
          warrantyFilter={warrantyFilter}
          setWarrantyFilter={setWarrantyFilter}
        />
        <Separator orientation="vertical" />
        <SearchBar
          keyword={searchKeyword}
          onKeywordChange={setSearchKeyword}
          placeholder="Cari nama customer..."
        />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar nota servis" className="min-w-250">
            <Table.Header>
              <Table.Column isRowHeader className="w-[18%]">
                Kode Nota
              </Table.Column>
              <Table.Column className="w-[17%]">Customer</Table.Column>
              <Table.Column className="w-[10%]">Tanggal Nota</Table.Column>
              <Table.Column className="w-[8%]">Garansi</Table.Column>
              <Table.Column className="w-[10%]">Status Garansi</Table.Column>
              <Table.Column className="w-[13%]">Status Pengerjaan</Table.Column>
              <Table.Column className="w-[16%]">Status Barang</Table.Column>
              <Table.Column className="w-[8%]"></Table.Column>
            </Table.Header>

            <Table.Body>
              {paginatedReceipts.map((receipt) => (
                <Table.Row key={receipt.id}>
                  <Table.Cell className="whitespace-nowrap">
                    {receipt.invoiceNumber}
                  </Table.Cell>

                  <Table.Cell>
                    <p className="text-md font-bold">{receipt.customerName}</p>
                    <p className="text-sm text-muted">
                      Nomor : {receipt.customerPhone}
                    </p>
                    <p className="text-sm text-muted">
                      Device : {receipt.device}
                    </p>
                  </Table.Cell>

                  <Table.Cell>
                    {receipt.createdAt.toLocaleDateString("id-ID")}
                  </Table.Cell>

                  <Table.Cell>
                    {receipt.warrantyDays === 0
                      ? "Tidak Bergaransi"
                      : `${receipt.warrantyDays} hari`}
                  </Table.Cell>

                  <Table.Cell>
                    {receipt.warrantyDays === 0 ? (
                      "Tidak Bergaransi"
                    ) : !receipt.warrantyUntil ? (
                      "-"
                    ) : (
                      <p
                        className={
                          today <= new Date(receipt.warrantyUntil)
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {today <= new Date(receipt.warrantyUntil)
                          ? `Aktif hingga : ${new Date(receipt.warrantyUntil).toLocaleDateString("id-ID")}`
                          : `Expired : ${new Date(receipt.warrantyUntil).toLocaleDateString("id-ID")}`}
                      </p>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Switch
                      isSelected={receipt.processStatus}
                      onChange={(value) =>
                        handleStatusChange(receipt.id, "processStatus", value)
                      }
                    >
                      <Switch.Content
                        className={
                          receipt.processStatus ? "text-success" : "text-danger"
                        }
                      >
                        <Switch.Control
                          className={
                            receipt.processStatus ? "bg-success" : "bg-danger"
                          }
                        >
                          <Switch.Thumb />
                        </Switch.Control>
                        {receipt.processStatus ? "Selesai" : "Diproses"}
                      </Switch.Content>
                    </Switch>
                  </Table.Cell>

                  <Table.Cell className="whitespace-nowrap">
                    <Switch
                      isSelected={receipt.pickupStatus}
                      onChange={(value) =>
                        handleStatusChange(receipt.id, "pickupStatus", value)
                      }
                    >
                      <Switch.Content
                        className={
                          receipt.pickupStatus ? "text-success" : "text-danger"
                        }
                      >
                        <Switch.Control
                          className={
                            receipt.pickupStatus ? "bg-success" : "bg-danger"
                          }
                        >
                          <Switch.Thumb />
                        </Switch.Control>
                        {receipt.pickupStatus
                          ? "Sudah Diambil"
                          : "Belum Diambil"}
                      </Switch.Content>
                    </Switch>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex justify-center">
                      <Dropdown>
                        <Button
                          aria-label="Menu"
                          variant="secondary"
                          isIconOnly
                        >
                          <EllipsisVertical />
                        </Button>
                        <Dropdown.Popover className="p-1">
                          <Dropdown.Menu className="space-y-3">
                            <Dropdown.Item
                              id="cetak"
                              textValue="Cetak Nota"
                              className="flex items-center"
                              onAction={() =>
                                router.push(`/receipt/${receipt.id}`)
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
      <PaginationUi
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredReceipts.length}
      />
    </section>
  );
}
