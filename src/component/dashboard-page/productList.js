"use client";

import { Table, Button, Dropdown, Label, Separator } from "@heroui/react";
import { useState } from "react";
import {
  Pencil,
  Trash,
  PackageMinus,
  PackagePlus,
  EllipsisVertical,
} from "lucide-react";
import { UpdateProductModal } from "@/component/dashboard-page/updateProductModal";
import { DeleteProductModal } from "@/component/dashboard-page/deleteProductModal";
import { AddProductStockModal } from "@/component/dashboard-page/addProductStockModal";
import { TakeProductStockModal } from "@/component/dashboard-page/takeProductStockModal";

export function ProductList({ products }) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleAction(key, product) {
    setSelectedProduct(product);
    setActiveModal(key);
  }

  return (
    <section>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Daftar produk">
            <Table.Header>
              <Table.Column isRowHeader id="name" className="w-[30%]">
                Nama Produk
              </Table.Column>

              <Table.Column className="w-[13%]">Kategori</Table.Column>

              <Table.Column className="w-[12%]">Merek</Table.Column>

              <Table.Column className="w-[8%]">Stok</Table.Column>

              <Table.Column className="w-[14%]">Harga</Table.Column>

              <Table.Column className="w-[15%]">Tanggal Masuk</Table.Column>

              <Table.Column className="w-[8%]"></Table.Column>
            </Table.Header>

            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>{product.brand}</Table.Cell>
                  <Table.Cell>{product.quantity}</Table.Cell>
                  <Table.Cell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(product.stockIns[0].createdAt).toLocaleString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
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
                          <Dropdown.Menu
                            onAction={(key) => handleAction(key, product)}
                            className="space-y-3"
                          >
                            <Dropdown.Item
                              id="add-stock"
                              textValue="Add Stock"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                            >
                              <PackagePlus />
                              <Label>Tambah Stok Manual</Label>
                            </Dropdown.Item>
                            <Dropdown.Item
                              id="take-stock"
                              textValue="Take Stock"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                            >
                              <PackageMinus />
                              <Label>Ambil Stok Manual</Label>
                            </Dropdown.Item>
                            <Dropdown.Item
                              id="edit"
                              textValue="Edit Product"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                            >
                              <Pencil />
                              <Label>Ubah Produk</Label>
                            </Dropdown.Item>
                            <Separator />
                            <Dropdown.Item
                              id="delete"
                              textValue="Delete Product"
                              variant="danger"
                              className="flex items-center ring-0 outline-none shadow-none ring-offset-0"
                            >
                              <Trash className="text-danger" />
                              <Label>Hapus Produk</Label>
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
      <UpdateProductModal
        key={`edit-${selectedProduct?.id}`}
        isOpen={activeModal === "edit"}
        selectedProduct={selectedProduct}
        onClose={() => setActiveModal(null)}
      />
      <DeleteProductModal
        isOpen={activeModal === "delete"}
        selectedProduct={selectedProduct}
        onClose={() => setActiveModal(null)}
      />
      <AddProductStockModal
        key={`stockIn-${selectedProduct?.id}`}
        isOpen={activeModal === "add-stock"}
        selectedProduct={selectedProduct}
        onClose={() => setActiveModal(null)}
      />
      <TakeProductStockModal
        key={`stockOut-${selectedProduct?.id}`}
        isOpen={activeModal === "take-stock"}
        selectedProduct={selectedProduct}
        onClose={() => setActiveModal(null)}
      />
    </section>
  );
}
