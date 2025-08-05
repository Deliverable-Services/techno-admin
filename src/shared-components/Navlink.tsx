import { useRef, useState, useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { INavLink } from "../types/interface";
import { IsDesktopContext } from "../context/IsDesktopContext";
import Restricted from "./Restricted";

interface SidebarMenuItemProps extends INavLink {
  onClick: () => void;
  isNavOpen: boolean;
  activeMenu: string | null;
  setActiveMenu: (title: string | null) => void;
}

const NavLink = ({
  title,
  path,
  icon,
  permissionReq,
  children,
  onClick,
  isNavOpen,
  activeMenu,
  setActiveMenu,
}: SidebarMenuItemProps) => {
  const menuRef = useRef<HTMLLIElement>(null);
  const { pathname } = useLocation();
  const history = useHistory();
  const isDesktop = useContext(IsDesktopContext);

  const hasChildren = children && children.length > 0;

  const isOpen = activeMenu === title;

  const handleParentClick = () => {
    if (hasChildren) {
      if (isOpen) {
        setActiveMenu(null);
      } else {
        setActiveMenu(title);
        const firstChildPath = children[0]?.path;
        if (firstChildPath && !pathname.includes(firstChildPath)) {
          history.push(firstChildPath);
          onClick();
        }
      }
    } else {
      setActiveMenu(null); // close any submenu
      if (path && !pathname.includes(path)) {
        history.push(path);
        onClick();
      }
    }
  };

  return (
    <Restricted to={permissionReq}>
      <li className="navLinkGroup" ref={menuRef}>
        {hasChildren ? (
          <div className="navLink parent" onClick={handleParentClick} style={{ cursor: "pointer" }}>
            {icon} {title}
          </div>
        ) : (
          <Link to={path || "#"}>
            <li
              className={pathname.includes(path || "") ? "navLink active" : "navLink"}
              onClick={onClick}
            >
              {icon} {title}
            </li>
          </Link>
        )}

        {hasChildren && isOpen && (
          <ul className="submenu" style={{ marginLeft: '24px' }}>
            {children.map((child) => (
              <Restricted to={child.permissionReq} key={child.title}>
                <Link to={child.path || "#"}>
                  <li
                    className={
                      pathname.includes(child.path || "")
                        ? "navLink subLink active"
                        : "navLink subLink"
                    }
                    onClick={onClick}
                  >
                    {child.icon}  {child.title}
                  </li>
                </Link>
              </Restricted>
            ))}
          </ul>
        )}
      </li>
    </Restricted>
  );
};

export default NavLink;
