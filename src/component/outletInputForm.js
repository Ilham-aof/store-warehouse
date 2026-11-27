"use client";

import { ListBox, Select, Header, Label } from "@heroui/react";

export function OutletInputForm({ outlets, label, placeholder }) {
  return (
    <div className="flex items-center space-x-3">
      <Select
        name="targetOutlet"
        variant="secondary"
        aria-label="Pilih Outlet"
        className="w-full"
        placeholder={placeholder}
      >
        <Label>{label}</Label>
        <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Daftar Cabang</Header>
            {outlets.map((outlet) => (
              <ListBox.Item
                key={outlet.id}
                id={outlet.id}
                textValue={outlet.name}
                className="ring-0 outline-none shadow-none ring-offset-0"
              >
                {outlet.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
