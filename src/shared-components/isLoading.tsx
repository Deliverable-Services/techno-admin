import { Container, Spinner } from "react-bootstrap";

const IsLoading = ({ ...props}) => {
  return (
    <Container fluid className="d-flex justify-content-center pt-3 pb-3" {...props}>
      <Spinner style={{width:'28px',height:'28px'}} variant="primary" animation="border" />
    </Container>
  );
};

export default IsLoading;
