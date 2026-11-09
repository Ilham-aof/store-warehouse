"use client";

import { Table, Button, Dropdown, Label } from "@heroui/react";
import { useState } from "react";
import { UserRoundX, EllipsisVertical } from "lucide-react";
import { DeleteUserModal } from "@/component/admin-page/deleteUserModal";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationUi } from "@/component/pagination";

export function UserList({ users, currentPage, totalPages, totalItems }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  function handleAction(key, user) {
    setSelectedUser(user);
    setActiveModal(key);
  }

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

  function handlePageChange(page) {
    updateQuery({ page });
  }

  return (
    <div className="space-y-5">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar User">
            <Table.Header>
              <Table.Column isRowHeader className="w-[30%]">
                Nama User
              </Table.Column>
              <Table.Column className="w-[30%]">Nomor HP</Table.Column>
              <Table.Column className="w-[30%]">E-mail</Table.Column>
              <Table.Column className="w-[10%]"></Table.Column>
            </Table.Header>

            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.phone}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
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
                            onAction={(key) => handleAction(key, user)}
                            className="space-y-2"
                          >
                            <Dropdown.Item
                              id="delete"
                              textValue="Delete User"
                              variant="danger"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                            >
                              <UserRoundX className="text-danger" />
                              <Label>Hapus Staff</Label>
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
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />

      <DeleteUserModal
        isOpen={activeModal === "delete"}
        selectedUser={selectedUser}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
