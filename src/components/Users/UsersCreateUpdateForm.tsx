import { useLocation } from "react-router-dom";
import AgentTargets from "./AgentTarget";
import UserAddress from "./UserAddresses";
import UserBasics from "./UserBasics";

interface UserCreateUpdateFormProps {
  toggleModal: () => void;
  id?: string | null;
  role?: string;
}

const UserCreateUpdateForm = ({ toggleModal, id, role }: UserCreateUpdateFormProps) => {
  return (
    <>
      <UserBasics toggleModal={toggleModal} />
      <br />
      {id && (
        <>
          {/* {role === "customer" && (
            <Restricted to="update_user">
              <UserWallet />
            </Restricted>
          )} */}
          {role === "agent" && <AgentTargets />}
          <UserAddress />
          {/* <UserVehicles /> */}
        </>
      )}
    </>
  );
};

export default UserCreateUpdateForm;
