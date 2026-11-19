"use client";

import { ListBox, Select, Header } from "@heroui/react";
import { CustomFilter } from "@/component/customTimeFilter";
import { Clock } from "lucide-react";

export function TimeFilter({
  timeFilter,
  setTimeFilter,
  dateRange,
  setDateRange,
  options,
}) {
  return (
    <div className="flex items-center space-x-5">
      <div className="flex space-x-3 items-center">
        <Clock />
        <p>Waktu</p>
      </div>

      <Select
        variant="secondary"
        className="w-48"
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

            {options.map((option) => (
              <ListBox.Item
                key={option.id}
                id={option.id}
                textValue={option.label}
                className="ring-0 outline-none shadow-none ring-offset-0"
              >
                {option.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {timeFilter === "custom" && (
        <CustomFilter dateRange={dateRange} setDateRange={setDateRange} />
      )}
    </div>
  );
}
