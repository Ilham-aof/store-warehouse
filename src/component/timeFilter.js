"use client";

import { ListBox, Select, Header } from "@heroui/react";

export function TimeFilter({ timeFilter, setTimeFilter }) {
  return (
    <div className="flex items-center space-x-3">
      <p>Waktu</p>
      <Select
        variant="secondary"
        className="w-32"
        aria-label="Filter waktu"
        selectedKey={timeFilter}
        onSelectionChange={setTimeFilter}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Filter Waktu</Header>
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
