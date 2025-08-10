import profile from "../../assets/profile.svg";
import { useHistory } from "react-router-dom";
import "./EditAccountCard.css";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { Hammer } from "../ui/icon";

export const EditAccountCard = () => {
  const history = useHistory();
  const user = useUserProfileStore((state) => state.user);

  return (
    <div className="card-container">
      <div className="details-main-container">
        <img src={profile} alt="profile" className="profile" />
        <div className="detail-main-container">
          <div className="details-container">
            <p className="user-name">{user?.name}</p>
            <p className="text c-gray capitalize">{user?.role}</p>
          </div>
          <div className="details-container">
            <div className="contact-info-cont">
              <Hammer />
              <p className="text c-black">{user?.email}</p>
            </div>
            <div className="contact-info-cont">
              <Hammer />
              <p className="text c-black">{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="edit-account-btn"
        onClick={() => history.push("/profile")}
      >
        <Hammer /> Edit Account
      </button>
    </div>
  );
};
