import { SearchField } from "@heroui/react";

export function SearchBar({ keyword, onKeywordChange }) {
  return (
    <div className="flex-1">
      <SearchField
        name="secondary-search"
        variant="secondary"
        aria-label="Search Produk"
      >
        <SearchField.Group className="rounded-3xl">
          <SearchField.SearchIcon />
          <SearchField.Input
            placeholder="Cari Produk..."
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
          />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </div>
  );
}
