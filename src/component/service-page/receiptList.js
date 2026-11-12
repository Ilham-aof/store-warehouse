"use client";
import {
  Table,
  Switch,
  Dropdown,
  Label,
  Separator,
  Button,
  toast,
} from "@heroui/react";
import {
  Pencil,
  EllipsisVertical,
  ReceiptText,
  Printer,
  Check,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

import { PaginationUi } from "@/component/pagination";
import { updateProcessStatus } from "@/app/action/serviceReceipt/updateProcessStatus";
import { updateServiceReceiptStatus } from "@/app/action/serviceReceipt/updateServiceReceiptStatus";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateReceiptButton } from "@/component/service-page/createReceiptButton";
import { OutletSelection } from "@/component/outletSelection";
import { SearchBar } from "@/component/searchBar";
import { UpdateReceiptModal } from "@/component/service-page/updateReceiptModal";
import { ServiceDetailModal } from "@/component/service-page/ServiceDetailModal";

export function ReceiptList({
  outlets,
  receipts,
  selectedOutletId,
  totalItems,
  totalPages,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("search") ?? "",
  );

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  useEffect(() => {
    setSearchKeyword(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateQuery(params) {
    const query = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value == null) {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    });

    router.push(`?${query.toString()}`);
  }

  function handleSearch() {
    updateQuery({
      search: searchKeyword.trim(),
      page: 1,
    });
  }

  const handleReceiptStatusChange = async (receiptId, newStatus) => {
    try {
      const result = await updateServiceReceiptStatus(receiptId, newStatus);

      if (!result.success) {
        toast(result.error || "Gagal memperbarui status nota", {
          variant: "danger",
        });

        return;
      }

      toast(
        newStatus === "Sukses"
          ? "Nota servis berhasil diselesaikan"
          : "Nota servis telah dibatalkan",
        {
          variant: "success",
        },
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      toast("Terjadi kesalahan saat memperbarui status nota", {
        variant: "danger",
      });
    }
  };

  function handlePageChange(page) {
    updateQuery({ page });
  }

  async function handleProcessStatusChange(receiptId, processStatus, value) {
    const result = await updateProcessStatus(receiptId, processStatus, value);

    if (result?.success) {
      router.refresh();
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex space-x-3 items-center">
        <ReceiptText size={30} />
        <h1 className="text-2xl font-bold">Daftar Servis</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />
      <div className="flex space-x-5">
        <SearchBar
          keyword={searchKeyword}
          onKeywordChange={setSearchKeyword}
          onSearch={handleSearch}
          placeholder="Cari nama pelanggan..."
        />
        <Separator orientation="vertical" />
        <CreateReceiptButton selectedOutletId={selectedOutletId} />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar nota servis" className="min-w-250">
            <Table.Header>
              <Table.Column isRowHeader className="w-[15%]">
                Kode Nota
              </Table.Column>
              <Table.Column className="w-[20%]">Pelanggan</Table.Column>
              <Table.Column className="w-[15%]">Detail Servis</Table.Column>
              <Table.Column className="w-[15%]">Status Pengerjaan</Table.Column>
              <Table.Column className="w-[15%]">Status Barang</Table.Column>
              <Table.Column className="w-[10%]">Tanggal Nota</Table.Column>
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
                      No. HP/WA : {receipt.customerPhone}
                    </p>
                    <p className="text-sm text-muted">
                      Tipe HP : {receipt.device}
                    </p>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReceipt(receipt);
                          setActiveModal("serviceDetail");
                        }}
                        className="text-blue-600 hover:underline text-left"
                      >
                        Lihat {receipt.serviceItems.length} perbaikan
                      </button>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <Switch
                      isSelected={receipt.processStatus}
                      onChange={(value) =>
                        handleProcessStatusChange(
                          receipt.id,
                          "processStatus",
                          value,
                        )
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
                        updateProcessStatus(receipt.id, "pickupStatus", value)
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
                    {receipt.createdAt.toLocaleDateString("id-ID")}
                  </Table.Cell>

                  <Table.Cell className="ring-0 outline-none shadow-none ring-offset-0">
                    <div className="flex items-center justify-center">
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
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                              onAction={() =>
                                handleReceiptStatusChange(receipt.id, "Sukses")
                              }
                            >
                              <Check />
                              <Label>Selesai</Label>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                              onAction={() =>
                                handleReceiptStatusChange(receipt.id, "Cancel")
                              }
                            >
                              <X />
                              <Label>Batal Servis</Label>
                            </Dropdown.Item>

                            <Separator />

                            <Dropdown.Item
                              id="cetak"
                              textValue="Cetak Nota"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                              onAction={() => {
                                router.push(`/serviceReceipt/${receipt.id}`);
                              }}
                            >
                              <Printer />
                              <Label>Cetak Nota</Label>
                            </Dropdown.Item>

                            <Dropdown.Item
                              id="edit"
                              textValue="Edit Nota"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                              onAction={() => {
                                setSelectedReceipt(receipt);
                                setActiveModal("edit");
                              }}
                            >
                              <Pencil />
                              <Label>Ubah Nota</Label>
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
        isOpen={activeModal === "serviceDetail"}
        receipt={selectedReceipt}
        onClose={() => {
          setActiveModal(null);
          setSelectedReceipt(null);
        }}
      />

      <PaginationUi
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />

      <UpdateReceiptModal
        key={`edit-${selectedReceipt?.id}`}
        isOpen={activeModal === "edit"}
        selectedReceipt={selectedReceipt}
        onClose={() => setActiveModal(null)}
      />
    </section>
  );
}
