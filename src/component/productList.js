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
import { UpdateProductModal } from "@/component/updateProductModal";
import { DeleteProductModal } from "@/component/deleteProductModal";

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
    <main>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Daftar produk"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting isRowHeader id="name">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Nama
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="type" className="w-40">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Tipe
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="brand" className="w-35">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Brand
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="quantity" className="w-25">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Stok
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="price" className="w-35">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Harga
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column allowsSorting id="productIn" className="w-35">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Tanggal Masuk
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>

              <Table.Column className="w-10"></Table.Column>
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
                    {new Date(product.stockIns[0].createdAt).toLocaleDateString(
                      "id-ID",
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown>
                      <Button aria-label="Menu" variant="secondary" isIconOnly>
                        <EllipsisVertical />
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu
                          onAction={(key) => handleAction(key, product)}
                          className="gap-5 p-3"
                        >
                          <Dropdown.Item
                            id="stock-in"
                            textValue="Open file"
                            className="flex items-center"
                          >
                            <PackagePlus />
                            <Label>Produk Masuk</Label>
                          </Dropdown.Item>
                          <Dropdown.Item
                            id="stock-out"
                            textValue="Open file"
                            className="flex items-center"
                          >
                            <PackageMinus />
                            <Label>Produk Keluar</Label>
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
    </main>
  );
}
