import { AxiosError } from "axios";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Route, useHistory } from "react-router-dom";
import useMeQuery from "../hooks/useMeQuery";
import useTokenStore from "../hooks/useTokenStore";
import API from "../utils/API";


export const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const history = useHistory()
  const setToken = useTokenStore(state => state.setToken)

  const { isFetching, isLoading, error, } = useMeQuery();

  useEffect(() => {

    async function handle401Error() {

      if (error) {
        const is401Error = (error as AxiosError).response?.status == 401
        if (is401Error) {
          try {
            const { data, status } = await API.post('/auth/refresh')
            console.log("refresh-data", data)

            if (data) setToken(data.access_token)
          } catch (error) {
            history.push("/login")
          }
        } else {
          history.push("/login")
        }
      }
    }

    handle401Error()
  }, [error])


  if (isLoading || isFetching) {
    return <Container fluid className="d-flex justify-content-center align-items-center mt-4"><Spinner animation="border" /></Container>;
  }
  return (
    <Route {...rest} render={(props) => (

      <Component {...props} />

    )} />
  );
};
