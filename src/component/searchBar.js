"use client";

import { SearchField, Button } from "@heroui/react";

export function SearchBar({ keyword, onKeywordChange, onSearch, placeholder }) {
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
            placeholder={placeholder}
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
          />

          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </form>
  );
}
