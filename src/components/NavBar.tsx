import { useContext } from "react";
import {
  FaAddressCard,
  FaBoxes,
  FaDiceFour,
  FaQuestionCircle,
  FaRegLightbulb,
  FaUsers,
  FaMoneyCheck,
} from "react-icons/fa";
import { GoIssueOpened } from "react-icons/go";
import { IoLogoModelS } from "react-icons/io";
import { GiModernCity, GiOnTarget } from "react-icons/gi";
import {
  RiAdminFill,
  RiAdvertisementFill,
  RiCoupon3Line,
  RiDashboardFill,
  RiNotification2Line,
  RiPagesLine,
  RiServiceFill,
} from "react-icons/ri";
import { SiBrandfolder } from "react-icons/si";
import { IsDesktopContext } from "../context/IsDesktopContext";
import Logo from "../shared-components/Logo";
import Navlink from "../shared-components/Navlink";
import Overlay from "../shared-components/Overlay";
import { INavBar, INavLink } from "../types/interface";
import { MdShoppingCart } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { AiFillIdcard, AiFillSetting } from "react-icons/ai";
import { BsClock, BsShieldLock } from "react-icons/bs";
import { GrDocumentConfig } from "react-icons/gr";

const manageLinks: Array<INavLink> = [
  {
    title: "Brands",
    path: "/brands",
    icon: <SiBrandfolder />,
  },
  {
    title: "Brand Models",
    path: "/brand-models",
    icon: <IoLogoModelS />,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: <FaDiceFour />,
  },
  {
    title: "Users",
    path: "/users",
    icon: <ImUsers />,
  },
  {
    title: "Admins",
    path: "/admin",
    icon: <RiAdminFill />,
  },
  {
    title: "Agent Targets",
    path: "/agent-targets",
    icon: <GiOnTarget />,
  },
  {
    title: "Services",
    path: "/services",
    icon: <RiServiceFill />,
  },
  {
    title: "Faqs",
    path: "/faqs",
    icon: <FaQuestionCircle />,
  },
  {
    title: "Plans",
    path: "/plans",
    icon: <FaRegLightbulb />,
  },
  {
    title: "Coupons",
    path: "/coupons",
    icon: <RiCoupon3Line />,
  },
  {
    title: "Banners",
    path: "/advertisements",
    icon: <RiAdvertisementFill />,
  },
  {
    title: "Permissions",
    path: "/permissions",
    icon: <BsShieldLock />,
  },
  {
    title: "Roles",
    path: "/roles",
    icon: <FaUsers />,
  },
  {
    title: "Configurations",
    path: "/configurations",
    icon: <AiFillSetting />,
  },
  {
    title: "Booking Slots",
    path: "/booking-slots",
    icon: <BsClock />,
  },
  {
    title: "Cities",
    path: "/cities",
    icon: <GiModernCity />,
  },
  {
    title: "Testimonials",
    path: "/testimonials",
    icon: <AiFillIdcard />,
  },
  {
    title: "Static Pages",
    path: "/static-pages",
    icon: <RiPagesLine />,
  },
];

const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <FaBoxes />,
  },
  {
    title: "Cart",
    path: "/cart",
    icon: <MdShoppingCart />,
  },
  {
    title: "Subscriptions",
    path: "/subscriptions",
    icon: <FaAddressCard />,
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <FaMoneyCheck />,
  },
  {
    title: "Issues",
    path: "/issues",
    icon: <GoIssueOpened />,
  },
  {
    title: "Notifications",
    path: "/push-notifications",
    icon: <RiNotification2Line />,
  },
];

const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);

  const closeNavBar = () => {
    if (setIsNavOpen) {
      setIsNavOpen(false);
    }
  };

  return (
    <>
      <nav className={isNavOpen ? "active" : ""}>
        {isDesktop ? <Logo /> : null}

        <div className="all-links">
          <ul className="pt-4">
            <Navlink
              title="Dashboard"
              path="/dashboard"
              onClick={closeNavBar}
              icon={<RiDashboardFill />}
            />
          </ul>

          <p className="text-muted mb-2">Main</p>
          <ul>
            {mainLinks.map(({ title, path, icon }) => (
              <Navlink
                path={path}
                title={title}
                key={title}
                onClick={closeNavBar}
                icon={icon}
              />
            ))}
          </ul>

          <p className="text-muted mb-2">Manage</p>
          <ul>
            {manageLinks.map(({ title, path, icon }) => (
              <Navlink
                path={path}
                title={title}
                key={title}
                onClick={closeNavBar}
                icon={icon}
              />
            ))}
          </ul>
        </div>
      </nav>
      {isNavOpen && <Overlay onClick={closeNavBar} />}
    </>
  );
};

export default NavBar;
