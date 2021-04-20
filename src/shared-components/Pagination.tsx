import { Container, Pagination } from 'react-bootstrap'

interface Props {
    currentPage: number;
    lastPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const TablePagination = ({ currentPage, setPage, hasNextPage, hasPrevPage, lastPage }: Props) => {
    return (
        <Container fluid className="d-flex justify-content-end">
            <Pagination>
                <Pagination.First onClick={() => setPage(1)} />
                {
                    hasPrevPage &&
                    <Pagination.Prev onClick={() => setPage(currentPage - 1)} />
                }
                <Pagination.Item active ><span className="text-secondary">{currentPage}</span></Pagination.Item>
                {
                    hasNextPage &&
                    <Pagination.Next onClick={() => setPage(currentPage + 1)} />
                }
                <Pagination.Last onClick={() => setPage(lastPage)} />
            </Pagination>
        </Container>
    )
}

export default TablePagination
