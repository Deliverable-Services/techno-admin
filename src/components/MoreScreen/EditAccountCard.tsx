import profile from "../../assets/profile.svg";
import { useHistory } from "react-router-dom";

import useUserProfileStore from "../../hooks/useUserProfileStore";
import { Hammer } from "../ui/icon";

export const EditAccountCard = () => {
  const history = useHistory();
  const user = useUserProfileStore((state) => state.user);

  return (
    <div className="p-4 flex flex-col rounded-xl bg-white border border-gray-200 gap-4">
      <div className="flex flex-row gap-5 items-center">
        <img src={profile} alt="profile" className="w-24 h-24" />
        <div className="flex flex-col justify-between gap-2.5">
          <div className="flex flex-col gap-1.5">
            <p className="text-xl text-gray-800 font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row gap-2.5 items-center">
              <Hammer />
              <p className="text-sm text-gray-800">{user?.email}</p>
            </div>
            <div className="flex flex-row gap-2.5 items-center">
              <Hammer />
              <p className="text-sm text-gray-800">{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="w-full bg-gray-100 border border-gray-200 text-gray-800 flex items-center justify-center gap-2.5 py-2.5 rounded"
        onClick={() => history.push("/profile")}
      >
        <Hammer /> Edit Account
      </button>
    </div>
  );
};
