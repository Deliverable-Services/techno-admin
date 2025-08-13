import { useRef } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { INavLink } from "../types/interface";
import Restricted from "./Restricted";
import { ChevronDown } from "../components/ui/icon";

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
      <li className="flex flex-col gap-1" ref={menuRef}>
        {hasChildren ? (
          <div
            className="w-full text-gray-900 transition-all duration-300 ease-in text-[13px] font-medium px-3 py-1.5 flex items-center justify-between cursor-pointer rounded-lg hover:bg-[#fafafa] hover:text-[#252b37]"
            onClick={handleParentClick}
          >
            <div className="flex items-center gap-2">
              {icon} {title}
            </div>
            <ChevronDown
              style={{
                transition: "transform 0.3s ease",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                marginLeft: "8px",
              }}
              className="w-4 h-4"
            />
          </div>
        ) : (
          <Link to={path || "#"}>
            <li
              className={`w-full text-gray-900 transition-all duration-300 ease-in text-[13px] rounded-lg font-medium px-3 py-1.5 flex items-center hover:bg-[#fafafa] ${
                pathname.includes(path || "")
                  ? "navLink active bg-[#fafafa]"
                  : "navLink"
              }`}
              onClick={onClick}
            >
              {icon} {title}
            </li>
          </Link>
        )}

        {hasChildren && isOpen && (
          <ul className="ml-3">
            {children.map((child) => (
              <Restricted to={child.permissionReq} key={child.title}>
                <Link to={child.path || "#"}>
                  <li
                    className={`w-full text-black transition-all duration-300 ease-in text-[13px] rounded-lg font-medium px-[0.8rem] py-[0.4rem] flex items-center hover:bg-[#fafafa] ${
                      pathname.includes(child.path || "")
                        ? "navLink subLink active bg-[#fafafa]"
                        : "navLink subLink"
                    }`}
                    onClick={onClick}
                  >
                    {child.icon} {child.title}
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
