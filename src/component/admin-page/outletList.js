"use client";

import { Table, Button, Dropdown, Label, Separator } from "@heroui/react";
import { useState } from "react";
import { Trash, Pencil, EllipsisVertical } from "lucide-react";
import { DeleteOutletModal } from "@/component/admin-page/deleteOutletModal";
import { UpdateOutletModal } from "@/component/admin-page/updateOutletModal";
import { PaginationUi } from "@/component/pagination";

export function OutletList({ outlets }) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;
  const totalItems = outlets.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedOutlets = outlets.slice(startIndex, startIndex + pageSize);

  function handleAction(key, outlet) {
    setSelectedOutlet(outlet);
    setActiveModal(key);
  }

  return (
    <div className="space-y-5">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar outlet">
            <Table.Header>
              <Table.Column isRowHeader className="w-[20%]">
                Nama Cabang
              </Table.Column>
              <Table.Column className="w-[15%]"> Kode Cabang</Table.Column>
              <Table.Column className="w-[40%]"> Alamat Cabang</Table.Column>
              <Table.Column className="w-[15%]">
                Nomor Telepon Cabang
              </Table.Column>
              <Table.Column className="w-[10%]"></Table.Column>
            </Table.Header>

            <Table.Body>
              {paginatedOutlets.map((outlet) => (
                <Table.Row key={outlet.id}>
                  <Table.Cell>{outlet.name}</Table.Cell>
                  <Table.Cell>{outlet.code}</Table.Cell>
                  <Table.Cell>{outlet.address}</Table.Cell>
                  <Table.Cell>{outlet.phone}</Table.Cell>
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
                          <Dropdown.Menu
                            onAction={(key) => handleAction(key, outlet)}
                            className="space-y-3"
                          >
                            <Dropdown.Item
                              id="edit"
                              textValue="Edit Outlet"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                            >
                              <Pencil />
                              <Label>Ubah Outlet</Label>
                            </Dropdown.Item>
                            <Separator />

                            <Dropdown.Item
                              id="delete"
                              textValue="Delete Product"
                              variant="danger"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                            >
                              <Trash className="text-danger" />
                              <Label>Hapus Outlet</Label>
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
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />

      <UpdateOutletModal
        key={`edit-${selectedOutlet?.id}`}
        isOpen={activeModal === "edit"}
        selectedOutlet={selectedOutlet}
        onClose={() => setActiveModal(null)}
      />

      <DeleteOutletModal
        isOpen={activeModal === "delete"}
        selectedOutlet={selectedOutlet}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
