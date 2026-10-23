"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  PackagePlus,
  ScanBarcode,
  LoaderCircle,
  PackageSearch,
} from "lucide-react";
import { SearchBar } from "@/component/searchBar";
import { OutletSelection } from "@/component/outletSelection";
import { searchProduct } from "@/app/action/product/searchProduct";
import { ProductSearchResult } from "@/component/add-product-stock-page/productSearchResult";

export function AddProductStockForm({ outlets, selectedOutletId }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedBarcode, setSearchedBarcode] = useState("");

  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  function focusSearchBar() {
    searchInputRef.current?.focus();
  }

  function handleSearch() {
    if (!searchKeyword) {
      setProduct(null);
      setMessage("Silakan scan barcode produk terlebih dahulu.");
      setHasSearched(true);
      return;
    }

    const barcode = searchKeyword;
    setSearchedBarcode(barcode);
    setHasSearched(true);

    startTransition(async () => {
      const result = await searchProduct(searchKeyword, selectedOutletId);

      setProduct(result.product);
      setMessage(result.message);
      setSearchKeyword("");
      document.activeElement?.blur();
    });
  }

  return (
    <main className="space-y-5">
      <section className="bg-white items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 space-y-5">
        <div className="flex space-x-3 items-center">
          <PackagePlus size={30} />
          <h1 className="text-2xl font-bold">Tambah Stok Produk</h1>
        </div>

        <OutletSelection
          outlets={outlets}
          selectedOutletId={selectedOutletId}
        />

        <SearchBar
          keyword={searchKeyword}
          onKeywordChange={setSearchKeyword}
          onSearch={handleSearch}
          placeholder="Cari produk / Scan produk di sini"
          showScanButton
          inputRef={searchInputRef}
        />
      </section>

      <section className="bg-white rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4">
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
            <LoaderCircle size={32} className="animate-spin" />
            <p className="text-sm">Mencari produk...</p>
          </div>
        ) : !hasSearched ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <ScanBarcode size={40} />
            <p className="font-medium text-gray-600">
              Belum ada produk yang dicari
            </p>
            <p className="text-center text-sm">
              Scan barcode produk atau masukkan barcode pada kolom pencarian.
            </p>
          </div>
        ) : product ? (
          <ProductSearchResult
            product={product}
            message={message}
            selectedOutletId={selectedOutletId}
            onStockInComplete={focusSearchBar}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <PackageSearch size={40} />

            <p className="font-semibold text-gray-800">
              Produk tidak ditemukan
            </p>

            <p className="text-center text-sm text-gray-500">
              Tidak ada produk dengan barcode{" "}
              <span className="font-medium text-gray-700">
                {searchedBarcode}
              </span>{" "}
              pada outlet yang dipilih.
            </p>

            {message && (
              <p className="text-center text-sm text-red-500">{message}</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
