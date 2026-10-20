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
import { useRouter, useSearchParams } from "next/navigation";

export function StockBarang({
  outlets,
  products,
  selectedOutletId,
  bestSellers,
  totalItems,
  totalPages,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("search") ?? "",
  );

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  useEffect(() => {
    setSearchKeyword(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateQuery(params) {
    const query = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value == null) {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    });

    router.push(`?${query.toString()}`);
  }

  function handleSearch() {
    updateQuery({
      search: searchKeyword.trim(),
      page: 1,
    });
  }

  function handlePageChange(page) {
    updateQuery({ page });
  }
  return (
    <section className="space-y-5">
      <div className="flex space-x-3 items-center">
        <Boxes size={30} />
        <h1 className="text-2xl font-bold">Inventaris</h1>
      </div>

      <OutletSelection outlets={outlets} selectedOutletId={selectedOutletId} />

      <BestSellerList bestSellers={bestSellers} />

      <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 p-4 w-full space-y-5">
        <div className="flex space-x-3 items-center">
          <Box size={30} />
          <h1 className="text-2xl font-bold">Stok Produk</h1>
        </div>

        <div className="flex space-x-5">
          <SearchBar
            keyword={searchKeyword}
            onKeywordChange={setSearchKeyword}
            onSearch={handleSearch}
            placeholder="Cari nama produk..."
          />
          <Separator orientation="vertical" />
          <AddProductButton selectedOutletId={selectedOutletId} />
        </div>

        <ProductList products={products} />

        <PaginationUi
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
        />
      </div>
    </section>
  );
}
