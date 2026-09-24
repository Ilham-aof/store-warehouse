"use client";

import { useState, useEffect } from "react";
import { AddProductButton } from "@/component/addProductButton";
import { OutletSelection } from "@/component/outletSelection";
import { ProductList } from "@/component/productList";

export function StockBarang({ outlets, products }) {
  const [selectedOutletId, setSelectedOutletId] = useState(
    outlets[0]?.id ?? null,
  );
  useEffect(() => {
    const savedOutletId = localStorage.getItem("selectedOutletId");

    if (savedOutletId) {
      setSelectedOutletId(savedOutletId);
    }
  }, []);

  const handleOutletChange = (outletId) => {
    setSelectedOutletId(outletId);
    localStorage.setItem("selectedOutletId", outletId);
  };

  const filteredProducts = products.filter(
    (product) => product.outletId === selectedOutletId,
  );

  return (
    <section className="flex-1 space-y-3 rounded-2xl border-2 border-amber-500 p-4">
      <h1 className="text-2xl font-bold">Stock Barang</h1>

      <OutletSelection
        outlets={outlets}
        selectedOutletId={selectedOutletId}
        onOutletChange={handleOutletChange}
      />

      <AddProductButton />

      <ProductList products={filteredProducts} />
    </section>
  );
}
