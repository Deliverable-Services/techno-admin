import { useContext, useState } from "react";
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
import { IoLogoModelS, IoMdAnalytics } from "react-icons/io";
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
import { SiBrandfolder, SiCivicrm } from "react-icons/si";
import { MdShoppingCart } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { AiFillIdcard } from "react-icons/ai";
import { BsClock, BsShieldLock } from "react-icons/bs";
import { GrOrganization } from "react-icons/gr";

import { Dropdown } from "react-bootstrap";
import { IsDesktopContext } from "../context/IsDesktopContext";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { useGoogleBusinessConnection } from "../hooks/useGoogleBusinessConnection";
import { useOrganisation } from "../context/OrganisationContext";

import { INavBar, INavLink } from "../types/interface";
import { formatTimestamp } from "../utils/utitlity";

import Logo from "../shared-components/Logo";
import Navlink from "../shared-components/Navlink";
import Overlay from "../shared-components/Overlay";

// === Main Navigation Sections ===

const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <FaBoxes />,
    permissionReq: "read_booking",
  },
  {
    title: "CRM",
    icon: <SiCivicrm />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "CRM",
        path: "/crm",
        permissionReq: "read_subscription",
        icon: <SiCivicrm />,
      },
      {
        title: "Bookings",
        path: "/crm-bookings",
        permissionReq: "read_booking",
        icon: <BsClock />,
      }
    ],
  },
  {
    title: "Billings",
    icon: <FaRegMoneyBillAlt />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Subscriptions",
        path: "/subscriptions",
        permissionReq: "read_subscription",
        icon: <FaAddressCard />,
      },

      {
        title: "Transaction",
        path: "/transactions",
        permissionReq: "read_transaction",
        icon: <FaMoneyCheck />,
      },
      {
        title: "Invoices",
        path: "/invoices",
        icon: <SiCivicrm />,
        permissionReq: "read_city",
      },
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
    title: "Workflow Notifications",
    path: "/notifications",
    icon: <RiNotification2Line />,
    permissionReq: "read_notification",
  },
];

const googleLinks: Array<INavLink> = [



  {
    title: "Google Analytics",
    icon: <FaGoogle />,
    permissionReq: "read_agenttarget",
    children: [
      {
        title: "Google Analytics",
        path: "/google-analytics",
        permissionReq: "read_agenttarget",
        icon: <IoMdAnalytics />,
      },
      {
        title: "Google Business",
        path: "/google-business",
        icon: <FaGoogle />,
        permissionReq: "read_dashboard",
      },
    ],
  },
];

// === Hidden Routes Logic ===

const hiddenRoutesForCRM = [
  "/orders", "/cart", "/plans", "/coupons", "/agent", "/agent-targets",
  "/products", "/product-brands", "/product-variants",
];
const hiddenRoutesForEcommerce = [
  "/crm", "/crm-bookings", "/services",
];

const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const loggedInUser = useUserProfileStore((state) => state.user);
  const { selectedOrg } = useOrganisation();
  const {
    isConnected: isGoogleBusinessConnected,
  } = useGoogleBusinessConnection();

  const closeNavBar = () => {
    if (!isDesktop && setIsNavOpen) setIsNavOpen(false);
  };

  const storeType = selectedOrg?.store_type.toLowerCase();

  const filterLinks = (links: INavLink[]) =>
    links.filter((link) =>
      storeType === "ecommerce"
        ? !hiddenRoutesForEcommerce.includes(link.path!)
        : !hiddenRoutesForCRM.includes(link.path!)
    );

  const filteredMainLinks = filterLinks(mainLinks);
  const filteredWebsiteLinks = filterLinks(websiteLinks);
  const filteredInventoryLinks = filterLinks(inventoryLinks);
  const filteredOrganisationLinks = filterLinks(organisationLinks);

  const filteredGoogleLinks = googleLinks.filter((link) => {
    if (link.path === "/google-business" && !isGoogleBusinessConnected) return false;
    return storeType === "ecommerce"
      ? !hiddenRoutesForEcommerce.includes(link.path!)
      : !hiddenRoutesForCRM.includes(link.path!);
  });

  return (
    <>
      <nav className={isNavOpen ? "active pb-0" : ""}>
        {isDesktop && (
          <div className="d-flex justify-content-between align-items-center">
            <Logo />
          </div>
        )}

        <div className="all-links">
          {/* Organisation Dropdown */}
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

              <Dropdown.Menu className="rounded border-0 mt-2 global-card" style={{ minWidth: "260px" }}>
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
                  <section className="d-flex align-items-center py-2 px-4">
                    <FaClock className="text-primary mr-2" size={14} />
                    <span>{formatTimestamp(selectedOrg?.created_at)}</span>
                  </section>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Dashboard */}
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

          {/* Sections */}
          <p className="text-muted mb-2">Leads & Customers</p>
          <ul>
            {filteredMainLinks.map((link) => (
              <Navlink key={link.title} {...link} onClick={closeNavBar} isNavOpen={isNavOpen} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            ))}
          </ul>

          <p className="text-muted mb-2">Products & Services</p>
          <ul>
            {filteredInventoryLinks.map((link) => (
              <Navlink key={link.title} {...link} onClick={closeNavBar} isNavOpen={isNavOpen} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            ))}
          </ul>

          <p className="text-muted mb-2">Website & Pages</p>
          <ul>
            {filteredWebsiteLinks.map((link) => (
              <Navlink key={link.title} {...link} onClick={closeNavBar} isNavOpen={isNavOpen} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            ))}
          </ul>

          <p className="text-muted mb-2">Organization & Settings</p>
          <ul>
            {filteredOrganisationLinks.map((link) => (
              <Navlink key={link.title} {...link} onClick={closeNavBar} isNavOpen={isNavOpen} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            ))}
          </ul>

          {filteredGoogleLinks.length > 0 && (
            <>
              <p className="text-muted mb-2">Intigrations</p>
              <ul>
                {filteredGoogleLinks.map((link) => (
                  <Navlink key={link.title} {...link} onClick={closeNavBar} isNavOpen={isNavOpen} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                ))}
              </ul>
            </>
          )}
        </div>
      </nav>
      {isNavOpen && !isDesktop && <Overlay onClick={closeNavBar} />}
    </>
  );
};

export default NavBar;
