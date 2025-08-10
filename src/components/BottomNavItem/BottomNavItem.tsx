import React from "react";
import { useHistory } from "react-router-dom";

interface BottomNavItemProps {
  icon: JSX.Element;
  name: string;
  linkTo: string;
}

export const BottomNavItem = ({ icon, linkTo, name }: BottomNavItemProps) => {
  const history = useHistory();
  const pathname = window.location.pathname;

  return (
    <div
      className="flex flex-col gap-[5px] items-center"
      onClick={() => {
        history.push(linkTo);
      }}
    >
      <div
        className={`px-[15px] py-1 rounded-[52px] ${
          pathname === linkTo ? "bg-[rgb(207,204,204)]" : ""
        }`}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold text-[#26262A]">{name}</p>
    </div>
  );
};
