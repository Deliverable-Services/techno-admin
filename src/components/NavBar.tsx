import React, { useContext, useEffect, useState } from "react";
import {
  FaAddressCard,
  FaBoxes,
  FaDiceFour,
  FaQuestionCircle,
  FaRegLightbulb,
  FaMoneyCheck,
  FaUserSecret,
  FaEnvelope,
  FaPhone,
  FaMap,
  FaClock,
  FaGoogle,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { GoIssueOpened } from "react-icons/go";
import { IoLogoModelS } from "react-icons/io";
import { GiModernCity, GiOnTarget } from "react-icons/gi";

import {
  RiAdminFill,
  RiAdvertisementFill,
  RiCoupon3Line,
  RiDashboardFill,
  RiGlobalLine,
  RiNotification2Line,
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

import useUserProfileStore from "../hooks/useUserProfileStore";
import { useGoogleBusinessConnection } from "../hooks/useGoogleBusinessConnection";
import { Dropdown } from "react-bootstrap";
import { useOrganisation } from "../context/OrganisationContext";
import { formatTimestamp } from "../utils/utitlity";

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
    permissionReq: "read_booking",
    icon: <BsClock />,
  },
  {
    title: "Billings",
    icon: <FaRegMoneyBillAlt />,
    permissionReq: "read_bookingslot",
    children: [
      { title: "Subscriptions", path: "/subscriptions", permissionReq: "read_subscription", icon: <FaAddressCard />, },
      { title: "Transaction", path: "/transactions", permissionReq: "read_transaction", icon: <FaMoneyCheck />, },
      { title: "Invoices", path: "/invoices", icon: <SiCivicrm />, permissionReq: "read_city", },
    ],
  },
  {
    title: "Cart",
    path: "/cart",
    icon: <MdShoppingCart />,
    permissionReq: "read_booking",
  },

  {
    title: "Customers",
    path: "/users",
    icon: <ImUsers />,
    permissionReq: "read_user",
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
    title: "Google Analytics",
    path: "/google-analytics",
    icon: <DiGoogleAnalytics />,
    permissionReq: "read_agenttarget",
  },
  {
    title: "Roles & Permissions",
    path: "/permissions",
    icon: <BsShieldLock />,
    permissionReq: "read_permission",
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

const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const loggedInUser = useUserProfileStore((state) => state.user);
  const { setOrganisations, selectedOrg, setSelectedOrg } = useOrganisation();
  const {
    isConnected: isGoogleBusinessConnected,
    isLoading: isCheckingConnection,
  } = useGoogleBusinessConnection();

  const closeNavBar = () => {
    if (isDesktop) return;
    if (setIsNavOpen) {
      setIsNavOpen(false);
    }
  };

  // Google Business link - only show when connected
  const googleBusinessLink: INavLink = {
    title: "Google Business",
    path: "/google-business",
    icon: <FaGoogle />,
    permissionReq: "read_dashboard",
  };

  // Filtered links for sidebar
  let filteredMainLinks = mainLinks.filter((link) => {
    if (selectedOrg?.store_type.toLowerCase() === "ecommerce") {
      return hiddenRoutesForEcommerce.includes(link.path) ? false : true;
    } else if (selectedOrg?.store_type.toLowerCase() === "crm") {
      return hiddenRoutesForCRM.includes(link.path) ? false : true;
    }
  });

  // Add Google Business link if connected
  if (isGoogleBusinessConnected) {
    filteredMainLinks = [...filteredMainLinks, googleBusinessLink];
  }

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

  return (
    <>
      <nav className={isNavOpen ? "active pb-0" : ""}>
        {isDesktop && (
          <div className="d-flex  justify-content-between align-items-center">
            <Logo />
          </div>
        )}

        <div className="all-links">
          <div className="d-flex align-items-center justify-content-center">
            <Dropdown className="w-100 pt-3" style={{ position: "unset" }}>
              <section
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "#667085",
                  marginBottom: "4px",
                }}
              >
                Organisation
              </section>

              <Dropdown.Toggle
                id="dropdown-basic"
                className="bg-white w-100 border px-3 py-1 shadow-sm d-flex align-items-center btn-focus-none"
                style={{
                  color: "#000",
                  fontWeight: "500",
                  fontSize: "14px",
                  borderRadius: "6px",
                }}
              >
                <span
                  className="text-truncate"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  {selectedOrg?.name}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu
                className=" rounded border-0 mt-2  global-card"
                style={{ minWidth: "260px" }}
              >
                <div className="d-flex flex-column gap-2">
                  <section className="d-flex align-items-center py-2 px-4 border-bottom">
                    <FaEnvelope className="text-primary mr-2" size={14} />
                    <span>{selectedOrg?.email}</span>
                  </section>
                  <section className="d-flex align-items-center py-2 px-4 border-bottom">
                    <FaPhone className="text-primary mr-2" size={14} />
                    <span>{selectedOrg?.phone}</span>
                  </section>
                  <section className="d-flex align-items-center py-2 px-4 border-bottom">
                    <FaMap className="text-primary mr-2" size={14} />
                    <span>{selectedOrg?.address}</span>
                  </section>
                  <section className="d-flex align-items-center py-2 px-4 ">
                    <FaClock className="text-primary mr-2" size={14} />
                    <span>{formatTimestamp(selectedOrg?.created_at)}</span>
                  </section>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <ul className="pt-3">
            <Navlink
              title="Dashboard"
              path="/dashboard"
              onClick={closeNavBar}
              icon={<RiDashboardFill />}
              isNavOpen={isNavOpen}
              permissionReq="read_dashboard"
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          </ul>
          <p className="text-muted mb-2">Leads & Customers</p>
          <ul>
            {filteredMainLinks.map((link) => (
              <Navlink
                key={link.title}
                {...link}
                onClick={closeNavBar}
                isNavOpen={isNavOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
            ))}
          </ul>
          <p className="text-muted mb-2">Products & Services</p>
          <ul>
            {filterinventoryLinks.map(
              (link) => (
                <Navlink
                  key={link.title}
                  {...link}
                  onClick={closeNavBar}
                  isNavOpen={isNavOpen}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                />
              )
            )}
          </ul>
          <p className="text-muted mb-2">Website & Pages</p>
          <ul>
            {filteredWebsiteinks.map((link) => (
              <Navlink
                key={link.title}
                {...link}
                onClick={closeNavBar}
                isNavOpen={isNavOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
            ))}
          </ul>
          <p className="text-muted mb-2">Organization & Settings</p>
          <ul>
            {filterOrganisationLinks.map(
              (link) => (
                <Navlink
                  key={link.title}
                  {...link}
                  onClick={closeNavBar}
                  isNavOpen={isNavOpen}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                />
              )
            )}
          </ul>
        </div>
      </nav>
      {isNavOpen && !isDesktop && <Overlay onClick={closeNavBar} />}
    </>
  );
};

export default NavBar;
