import { Container } from "../components/ui/grid";
import { Spinner } from "../components/ui/spinner";
import { Route } from "react-router-dom";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { useOrganisation } from "../context/OrganisationContext";

const key = "get-all-permission";

const restrictedRoutesForStoreType = {
  ecommerce: [
    "/crm",
    "/crm-bookings",
    "/services",
    "/products",
    "/product-brands",
    "/categories",
  ],
  crm: [
    "/orders",
    "/cart",
    "/plans",
    "/coupons",
    "/agent",
    "/agent-targets",
    "/product-variants",
  ],
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
  const { selectedOrg } = useOrganisation();

  // checking for read permission of the route here
  const isAllowed = (to: string) =>
    loggedInUserPermissions && loggedInUserPermissions.length > 0
      ? loggedInUserPermissions.includes(to)
      : false;

  const hasPermission = skipPermission || isAllowed(permissionReq);

  const restrictedRoutes =
    restrictedRoutesForStoreType[selectedOrg?.store_type.toLowerCase()] || [];
  const isStoreTypeBlocked = restrictedRoutes.includes(path);

  if (!hasPermission || isStoreTypeBlocked) {
    return (
      <Container fluid className="flex justify-center items-center mt-4">
        <Container fluid className="flex justify-center text-5xl">
          <div className="flex flex-col items-center">
            <Spinner size="sm" className="mt-5" />
            {/* <FaBan color="red" />
            <span className="text-danger display-3">Unauthorised</span> */}
          </div>
        </Container>
      </Container>
    );
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};
