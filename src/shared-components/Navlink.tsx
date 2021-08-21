import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IsDesktopContext } from "../context/IsDesktopContext";
import { INavLink } from "../types/interface";

const Navlink = ({ title, path, onClick, icon, isNavOpen }: INavLink) => {
  const isDesktop = useContext(IsDesktopContext);
  const { pathname } = useLocation();
  return (
    <Link to={path}>
      <li
        className={pathname.includes(path) ? "navLink active" : "navLink my-1"}
        onClick={onClick}
      >
        {icon && icon} {title}
      </li>
    </Link>
  );
};

export default Navlink;
