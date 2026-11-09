"use client";

import { ListBox, Select, Header } from "@heroui/react";
import { PackageSearch } from "lucide-react";

export function StockFilterSelection({ stockFilter, setStockFilter }) {
  return (
    <div className="flex items-center space-x-5">
      <div className="flex space-x-3 items-center">
        <PackageSearch />
        <p>Stok</p>
      </div>

      <Select
        variant="secondary"
        className="w-40"
        aria-label="Filter Stock"
        value={stockFilter}
        onChange={setStockFilter}
      >
        <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Filter Stok</Header>
            <ListBox.Item
              id="all"
              textValue="Semua"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Semua
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="lowStock"
              textValue="Stok Menipis"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Stok Menipis
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="outOfStock"
              textValue="Stok Habis"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Stok Habis
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
