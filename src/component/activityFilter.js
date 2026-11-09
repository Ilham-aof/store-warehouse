"use client";

import { ListBox, Select, Header } from "@heroui/react";
import { SlidersHorizontal } from "lucide-react";

export function ActivityFilter({ activityFilter, setActivityFilter }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex space-x-3 items-center">
        <SlidersHorizontal />
        <p>Aktivitas</p>
      </div>

      <Select
        variant="secondary"
        className="w-42"
        aria-label="Filter waktu"
        value={activityFilter}
        onChange={setActivityFilter}
      >
        <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Filter aktivitas produk</Header>
            <ListBox.Item
              id="all"
              textValue="Semua"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Semua
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="masuk"
              textValue="Masuk"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Produk Masuk
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="keluar"
              textValue="Keluar"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Produk Keluar
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
