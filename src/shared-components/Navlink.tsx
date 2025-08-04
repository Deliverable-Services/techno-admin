import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IsDesktopContext } from "../context/IsDesktopContext";
import { INavLink } from "../types/interface";
import Restricted from "./Restricted";

const Navlink = ({ title, path, onClick, icon, permissionReq }: INavLink) => {
  const isDesktop = useContext(IsDesktopContext);
  const { pathname } = useLocation();
  return (
    <Restricted to={permissionReq}>
      <Link to={path}>
        <li
          className={
            pathname.includes(path) ? "navLink active" : "navLink"
          }
          onClick={onClick}
        >
          {icon && icon} {title}
        </li>
      </Link>
    </Restricted>
  );
};

export default Navlink;
