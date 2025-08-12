import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "../components/ui/pagination";

interface Props {
  currentPage: number;
  lastPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  setPage: (key: any, value: any) => void;
}

const TablePagination = ({
  currentPage,
  setPage,
  hasNextPage,
  hasPrevPage,
  lastPage,
}: Props) => {
  // Generate a small list of visible pages
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 3; // Adjust if needed

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(lastPage, currentPage + 1);

    if (currentPage === 1) {
      end = Math.min(lastPage, start + (maxVisible - 1));
    }
    if (currentPage === lastPage) {
      start = Math.max(1, lastPage - (maxVisible - 1));
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-end items-center">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          {hasPrevPage && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage("page", currentPage - 1);
                }}
              />
            </PaginationItem>
          )}

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  setPage("page", page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Ellipsis if needed */}
          {currentPage < lastPage - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next Button */}
          {hasNextPage && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage("page", currentPage + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
