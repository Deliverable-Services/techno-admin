import { AxiosError } from "axios";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { FaBan } from "react-icons/fa";
import { useQuery } from "react-query";
import { Route, useHistory } from "react-router-dom";
import { handleApiError } from "../hooks/handleApiErrors";
import useMeQuery from "../hooks/useMeQuery";
import useTokenStore from "../hooks/useTokenStore";
import useUserProfileStore from "../hooks/useUserProfileStore";
import API from "../utils/API";

const key = "get-all-permission";
export const PrivateRoute = ({
  component: Component,
  permissionReq,
  skipPermission,
  ...rest
}: any) => {
  const loggedInUserPermissions = useUserProfileStore(
    (state) => state?.permissions
  );

  // checking for read permission of the route here
  const isAllowed = (to: string) =>
    loggedInUserPermissions && loggedInUserPermissions.length > 0
      ? loggedInUserPermissions.includes(to)
      : false;

  console.log(
    "is allowed to view",
    { isAllowed: isAllowed(permissionReq) },
    permissionReq
  );

  if (!skipPermission && !isAllowed(permissionReq)) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center mt-4"
      >
        <Container fluid className="d-flex justify-content-center display-3">
          <div className="d-flex flex-column align-items-center">
            <FaBan color="red" />
            <span className="text-danger display-3">Unauthorised</span>
          </div>
        </Container>
      </Container>
    );
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};
