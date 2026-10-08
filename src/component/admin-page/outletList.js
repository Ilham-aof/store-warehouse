"use client";

import { Table, Button, Dropdown, Label, Separator } from "@heroui/react";
import { useState } from "react";
import { Trash, Pencil, EllipsisVertical } from "lucide-react";
import { DeleteOutletModal } from "@/component/admin-page/deleteOutletModal";
import { UpdateOutletModal } from "@/component/admin-page/updateOutletModal";

export function OutletList({ outlets }) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  function handleAction(key, outlet) {
    setSelectedOutlet(outlet);
    setActiveModal(key);
  }

  return (
    <div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar outlet">
            <Table.Header>
              <Table.Column isRowHeader>Nama Outlet</Table.Column>
              <Table.Column> Kode Outlet</Table.Column>
              <Table.Column className="w-10"></Table.Column>
            </Table.Header>

            <Table.Body>
              {outlets.map((outlet) => (
                <Table.Row key={outlet.id}>
                  <Table.Cell>{outlet.name}</Table.Cell>
                  <Table.Cell>{outlet.code}</Table.Cell>
                  <Table.Cell className="flex justify-center">
                    <Dropdown>
                      <Button aria-label="Menu" variant="secondary" isIconOnly>
                        <EllipsisVertical />
                      </Button>
                      <Dropdown.Popover className="p-1">
                        <Dropdown.Menu
                          onAction={(key) => handleAction(key, outlet)}
                          className="space-y-3"
                        >
                          <Dropdown.Item
                            id="edit"
                            textValue="Edit Outlet"
                            className="flex items-center"
                          >
                            <Pencil />
                            <Label>Ubah Outlet</Label>
                          </Dropdown.Item>
                          <Separator />

                          <Dropdown.Item
                            id="delete"
                            textValue="Delete Product"
                            variant="danger"
                            className="flex items-center"
                          >
                            <Trash className="text-danger" />
                            <Label>Hapus Outlet</Label>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

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
