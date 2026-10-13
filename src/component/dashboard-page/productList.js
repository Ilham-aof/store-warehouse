"use client";

import { Table, Button, Dropdown, Label, Separator } from "@heroui/react";
import { useMemo, useState } from "react";
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
  const [sortDescriptor, setSortDescriptor] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const sortedProducts = useMemo(() => {
    if (!sortDescriptor) {
      return products;
    }

    return [...products].sort((a, b) => {
      const col = sortDescriptor.column;

      const first = a[col];
      const second = b[col];

      let cmp;

      if (typeof first === "number" && typeof second === "number") {
        cmp = first - second;
      } else {
        cmp = String(first).localeCompare(String(second));
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [products, sortDescriptor]);

  function handleAction(key, product) {
    setSelectedProduct(product);
    setActiveModal(key);
  }

  return (
    <section>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Daftar produk"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column
                allowsSorting
                isRowHeader
                id="name"
                className="w-[35%]"
              >
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Nama Produk
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="type" className="w-[10%]">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Tipe
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="brand" className="w-[10%]">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Brand
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="quantity" className="w-[8%]">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Stok
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="price" className="w-[14%]">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Harga
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="stockIn" className="w-[15%]">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Tanggal Masuk
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column className="w-[8%]"></Table.Column>
            </Table.Header>

            <Table.Body>
              {sortedProducts.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.type}</Table.Cell>
                  <Table.Cell>{product.brand}</Table.Cell>
                  <Table.Cell>{product.quantity}</Table.Cell>
                  <Table.Cell>
                    Rp {product.price.toLocaleString("id-ID")}
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
                          <Dropdown.Menu
                            onAction={(key) => handleAction(key, product)}
                            className="space-y-3"
                          >
                            <Dropdown.Item
                              id="add-stock"
                              textValue="Add Stock"
                              className="flex items-center"
                            >
                              <PackagePlus />
                              <Label>Tambahkan Stok</Label>
                            </Dropdown.Item>
                            <Dropdown.Item
                              id="take-stock"
                              textValue="Take Stock"
                              className="flex items-center"
                            >
                              <PackageMinus />
                              <Label>Kurangi Stok</Label>
                            </Dropdown.Item>
                            <Dropdown.Item
                              id="edit"
                              textValue="Edit Product"
                              className="flex items-center"
                            >
                              <Pencil />
                              <Label>Ubah Produk</Label>
                            </Dropdown.Item>
                            <Separator />
                            <Dropdown.Item
                              id="delete"
                              textValue="Delete Product"
                              variant="danger"
                              className="flex items-center"
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
