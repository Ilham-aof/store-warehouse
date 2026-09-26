"use client";
import { Separator } from "@heroui/react";
import { useState, useEffect } from "react";
import { AddProductButton } from "@/component/addProductButton";
import { OutletSelection } from "@/component/outletSelection";
import { ProductList } from "@/component/productList";
import { SearchBar } from "@/component/searchBar";
import { ProductPagination } from "@/component/pagination";

export function StockBarang({ outlets, products }) {
  const [selectedOutletId, setSelectedOutletId] = useState(
    outlets[0]?.id ?? null,
  );

  const [searchKeyword, setSearchKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const savedOutletId = localStorage.getItem("selectedOutletId");

    if (savedOutletId) {
      setSelectedOutletId(savedOutletId);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOutletId, searchKeyword]);

  const handleOutletChange = (outletId) => {
    setSelectedOutletId(outletId);
    localStorage.setItem("selectedOutletId", outletId);
  };

  const filteredProducts = products.filter((product) => {
    const matchesOutlet = product.outletId === selectedOutletId;

    const keyword = searchKeyword.trim().toLowerCase();

    const matchesSearch =
      keyword.length < 2 || product.name.toLowerCase().includes(keyword);

    return matchesOutlet && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <section className="flex-1 rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-100 space-y-3">
      <h1 className="text-2xl font-bold">Stock Barang</h1>

      <OutletSelection
        outlets={outlets}
        selectedOutletId={selectedOutletId}
        onOutletChange={handleOutletChange}
      />
      <div className="flex gap-3">
        <SearchBar keyword={searchKeyword} onKeywordChange={setSearchKeyword} />
        <Separator orientation="vertical" />
        <AddProductButton />
      </div>

      <ProductList products={paginatedProducts} />

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredProducts.length}
      />
    </section>
  );
}
