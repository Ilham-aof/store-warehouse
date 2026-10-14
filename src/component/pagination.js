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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item key={page}>
            <Pagination.Link
              isActive={page === currentPage}
              onPress={() => onPageChange(page)}
            >
              {page}
            </Pagination.Link>
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
