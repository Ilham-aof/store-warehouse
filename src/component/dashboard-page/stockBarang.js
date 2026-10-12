"use client";
import { Separator } from "@heroui/react";
import { useState, useEffect } from "react";
import { AddProductButton } from "@/component/dashboard-page/addProductButton";
import { OutletSelection } from "@/component/outletSelection";
import { ProductList } from "@/component/dashboard-page/productList";
import { SearchBar } from "@/component/searchBar";
import { PaginationUi } from "@/component/pagination";
import { BestSellerList } from "@/component/dashboard-page/bestSellerList";
import { Box, Boxes } from "lucide-react";

export function StockBarang({
  outlets,
  products,
  selectedOutletId,
  bestSellers,
}) {
  const [searchKeyword, setSearchKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOutletId, searchKeyword]);

  const filteredProducts = products.filter((product) => {
    const keyword = searchKeyword.trim().toLowerCase();

    return keyword.length < 2 || product.name.toLowerCase().includes(keyword);
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <section className="space-y-5">
      <div className="flex space-x-3 items-center">
        <Boxes size={30} />
        <h1 className="text-2xl font-bold">Manajemen Stok</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />

      <BestSellerList bestSellers={bestSellers} />

      <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 w-full space-y-5">
        <div className="flex space-x-3 items-center">
          <Box size={30} />
          <h1 className="text-2xl font-bold">Stock Barang</h1>
        </div>

        <div className="flex space-x-5">
          <SearchBar
            keyword={searchKeyword}
            onKeywordChange={setSearchKeyword}
            placeholder="Cari nama produk..."
          />
          <Separator orientation="vertical" />
          <AddProductButton selectedOutletId={selectedOutletId} />
        </div>

        <ProductList products={paginatedProducts} />

        <PaginationUi
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredProducts.length}
        />
      </div>
    </section>
  );
}
