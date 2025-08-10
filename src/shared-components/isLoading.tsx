import { Container } from "../components/ui/grid";
import { Spinner } from "../components/ui/spinner";

const IsLoading = ({ ...props }) => {
  return (
    <Container fluid className="flex justify-center pt-3 pb-3" {...props}>
      <Spinner
        className="text-primary"
        style={{ width: "28px", height: "28px" }}
      />
    </Container>
  );
};

export default IsLoading;
