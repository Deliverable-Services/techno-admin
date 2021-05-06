import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Route, useHistory } from "react-router-dom";
import useMeQuery from "../hooks/useMeQuery";
import useTokenStore from "../hooks/useTokenStore";
import axios, { AxiosError } from "axios";
import { showErrorToast } from "../utils/showErrorToast";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { QueryFunction, useQuery } from "react-query";
import API from "../utils/API";
import { queryClient } from "../utils/queryClient";


const refreshToken: QueryFunction = async ({ queryKey }) => {

  const r = await API.get(`${queryKey[0]}`, {
  })
  return r.data

}
export const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const token = useTokenStore(state => state.accessToken);
  const setToken = useTokenStore(state => state.setToken);
  const setUser = useUserProfileStore(state => state.setUser);

  const removeToken = useTokenStore(state => state.removeToken);
  const removeUser = useUserProfileStore(state => state.removeUser);
  const [doRefreshToken, setDoRefreshToken] = useState(false);
  const { data, isFetching, isLoading, error } = useMeQuery();
  const history = useHistory();

  const { data: rData, isLoading: rIsLoading, isFetching: rIsFetching } = useQuery(["auth/refresh", token], refreshToken, {
    retry: false,
    enabled: doRefreshToken,
    onSuccess: (data: any) => {
      setUser(data.user);
      setToken(data.access_token);
      queryClient.invalidateQueries("profile")
    }
  });


  useEffect(() => {

    if (error as AxiosError | Error) {
      setDoRefreshToken(false);
      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 401) {
          setDoRefreshToken(true);
        } else {
          showErrorToast(error.response?.data.message || "Something went wrong");
          removeToken();
          removeUser();
        }


      }
    }
  }, [error])





  useEffect(() => {
    if (!rData) {

      if (!isLoading && !isFetching) {
        if (!data)
          history.push("/login");
      }

    }
  }, [data, history, isLoading, isFetching, rData]);

  if (isLoading || isFetching) {
    return <Container fluid className="d-flex justify-content-center align-items-center mt-4"><Spinner animation="border" /></Container>;
  }
  return (
    <Route {...rest} render={(props) => (

      <Component {...props} />

    )} />
  );
};
