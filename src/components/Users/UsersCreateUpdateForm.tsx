import { useLocation } from "react-router-dom";
import UserAddress from "./UserAddresses";
import UserBasics from "./UserBasics";
import UserVehicles from "./UserVechiles";


const UserCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null;
  console.log({ id })
  return (
    <>
      <UserBasics />
      {
        id &&
        <>
          <UserAddress />
          <UserVehicles />
        </>
      }
    </>
  );
};

export default UserCreateUpdateForm;
