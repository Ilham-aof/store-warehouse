"use client";

import { ListBox, Select } from "@heroui/react";
import { useState } from "react";

export function OutletSelection({ outlets, selectedOutletId, onOutletChange }) {
  return (
    <div className="flex items-center space-x-3">
      <h2>Cabang :</h2>

      <Select
        variant="secondary"
        aria-label="Pilih Outlet"
        className="w-[256px]"
        selectedKey={selectedOutletId}
        onSelectionChange={onOutletChange}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover>
          <ListBox>
            {outlets.map((outlet) => (
              <ListBox.Item
                key={outlet.id}
                id={outlet.id}
                textValue={outlet.name}
              >
                {outlet.name}

                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <input type="" name="outletId" value={selectedOutletId ?? ""} readOnly />
    </div>
  );
}
