import { Container, Pagination } from "../components/ui/bootstrap-compat";

interface Props {
  currentPage: number;
  lastPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  // setPage: (idx: string, value: any) => void;
  setPage: any;
}

const TablePagination = ({
  currentPage,
  setPage,
  hasNextPage,
  hasPrevPage,
  lastPage,
}: Props) => {
  return (
    <Container fluid className="d-flex justify-content-end align-items-center">
      <Pagination>
        <Pagination.First onClick={() => setPage("page", 1)} />
        {hasPrevPage && (
          <Pagination.Prev onClick={() => setPage("page", currentPage - 1)} />
        )}
        <Pagination.Item active>
          <span className="text-secondary">{currentPage}</span>
        </Pagination.Item>
        {hasNextPage && (
          <Pagination.Next onClick={() => setPage("page", currentPage + 1)} />
        )}
        <Pagination.Last onClick={() => setPage("page", lastPage)} />
      </Pagination>
    </Container>
  );
};

export default TablePagination;
