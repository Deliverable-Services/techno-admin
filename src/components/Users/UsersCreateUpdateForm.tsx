import UserAddress from "./UserAddresses";
import UserBasics from "./UserBasics";
import UserVehicles from "./UserVechiles";


const UserCreateUpdateForm = () => {

  return (
    <>
      <UserBasics />
      <UserAddress />
      <UserVehicles />
    </>
  );
};

export default UserCreateUpdateForm;
