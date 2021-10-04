import { useContext } from "react";
import {
  FaAddressCard,
  FaBoxes,
  FaDiceFour,
  FaQuestionCircle,
  FaRegLightbulb,
  FaUsers,
  FaMoneyCheck,
  FaUserSecret,
  FaArrowAltCircleLeft,
  FaArrowLeft,
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
import { primaryColor } from "../utils/constants";

const manageLinks: Array<INavLink> = [
  {
    title: "Brands",
    path: "/brands",
    icon: <SiBrandfolder />,
    permissionReq: "read_brand",
  },
  {
    title: "Brand Models",
    path: "/brand-models",
    icon: <IoLogoModelS />,
    permissionReq: "read_brandmodel",
  },
  {
    title: "Car Types",
    path: "/car-types",
    icon: <IoLogoModelS />,
    permissionReq: "read_brandmodel",
  },
  {
    title: "Categories",
    path: "/categories",
    icon: <FaDiceFour />,
    permissionReq: "read_category",
  },
  {
    title: "Customers",
    path: "/users",
    icon: <ImUsers />,
    permissionReq: "read_user",
  },
  {
    title: "Admins",
    path: "/admin",
    icon: <RiAdminFill />,
    permissionReq: "read_user",
  },
  {
    title: "Agents",
    path: "/agent",
    icon: <FaUserSecret />,
    permissionReq: "read_user",
  },
  {
    title: "Agent Targets",
    path: "/agent-targets",
    icon: <GiOnTarget />,
    permissionReq: "read_agenttarget",
  },
  {
    title: "Services",
    path: "/services",
    icon: <RiServiceFill />,
    permissionReq: "read_service",
  },
  {
    title: "Faqs",
    path: "/faqs",
    icon: <FaQuestionCircle />,
    permissionReq: "read_faq",
  },
  {
    title: "Plans",
    path: "/plans",
    icon: <FaRegLightbulb />,
    permissionReq: "read_plan",
  },
  {
    title: "Coupons",
    path: "/coupons",
    icon: <RiCoupon3Line />,
    permissionReq: "read_coupon",
  },
  {
    title: "Banners",
    path: "/advertisements",
    icon: <RiAdvertisementFill />,
    permissionReq: "read_banner",
  },
  {
    title: "Permissions",
    path: "/permissions",
    icon: <BsShieldLock />,
    permissionReq: "read_permission",
  },
  {
    title: "Roles",
    path: "/roles",
    icon: <FaUsers />,
    permissionReq: "read_role",
  },
  {
    title: "Configurations",
    path: "/configurations",
    icon: <AiFillSetting />,
    permissionReq: "read_config",
  },
  {
    title: "Booking Slots",
    path: "/booking-slots",
    icon: <BsClock />,
    permissionReq: "read_bookingslot",
  },
  {
    title: "Cities",
    path: "/cities",
    icon: <GiModernCity />,
    permissionReq: "read_city",
  },
  {
    title: "Testimonials",
    path: "/testimonials",
    icon: <AiFillIdcard />,
    permissionReq: "read_testimonial",
  },
  {
    title: "Static Pages",
    path: "/static-pages",
    icon: <RiPagesLine />,
    permissionReq: "read_staticpage",
  },
];

const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <FaBoxes />,
    permissionReq: "read_booking",
  },
  {
    title: "Cart",
    path: "/cart",
    icon: <MdShoppingCart />,
    permissionReq: "read_booking",
  },
  {
    title: "Subscriptions",
    path: "/subscriptions",
    icon: <FaAddressCard />,
    permissionReq: "read_subscription",
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <FaMoneyCheck />,
    permissionReq: "read_transaction",
  },
  {
    title: "Issues",
    path: "/issues",
    icon: <GoIssueOpened />,
    permissionReq: "read_ticket",
  },
  {
    title: "Notification/Sms",
    path: "/push-notifications",
    icon: <RiNotification2Line />,
    permissionReq: "read_notification",
  },
];

const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);

  const closeNavBar = () => {
    if (isDesktop) return;
    if (setIsNavOpen) {
      setIsNavOpen(false);
    }
  };
  const desktopNavClose = () => {
    if (setIsNavOpen) {
      setIsNavOpen(!isNavOpen);
    }
  };

  return (
    <>
      <nav className={isNavOpen ? "active" : ""}>
        {isDesktop && (
          <div className="d-flex  justify-content-between align-items-center">
            <Logo />
            <FaArrowLeft
              onClick={desktopNavClose}
              // color={""}
              size={20}
              className="mr-2"
              style={{ cursor: "pointer", color: "#707070" }}
            />
          </div>
        )}

        <div className="all-links">
          <ul className="pt-4">
            <Navlink
              title="Dashboard"
              path="/dashboard"
              onClick={closeNavBar}
              icon={<RiDashboardFill />}
              isNavOpen={isNavOpen}
              permissionReq="read_dashboard"
            />
          </ul>

          <p className="text-muted mb-2">Main</p>
          <ul>
            {mainLinks.map(({ title, path, icon, permissionReq }) => (
              <Navlink
                path={path}
                title={title}
                key={title}
                onClick={closeNavBar}
                icon={icon}
                isNavOpen={isNavOpen}
                permissionReq={permissionReq}
              />
            ))}
          </ul>

          <p className="text-muted mb-2">Manage</p>
          <ul>
            {manageLinks.map(({ title, path, icon, permissionReq }) => (
              <Navlink
                path={path}
                title={title}
                key={title}
                onClick={closeNavBar}
                icon={icon}
                isNavOpen={isNavOpen}
                permissionReq={permissionReq}
              />
            ))}
          </ul>
        </div>
      </nav>
      {isNavOpen && !isDesktop && <Overlay onClick={closeNavBar} />}
    </>
  );
};

export default NavBar;
