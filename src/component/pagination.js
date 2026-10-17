"use client";

import { Pagination } from "@heroui/react";

export function PaginationUi({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}) {
  if (totalItems === 0 || totalPages < 1) {
    return null;
  }

  function getVisiblePages() {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, "...", totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  }

  return (
    <Pagination className="justify-center">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={currentPage <= 1}
            onPress={() => onPageChange(currentPage - 1)}
          >
            <Pagination.PreviousIcon />
          </Pagination.Previous>
        </Pagination.Item>

        {getVisiblePages().map((page, index) => (
          <Pagination.Item key={`${page}-${index}`}>
            {page === "..." ? (
              <span className="px-2">...</span>
            ) : (
              <Pagination.Link
                isActive={page === currentPage}
                onPress={() => onPageChange(page)}
              >
                {page}
              </Pagination.Link>
            )}
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next
            isDisabled={currentPage >= totalPages}
            onPress={() => onPageChange(currentPage + 1)}
          >
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
