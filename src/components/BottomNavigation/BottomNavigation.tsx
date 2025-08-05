import { useState } from "react";
import { BottomNavItem } from "../BottomNavItem/BottomNavItem";
import "./index.css";
import { FaHome } from "react-icons/fa";
import { SiCivicrm } from "react-icons/si";
import { RiServiceFill } from "react-icons/ri";

const tabs = [
  {
    name: "Home",
    linkTo: "/dashboard",
    icon: <FaHome size={20} />,
  },
  {
    name: "CRM",
    linkTo: "/crm",
    icon: <SiCivicrm />,
  },
  {
    name: "Invoices",
    linkTo: "/invoices",
    icon: <SiCivicrm />,
  },
  {
    name: "Services",
    linkTo: "/services",
    icon: <RiServiceFill />,
  },
];

export const BottomNavigation = () => {
  return (
    <div className="navContainer">
      <div className="navItemsCont">
        {tabs?.map((item, index) => (
          <BottomNavItem
            icon={item?.icon}
            linkTo={item?.linkTo}
                name={item?.name}
          />
        ))}
      </div>
    </div>
  );
};
