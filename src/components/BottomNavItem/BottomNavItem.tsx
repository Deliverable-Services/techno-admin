import React from "react";
import './index.css'
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
      className='itemContainer'
      onClick={() => {
        history.push(linkTo);
      }}
    >
      <div className={`iconContainer ${pathname === linkTo && "item-selected"}`}>
        {icon}
      </div>
      <p className="name">{name}</p>
    </div>
  );
};