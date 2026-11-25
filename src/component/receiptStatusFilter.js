"use client";

import { ListBox, Select, Header } from "@heroui/react";
import { Tag } from "lucide-react";

export function ReceiptStatusFilter({
  receiptStatusFilter,
  setReceiptStatusFilter,
}) {
  return (
    <div className="flex items-center space-x-5">
      <div className="flex space-x-3 items-center">
        <Tag />
        <p>Status Nota</p>
      </div>

      <Select
        variant="secondary"
        className="w-36"
        aria-label="Filter status nota"
        value={receiptStatusFilter}
        onChange={setReceiptStatusFilter}
      >
        <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Filter Status Nota</Header>
            <ListBox.Item
              id="all"
              textValue="Semua"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Semua
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="sukses"
              textValue="Sukses"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Sukses
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="cancel"
              textValue="Cancel"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Cancel
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
