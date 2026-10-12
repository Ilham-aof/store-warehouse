"use client";

import { ListBox, Select } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

export function OutletSelection({ outlets, selectedOutletId }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleOutletChange = (outletId) => {
    router.replace(`${pathname}?outletId=${outletId}`);
  };

  return (
    <div className="flex items-center space-x-3">
      <p>Cabang</p>
      <Select
        variant="secondary"
        aria-label="Pilih Outlet"
        className="w-56"
        selectedKey={selectedOutletId}
        onSelectionChange={handleOutletChange}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover className="p-1">
          <ListBox className="space-y-3">
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
    </div>
  );
}
