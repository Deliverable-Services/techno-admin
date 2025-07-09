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
  FaUsersCog,
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
import { SiCivicrm } from "react-icons/si";

import { GrDocumentConfig } from "react-icons/gr";
import { primaryColor } from "../utils/constants";
import useUserProfileStore from "../hooks/useUserProfileStore";

const manageLinks: Array<INavLink> = [
  {
    title: "Products",
    path: "/products",
    icon: <IoLogoModelS />,
    permissionReq: "read_brandmodel",
  },
  {
    title: "Product Brands",
    path: "/product-brands",
    icon: <SiBrandfolder />,
    permissionReq: "read_brand",
  },
  {
    title: "Product Types",
    path: "/product-types",
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
    title: "Team Members",
    path: "/team-members",
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
  // {
  //   title: "CMS",
  //   path: "/cms",
  //   icon: <FaQuestionCircle />,
  //   permissionReq: "read_faq",
  // },
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
    title: "Cities",
    path: "/cities",
    icon: <GiModernCity />,
    permissionReq: "read_city",
  },

];

const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <FaBoxes />,
    permissionReq: "read_booking",
  },
  // {
  //   title: "CRM",
  //   path: "/crm",
  //   icon: <FaUsersCog />,
  //   permissionReq: "read_booking",
  // },
    {
    title: "CRM",
    path: "/new-crm",
    icon: <SiCivicrm />,
    permissionReq: "read_city",
  },
  {
    title: "CRM Bookings",
    path: "/crm-bookings",
    icon: <BsClock />,
    permissionReq: "read_bookingslot",
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

const hiddenRoutesForCRM = ["/orders", "/cart", "/plans", "/coupons", "/agent", "/agent-targets", "/cities"];
const hiddenRoutesForEcommerce = [ "/crm", "/crm-bookings", "/services", "/products", "/product-brands", "/product-types", "/categories"];

const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);
  const loggedInUser = useUserProfileStore((state) => state.user);
  
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
  
  if (loggedInUser) loggedInUser.storeType= "crm"; // to be removed later [added for testing purpose]

  // Filtered links for sidebar
  const filteredMainLinks = mainLinks.filter(link => {
    if (loggedInUser?.storeType === 'ecommerce') {
      return hiddenRoutesForEcommerce.includes(link.path) ? false : true;
    }else if (loggedInUser?.storeType === 'crm') {
      return hiddenRoutesForCRM.includes(link.path) ? false : true;
    }
  });

  const filteredManageLinks = manageLinks.filter(link => {
    if (loggedInUser?.storeType === 'ecommerce') {
      return hiddenRoutesForEcommerce.includes(link.path) ? false : true;
    }else if (loggedInUser?.storeType === 'crm') {
      return hiddenRoutesForCRM.includes(link.path) ? false : true;
    }
  });

  console.log({filteredMainLinks})
  console.log({filteredManageLinks})
  
  return (
    <>
      <nav className={isNavOpen ? "active" : ""}>
        {isDesktop && (
          <div className="d-flex  justify-content-between align-items-center">
            <Logo />
            {/* <FaArrowLeft
              onClick={desktopNavClose}
              // color={""}
              size={20}
              className="mr-2"
              style={{ cursor: "pointer", color: "#707070" }}
            /> */}
            <svg 
              className="mr-3 w-20 bi bi-arrow-bar-left"
              style={{ cursor: "pointer", color: "#181d27", width:"25px", height:"25px", marginRight:"5px" }}  onClick={desktopNavClose} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"/>
            </svg>
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
            {filteredMainLinks.map(({ title, path, icon, permissionReq }) => (
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
            {filteredManageLinks.map(({ title, path, icon, permissionReq }) => (
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
