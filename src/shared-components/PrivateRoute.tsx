import { AxiosError } from "axios";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Route, useHistory } from "react-router-dom";
import { handleApiError } from "../hooks/handleApiErrors";
import useMeQuery from "../hooks/useMeQuery";
import useTokenStore from "../hooks/useTokenStore";
import API from "../utils/API";

export const PrivateRoute = ({ component: Component, ...rest }: any) => {
  // const { isFetching, isLoading, error } = useMeQuery();

  // if (isLoading || isFetching) {
  //   return (
  //     <Container
  //       fluid
  //       className="d-flex justify-content-center align-items-center mt-4"
  //     >
  //       <Spinner animation="border" />
  //     </Container>
  //   );
  // }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};
