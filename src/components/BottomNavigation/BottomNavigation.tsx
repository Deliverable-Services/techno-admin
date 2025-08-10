import { BottomNavItem } from "../BottomNavItem/BottomNavItem";
import "./index.css";
import { MoreTabIcon } from "../../assets/MoreTabIcon";
import { Hammer } from "../ui/icon";

const tabs = [
  {
    name: "Home",
    linkTo: "/dashboard",
    icon: <Hammer size={20} />,
  },
  {
    name: "CRM",
    linkTo: "/crm",
    icon: <Hammer />,
  },
  {
    name: "Invoices",
    linkTo: "/invoices",
    icon: <Hammer size={20} />,
  },
  {
    name: "Services",
    linkTo: "/services",
    icon: <Hammer />,
  },
  {
    name: "More",
    linkTo: "/more",
    icon: <Hammer />,
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
