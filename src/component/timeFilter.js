"use client";

import { ListBox, Select } from "@heroui/react";

export function TimeFilter({ timeFilter, setTimeFilter }) {
  return (
    <div className="flex items-center space-x-3">
      <h2>Waktu :</h2>

      <Select
        variant="secondary"
        className="w-[256px]"
        aria-label="Filter waktu"
        selectedKey={timeFilter}
        onSelectionChange={setTimeFilter}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="all" textValue="Semua">
              Semua
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item id="today" textValue="Hari ini">
              Hari Ini
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item id="week" textValue="Minggu ini">
              Minggu Ini
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item id="month" textValue="Bulan ini">
              Bulan Ini
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
