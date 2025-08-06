import { Button } from "react-bootstrap";
import profile from "../../assets/profile.svg";
import { useHistory } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import BackButton from "../../shared-components/BackButton";
import { BiArrowFromRight } from "react-icons/bi";
import { GiCandlestickPhone, GiPencil } from "react-icons/gi";
import "./EditAccountCard.css";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { IoMdMail } from "react-icons/io";
import { FaHeadphones } from "react-icons/fa";

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
              <IoMdMail />
              <p className="text c-black">{user?.email}</p>
            </div>
            <div className="contact-info-cont">
              <FaHeadphones />
              <p className="text c-black">{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <button className="edit-account-btn" onClick={() => history.push('/profile')}>
        <GiPencil /> Edit Account
      </button>
    </div>
  );
};
