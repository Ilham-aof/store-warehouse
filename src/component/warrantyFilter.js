"use client";

import { ListBox, Select, Header } from "@heroui/react";

export function WarrantyFilter({ warrantyFilter, setWarrantyFilter }) {
  return (
    <div className="flex items-center space-x-3">
      <p>Garansi</p>
      <Select
        variant="secondary"
        className="w-40"
        aria-label="Filter garansi"
        selectedKey={warrantyFilter}
        onSelectionChange={setWarrantyFilter}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Filter Garansi</Header>
            <ListBox.Item id="all" textValue="Semua">
              Semua
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item id="active" textValue="Active">
              Active
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item id="noWarranty" textValue="NoWarranty">
              Tidak Bergaransi
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item id="expired" textValue="Expired">
              Expired
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
