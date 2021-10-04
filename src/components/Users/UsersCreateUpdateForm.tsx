import { useLocation } from "react-router-dom";
import Restricted from "../../shared-components/Restricted";
import AgentTargets from "./AgentTarget";
import UserAddress from "./UserAddresses";
import UserBasics from "./UserBasics";
import UserVehicles from "./UserVechiles";
import UserWallet from "./UserWallet";

const UserCreateUpdateForm = () => {
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  const role = state ? (state as any)?.role : null;
  return (
    <>
      <UserBasics />
      <br />
      {id && (
        <>
          {role === "customer" && (
            <Restricted to="update_user">
              <UserWallet />
            </Restricted>
          )}
          {role === "agent" && <AgentTargets />}
          <UserAddress />
          <UserVehicles />
        </>
      )}
    </>
  );
};

export default UserCreateUpdateForm;
