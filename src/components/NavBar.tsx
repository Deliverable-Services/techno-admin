import { useContext, useState } from "react";
import {
  FaBoxes,
  FaDiceFour,
  FaQuestionCircle,
  FaRegLightbulb,
  FaMoneyCheck,
  FaUserSecret,
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
import Select from "react-select";
import { SiBrandfolder, SiCivicrm } from "react-icons/si";
import { MdShoppingCart } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { AiFillIdcard } from "react-icons/ai";
import { BsClock, BsShieldLock } from "react-icons/bs";
import { GrOrganization } from "react-icons/gr";

import { IsDesktopContext } from "../context/IsDesktopContext";
import { useGoogleBusinessConnection } from "../hooks/useGoogleBusinessConnection";
import { useGoogleAnalyticsConnection } from "../hooks/useGoogleAnalyticsConnection";
import { useOrganisation } from "../context/OrganisationContext";

import { INavBar, INavLink } from "../types/interface";

import Logo from "../shared-components/Logo";
import Navlink from "../shared-components/Navlink";
import Overlay from "../shared-components/Overlay";
import { handleApiError } from "../hooks/handleApiErrors";
import API from "../utils/API";
import { useHistory } from "react-router-dom";

// === Main Navigation Sections ===
// # TODO: Fix all the permissions and introduce the list in the permissions table
const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <FaBoxes />,
    permissionReq: "read_booking",
  },
  {
    title: "Leads",
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
        title: "Meetings",
        path: "/meetings",
        permissionReq: "read_booking",
        icon: <BsClock />,
      },
    ],
  },
  {
    title: "Billings",
    icon: <FaRegMoneyBillAlt />,
    path: "/invoices",
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Invoices",
        path: "/invoices",
        icon: <SiCivicrm />,
        permissionReq: "read_city",
      },
      {
        title: "Subscriptions",
        path: "/subscriptions",
        icon: <SiCivicrm />,
        permissionReq: "read_subscription",
      },
      {
        title: "Transactions",
        path: "/transactions",
        permissionReq: "read_transaction",
        icon: <FaMoneyCheck />,
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
    title: "Support Tickets",
    path: "/issues",
    icon: <GoIssueOpened />,
    permissionReq: "read_ticket",
  },
  {
    title: "Services",
    path: "/services",
    icon: <RiServiceFill />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Services",
        path: "/services",
        icon: <RiServiceFill />,
        permissionReq: "read_service",
      },
      {
        title: "Categories",
        path: "/categories",
        icon: <FaDiceFour />,
        permissionReq: "read_category",
      },
      {
        title: "Servicable Cities",
        path: "/cities",
        icon: <GiModernCity />,
        permissionReq: "read_city",
      },
    ],
  },
  {
    title: "Products",
    path: "/products",
    icon: <RiServiceFill />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Products",
        path: "/products",
        icon: <IoLogoModelS />,
        permissionReq: "read_brandmodel",
      },
      {
        title: "Brands",
        path: "/product-brands",
        icon: <SiBrandfolder />,
        permissionReq: "read_brand",
      },
      {
        title: "Variants",
        path: "/product-variants",
        icon: <IoLogoModelS />,
        permissionReq: "read_brandmodel",
      },
    ],
  },
  {
    title: "Plans",
    path: "/plans",
    icon: <FaRegLightbulb />,
    permissionReq: "read_plan",
  },
  {
    title: "Website",
    path: "/website-pages",
    icon: <RiGlobalLine />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Pages",
        path: "/website-pages",
        icon: <RiGlobalLine />,
        permissionReq: "read_staticpage",
      },
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
    ],
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
    title: "Workflow Notifications",
    path: "/notifications",
    icon: <RiNotification2Line />,
    permissionReq: "read_notification",
  },
];

const googleLinks: Array<INavLink> = [
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
];

// === Hidden Routes Logic ===

const hiddenRoutesForCRM = [
  "/orders",
  "/cart",
  "/plans",
  "/coupons",
  "/agent",
  "/agent-targets",
  "/products",
  "/product-brands",
  "/product-variants",
];
const hiddenRoutesForEcommerce = ["/crm", "/crm-bookings", "/services"];

const key = "organisations";

const NavBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const history = useHistory();
  const isDesktop = useContext(IsDesktopContext);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { selectedOrg, setSelectedOrg, organisations } = useOrganisation();
  const { isConnected: isGoogleBusinessConnected } =
    useGoogleBusinessConnection();
  const { isConnected: isGoogleAnalyticsConnected } =
    useGoogleAnalyticsConnection();

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
  const filteredOrganisationLinks = filterLinks(organisationLinks);

  const filteredGoogleLinks = googleLinks.filter((link) => {
    if (link.path === "/google-business" && !isGoogleBusinessConnected)
      return false;
    if (link.path === "/google-analytics" && !isGoogleAnalyticsConnected)
      return false;
    return storeType === "ecommerce"
      ? !hiddenRoutesForEcommerce.includes(link.path!)
      : !hiddenRoutesForCRM.includes(link.path!);
  });

  const handleSetSelectedOrg = async (option) => {
    const org = organisations.find((o) => o.id === option.value);
    if (org) {
      try {
        await API.post(`${key}/${org.id}/switch`);
      } catch (error) {
        handleApiError(error, history);
      }
      setSelectedOrg(org);
    }
  };

  const organisationOptions = organisations.map((org) => ({
    value: org.id,
    label: org.name,
    ...org,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "8px 12px",
      fontSize: "14px",
    }),
  };

  return (
    <>
      <nav className={isNavOpen ? "active pb-0" : ""}>
        {isDesktop && (
          <div className="d-flex justify-content-between align-items-center">
            <Logo />
          </div>
        )}

        <div className="all-links scrollbarCustom">
          {/* Organisation Dropdown */}
          <div>
            <section
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "#667085",
                marginBottom: "4px",
              }}
              className="pt-3"
            >
              Organisation
            </section>
            <Select
              options={organisationOptions}
              value={
                selectedOrg
                  ? {
                    value: selectedOrg.id,
                    label: selectedOrg.name,
                  }
                  : null
              }
              onChange={handleSetSelectedOrg}
              placeholder="Select Organisation"
              isClearable={false}
              styles={customStyles}
              className="input-div"
            />
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
          <p className="text-muted mb-2">MAIN</p>
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
          <p className="text-muted mb-2">CONFIGURATIONS</p>
          <ul>
            {filteredOrganisationLinks.map((link) => (
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

          {filteredGoogleLinks.length > 0 && (
            <>
              <p className="text-muted mb-2">Integrations</p>
              <ul>
                {filteredGoogleLinks.map((link) => (
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
            </>
          )}
        </div>
      </nav>
      {isNavOpen && !isDesktop && <Overlay onClick={closeNavBar} />}
    </>
  );
};

export default NavBar;
