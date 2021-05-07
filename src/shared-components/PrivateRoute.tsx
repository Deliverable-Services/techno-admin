import { Container, Spinner } from "react-bootstrap";
import { Route } from "react-router-dom";
import useMeQuery from "../hooks/useMeQuery";


export const PrivateRoute = ({ component: Component, ...rest }: any) => {

  const { isFetching, isLoading, error, } = useMeQuery();



  if (isLoading || isFetching || error) {
    return <Container fluid className="d-flex justify-content-center align-items-center mt-4"><Spinner animation="border" /></Container>;
  }
  return (
    <Route {...rest} render={(props) => (

      <Component {...props} />

    )} />
  );
};
