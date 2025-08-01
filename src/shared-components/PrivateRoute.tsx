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

const restrictedRoutesForStoreType = {
  ecommerce: ["/crm", "/crm-bookings", "/services", "/products", "/product-brands", "/categories"],
  crm: ["/orders", "/cart", "/plans", "/coupons", "/agent", "/agent-targets", "/cities", "/product-variants"],
};

export const PrivateRoute = ({
  component: Component,
  permissionReq,
  skipPermission,
  path,
  ...rest
}: any) => {
  const loggedInUserPermissions = useUserProfileStore(
    (state) => state?.permissions
  );
  const loggedInUser = useUserProfileStore(
    (state) => state?.user
  );

  // checking for read permission of the route here
  const isAllowed = (to: string) =>
    loggedInUserPermissions && loggedInUserPermissions.length > 0
      ? loggedInUserPermissions.includes(to)
      : false;

  const hasPermission = skipPermission || isAllowed(permissionReq);
  
  // Check storeType restrictions
  if (loggedInUser.organisations && !loggedInUser.organisations[0].hasOwnProperty("store_type")) loggedInUser.organisations[0].store_type = "crm"; // setting default to CRM if no organisation found

  const restrictedRoutes = restrictedRoutesForStoreType[loggedInUser?.organisations[0].store_type.toLowerCase()] || [];
  const isStoreTypeBlocked = restrictedRoutes.includes(path);

  if (!hasPermission || isStoreTypeBlocked) {
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
