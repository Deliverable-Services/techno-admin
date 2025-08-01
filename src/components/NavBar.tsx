import { useContext, useEffect } from "react";
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
import { FaUserCog } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import {
  RiAdminFill,
  RiAdvertisementFill,
  RiCoupon3Line,
  RiDashboardFill,
  RiGlobalLine,
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
import { GrOrganization } from "react-icons/gr";
import profile from "../assets/profile.svg";

import { GrDocumentConfig } from "react-icons/gr";
import { primaryColor } from "../utils/constants";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { Dropdown } from "react-bootstrap";
import { useMutation } from "react-query";
import useTokenStore from "../hooks/useTokenStore";
import API from "../utils/API";
import { useOrganisation } from "../context/OrganisationContext";

const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <FaBoxes />,
    permissionReq: "read_booking",
  },
  {
    title: "CRM",
    path: "/crm",
    icon: <SiCivicrm />,
    permissionReq: "read_city",
  },
  {
    title: "Bookings",
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
    title: "Invoices",
    path: "/invoices",
    icon: <SiCivicrm />,
    permissionReq: "read_city",
  },
  {
    title: "Customers",
    path: "/users",
    icon: <ImUsers />,
    permissionReq: "read_user",
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
    title: "Help Center",
    path: "/issues",
    icon: <GoIssueOpened />,
    permissionReq: "read_ticket",
  },
];

const websiteLinks: Array<INavLink> = [
  {
    title: "Faqs",
    path: "/faqs",
    icon: <FaQuestionCircle />,
    permissionReq: "read_faq",
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
    title: "Testimonials",
    path: "/testimonials",
    icon: <AiFillIdcard />,
    permissionReq: "read_testimonial",
  },
  // {
  //   title: "Static Pages",
  //   path: "/static-pages",
  //   icon: <RiPagesLine />,
  //   permissionReq: "read_staticpage",
  // },
  // {
  //   title: "Website",
  //   path: "/website",
  //   icon: <RiGlobalLine />,
  //   permissionReq: "read_staticpage",
  // },
  {
    title: "Website Pages",
    path: "/website-pages",
    icon: <RiGlobalLine />,
    permissionReq: "read_staticpage",
  },
];

const inventoryLinks: Array<INavLink> = [
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
    title: "Product Variants",
    path: "/product-variants",
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
    title: "Services",
    path: "/services",
    icon: <RiServiceFill />,
    permissionReq: "read_service",
  },
  {
    title: "Plans",
    path: "/plans",
    icon: <FaRegLightbulb />,
    permissionReq: "read_plan",
  },
];

const organisationLinks: Array<INavLink> = [
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
    title: "Roles & Permissions",
    path: "/permissions",
    icon: <BsShieldLock />,
    permissionReq: "read_permission",
  },
  {
    title: "Configurations",
    path: "/configurations",
    icon: <AiFillSetting />,
    permissionReq: "read_config",
  },

  {
    title: "Organization",
    path: "/organization",
    icon: <GrOrganization />,
    permissionReq: "read_city",
  },
  {
    title: "Cities",
    path: "/cities",
    icon: <GiModernCity />,
    permissionReq: "read_city",
  },
  {
    title: "Notification/Sms",
    path: "/push-notifications",
    icon: <RiNotification2Line />,
    permissionReq: "read_notification",
  },
];

const hiddenRoutesForCRM = [
  "/orders",
  "/cart",
  "/plans",
  "/coupons",
  "/agent",
  "/agent-targets",
  "/cities",
  "/product-variants",
];
const hiddenRoutesForEcommerce = [
  "/crm",
  "/crm-bookings",
  "/services",
  "/products",
  "/product-brands",
  "/categories",
];
const logout = () => {
  return API.post("/auth/logout");
};

