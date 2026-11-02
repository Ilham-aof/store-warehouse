"use client";

import { Label, ListBox, Select } from "@heroui/react";

export function StockOutSelection({ stockOutSelection, setStockOutSelection }) {
  return (
    <Select
      name="mutationOutType"
      variant="secondary"
      aria-label="Jenis Mutasi Stok"
      placeholder="Pilih jenis mutasi"
      value={stockOutSelection}
      onChange={setStockOutSelection}
      className="w-full"
    >
      <Label>Jenis Mutasi Stok</Label>
      <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="p-1">
        <ListBox className="space-y-3">
          <ListBox.Item
            id="SERVIS"
            textValue="Servis"
            className="ring-0 outline-none shadow-none ring-offset-0"
          >
            Servis
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item
            id="TRANSFER"
            textValue="Transfer"
            className="ring-0 outline-none shadow-none ring-offset-0"
          >
            Transfer
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
