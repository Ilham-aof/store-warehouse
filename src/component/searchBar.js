"use client";

import { SearchField, Button } from "@heroui/react";
import { ScanBarcode } from "lucide-react";

export function SearchBar({
  keyword,
  onKeywordChange,
  onSearch,
  placeholder,
  showScanButton,
  inputRef,
}) {
  return (
    <form
      className="flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <SearchField
        name="secondary-search"
        variant="secondary"
        aria-label="Search Produk"
      >
        <SearchField.Group className="rounded-3xl ring-slate-800">
          <SearchField.SearchIcon />

          <SearchField.Input
            ref={inputRef}
            id="search-input"
            placeholder={placeholder}
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
          />

          <SearchField.ClearButton onPress={() => onKeywordChange("")} />

          {showScanButton && (
            <Button
              type="button"
              onPress={() => {
                document.getElementById("search-input")?.focus();
              }}
              aria-label="Aktifkan mode scan barcode"
              variant="ghost"
              className="rounded-r-full"
            >
              <ScanBarcode /> Scan
            </Button>
          )}
        </SearchField.Group>
      </SearchField>
    </form>
  );
}
