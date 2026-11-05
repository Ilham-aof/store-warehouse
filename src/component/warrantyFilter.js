"use client";

import { ListBox, Select, Header } from "@heroui/react";

export function WarrantyFilter({ warrantyFilter, setWarrantyFilter }) {
  return (
    <div className="flex items-center space-x-5">
      <p>Garansi</p>
      <Select
        variant="secondary"
        className="w-40"
        aria-label="Filter garansi"
        value={warrantyFilter}
        onChange={setWarrantyFilter}
      >
        <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Filter Garansi</Header>
            <ListBox.Item
              id="all"
              textValue="Semua"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Semua
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="active"
              textValue="Active"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Active
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="noWarranty"
              textValue="NoWarranty"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Tidak Bergaransi
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="expired"
              textValue="Expired"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Expired
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
