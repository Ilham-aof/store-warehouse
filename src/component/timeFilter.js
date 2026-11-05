"use client";

import { ListBox, Select, Header } from "@heroui/react";
import { CustomFilter } from "@/component/customTimeFilter";

export function TimeFilter({
  timeFilter,
  setTimeFilter,
  dateRange,
  setDateRange,
}) {
  return (
    <div className="flex items-center space-x-5">
      <p>Waktu</p>
      <Select
        variant="secondary"
        className="w-32"
        aria-label="Filter waktu"
        value={timeFilter}
        onChange={setTimeFilter}
      >
        <Select.Trigger className="ring-0 outline-none shadow-none ring-offset-0">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
            <Header>Filter Waktu</Header>
            <ListBox.Item
              id="all"
              textValue="Semua"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Semua
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="today"
              textValue="Hari ini"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Hari Ini
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="week"
              textValue="Minggu ini"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Minggu Ini
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="month"
              textValue="Bulan ini"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Bulan Ini
              <ListBox.ItemIndicator />
            </ListBox.Item>

            <ListBox.Item
              id="custom"
              textValue="Kustom"
              className="ring-0 outline-none shadow-none ring-offset-0"
            >
              Kustom
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
      {timeFilter === "custom" ? (
        <CustomFilter dateRange={dateRange} setDateRange={setDateRange} />
      ) : (
        ""
      )}
    </div>
  );
}
