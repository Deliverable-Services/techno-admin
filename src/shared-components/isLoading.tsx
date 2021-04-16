
import { Container, Spinner } from 'react-bootstrap'


const IsLoading = () => {


    return (
        <Container fluid className="d-flex justify-content-center">
            <Spinner variant="primary" animation="border" />
        </Container>
    )
}

export default IsLoading