const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);
  const loggedInUser = useUserProfileStore((state) => state.user);
  const removeToken = useTokenStore((state) => state.removeToken);
  const removeUser = useUserProfileStore((state) => state.removeUser);
  const user = useUserProfileStore((state) => state.user);
  const { organisations, setOrganisations, selectedOrg, setSelectedOrg } =
    useOrganisation();

  useEffect(() => {
    const handleSetOrganisations = (orgs: any) => {
      setOrganisations(orgs);

      // set default org if not selected
      if (!selectedOrg && orgs.length) {
        const stored = localStorage.getItem("selectedOrganisation");
        if (!stored) {
          setSelectedOrg(orgs[0]);
        }
      }
    };
    if (loggedInUser) handleSetOrganisations(loggedInUser.organisations);
  }, []);

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
  // if (selectedOrg && !selectedOrg?.hasOwnProperty("store_type"))
  //   selectedOrg.store_type = "crm"; // setting default to CRM if no organisation found

  // Filtered links for sidebar
  const filteredMainLinks = mainLinks.filter((link) => {
    if (selectedOrg?.store_type.toLowerCase() === "ecommerce") {
      return hiddenRoutesForEcommerce.includes(link.path) ? false : true;
    } else if (selectedOrg?.store_type.toLowerCase() === "crm") {
      return hiddenRoutesForCRM.includes(link.path) ? false : true;
    }
  });

  const filteredWebsiteinks = websiteLinks.filter((link) => {
    if (selectedOrg?.store_type.toLowerCase() === "ecommerce") {
      return hiddenRoutesForEcommerce.includes(link.path) ? false : true;
    } else if (selectedOrg?.store_type.toLowerCase() === "crm") {
      return hiddenRoutesForCRM.includes(link.path) ? false : true;
    }
  });

  const filterinventoryLinks = inventoryLinks.filter((link) => {
    if (selectedOrg?.store_type.toLowerCase() === "ecommerce") {
      return hiddenRoutesForEcommerce.includes(link.path) ? false : true;
    } else if (selectedOrg?.store_type.toLowerCase() === "crm") {
      return hiddenRoutesForCRM.includes(link.path) ? false : true;
    }
  });

  const filterOrganisationLinks = organisationLinks.filter((link) => {
    if (selectedOrg?.store_type.toLowerCase() === "ecommerce") {
      return hiddenRoutesForEcommerce.includes(link.path) ? false : true;
    } else if (selectedOrg?.store_type.toLowerCase() === "crm") {
      return hiddenRoutesForCRM.includes(link.path) ? false : true;
    }
  });

  const { mutate, isLoading } = useMutation(logout, {
    onSuccess: () => {
      removeUser();
      removeToken();
      window.location.href = "/login";
    },
    onError: () => {
      removeUser();
      removeToken();
      window.location.href = "/login";
    },
  });

  return (
    <>
      <nav className={isNavOpen ? "active pb-0" : ""}>
        {isDesktop && (
          <div className="d-flex  justify-content-between align-items-center">
            <Logo />
            <div className="collapse-svg">
              <svg
                className="mr-3 w-20 bi bi-arrow-bar-left"
                style={{
                  cursor: "pointer",
                  color: "#181d27",
                  width: "25px",
                  height: "25px",
                  marginRight: "5px",
                }}
                onClick={desktopNavClose}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"
                />
              </svg>
            </div>
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
          <p className="text-muted mb-2">Leads & Customers</p>
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
          <p className="text-muted mb-2">Products & Services</p>
          <ul>
            {filterinventoryLinks.map(
              ({ title, path, icon, permissionReq }) => (
                <Navlink
                  path={path}
                  title={title}
                  key={title}
                  onClick={closeNavBar}
                  icon={icon}
                  isNavOpen={isNavOpen}
                  permissionReq={permissionReq}
                />
              )
            )}
          </ul>
          <p className="text-muted mb-2">Website & Pages</p>
          <ul>
            {filteredWebsiteinks.map(({ title, path, icon, permissionReq }) => (
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
          <p className="text-muted mb-2">Organization & Settings</p>
          <ul>
            {filterOrganisationLinks.map(
              ({ title, path, icon, permissionReq }) => (
                <Navlink
                  path={path}
                  title={title}
                  key={title}
                  onClick={closeNavBar}
                  icon={icon}
                  isNavOpen={isNavOpen}
                  permissionReq={permissionReq}
                />
              )
            )}
          </ul>
        </div>
        <div
          className="top-bar d-flex align-items-center user-dd"
          style={{
            borderTop: "1px solid #E0E0E0",
            borderBottom: "0",
            bottom: "0",
            top: "unset",
            padding: "0 20px",
          }}
        >
          <Dropdown
            className="global-card w-100"
            style={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow:
                "0px 15px 32px 0px #0000000D, 0px 59px 59px 0px #0000000A, 0px 132px 79px 0px #00000008, 0px 234px 94px 0px #00000003, 0px 366px 103px 0px #00000000",
              padding: "12px 20px",
            }}
          >
            <Dropdown.Toggle
              id="dropdown-basic"
              className="d-flex align-items-center filter-button bg-transparent border-0 p-0"
              style={{ color: "#000" }}
            >
              {isLoading ? (
                "Loading"
              ) : (
                <img src={profile} alt="profile" className="profile" />
              )}
              {user && <p className="text-muted small mb-0">{user?.name}</p>}
            </Dropdown.Toggle>

            <Dropdown.Menu className="global-card">
              {/* <Dropdown.Item href="/profile" className="border-bottom ">
                {" "}
                <FaUserCog className="mr-3" />
                Profile
              </Dropdown.Item> */}
              <Dropdown.Item onClick={() => mutate()}>
                <BiLogOut className="mr-3" />{" "}
                {isLoading ? "Loading" : "Log out"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>
      {isNavOpen && !isDesktop && <Overlay onClick={closeNavBar} />}
    </>
  );
};

export default NavBar;
