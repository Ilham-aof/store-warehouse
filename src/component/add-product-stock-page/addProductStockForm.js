"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { PackagePlus, PackageMinus } from "lucide-react";
import { SearchBar } from "@/component/searchBar";
import { OutletSelection } from "@/component/outletSelection";
import { searchProduct } from "@/app/action/product/searchProduct";
import { ProductSearchResult } from "@/component/add-product-stock-page/productSearchResult";

export function AddProductStockForm({ outlets, selectedOutletId, mode }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);
  const [items, setItems] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  async function handleSearch() {
    const barcode = searchKeyword.trim();

    if (!barcode) {
      setMessage("Silakan scan barcode produk terlebih dahulu.");
      setHasSearched(true);
      return;
    }

    setHasSearched(true);
    setMessage("");
    setSearchKeyword("");

    startTransition(async () => {
      const result = await searchProduct(barcode, selectedOutletId);

      if (!result.product) {
        setMessage(result.message);
        return;
      }

      const scannedProduct = result.product;

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.id === scannedProduct.id,
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === scannedProduct.id
              ? { ...item, addQuantity: item.addQuantity + 1 }
              : item,
          );
        }

        return [
          ...currentItems,
          {
            ...scannedProduct,
            addQuantity: 1,
          },
        ];
      });
    });
  }
  return (
    <div className="space-y-5">
      <section className="bg-white items-center rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-gray-400 p-4 space-y-5">
        <div className="flex space-x-3 items-center">
          {mode === "in" ? (
            <PackagePlus size={30} />
          ) : (
            <PackageMinus size={30} />
          )}
          <h1 className="text-2xl font-bold">
            {mode === "in" ? "Tambah Stok Produk" : "Ambil Stok Produk"}
          </h1>
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
        <ProductSearchResult
          items={items}
          message={message}
          hasSearched={hasSearched}
          isSearching={isPending}
          selectedOutletId={selectedOutletId}
          outlets={outlets}
          mode={mode}
        />
      </section>
    </div>
  );
}
