import { Container, Pagination } from 'react-bootstrap'

interface Props {

}

const TablePagination = (props: Props) => {
    return (
        <Container fluid className="d-flex justify-content-end">
            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item active ><span className="text-secondary">1</span></Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </Container>
    )
}

export default TablePagination
