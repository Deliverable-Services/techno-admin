import { BottomNavItem } from "../BottomNavItem/BottomNavItem";
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
    <div className="fixed bottom-0 min-w-full px-5 py-2.5 bg-white border-t border-[#E9E7EA] z-[100000000000000000]">
      <div className="flex flex-row gap-[15px] justify-between">
        {tabs?.map((item, index) => (
          <BottomNavItem
            key={index}
            icon={item?.icon}
            linkTo={item?.linkTo}
            name={item?.name}
          />
        ))}
      </div>
    </div>
  );
};
