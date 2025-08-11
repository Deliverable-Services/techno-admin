import { useContext, useState } from "react";
import OrganizationSwitcher from "./OrganizationSwitcher";
import { IsDesktopContext } from "../context/IsDesktopContext";
import { useGoogleBusinessConnection } from "./Integrations/useGoogleBusinessConnection";
import { useGoogleAnalyticsConnection } from "./Integrations/useGoogleAnalyticsConnection";
import { useOrganisation } from "../context/OrganisationContext";
import { INavBar, INavLink } from "../types/interface";
import Logo from "../shared-components/Logo";
import Navlink from "../shared-components/Navlink";
import Overlay from "../shared-components/Overlay";
import { handleApiError } from "../hooks/handleApiErrors";
import API from "../utils/API";
import { useHistory } from "react-router-dom";
import { Hammer } from "./ui/icon";
import { Triangle, Clock, LayoutGrid, Rotate3d, LetterText, Building, BellRing, UserStar, ShieldCheck, CircleQuestionMark, Banknote, ReceiptText, UserRoundPlus, CreditCard, Users, CircleAlert, HeartPulse, VectorSquare, Building2, Globe, Ticket, Image } from 'lucide-react';


// === Main Navigation Sections ===
// # TODO: Fix all the permissions and introduce the list in the permissions table
const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <Hammer />,
    permissionReq: "read_booking",
  },
  {
    title: "Leads",
    icon: <Triangle />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "CRM",
        path: "/crm",
        permissionReq: "read_subscription",
        icon: <Triangle />,
      },
      {
        title: "Meetings",
        path: "/meetings",
        permissionReq: "read_booking",
        icon: <Clock />,
      },
    ],
  },
  {
    title: "Billings",
    icon: <Banknote />,
    path: "/invoices",
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Invoices",
        path: "/invoices",
        icon: <ReceiptText />,
        permissionReq: "read_city",
      },
      {
        title: "Subscriptions",
        path: "/subscriptions",
        icon: <UserRoundPlus />,
        permissionReq: "read_subscription",
      },
      {
        title: "Transactions",
        path: "/transactions",
        permissionReq: "read_transaction",
        icon: <CreditCard />,
      },
    ],
  },
  {
    title: "Cart",
    path: "/cart",
    icon: <Hammer />,
    permissionReq: "read_booking",
  },
  {
    title: "Customers",
    path: "/users",
    icon: <Users />,
    permissionReq: "read_user",
  },
  {
    title: "Support Tickets",
    path: "/issues",
    icon: <CircleAlert />,
    permissionReq: "read_ticket",
  },
  {
    title: "Services",
    path: "/services",
    icon: <HeartPulse />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Services",
        path: "/services",
        icon: <HeartPulse />,
        permissionReq: "read_service",
      },
      {
        title: "Categories",
        path: "/categories",
        icon: <VectorSquare />,
        permissionReq: "read_category",
      },
      {
        title: "Servicable Cities",
        path: "/cities",
        icon: <Building2 />,
        permissionReq: "read_city",
      },
    ],
  },
  {
    title: "Products",
    path: "/products",
    icon: <Hammer />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Products",
        path: "/products",
        icon: <Hammer />,
        permissionReq: "read_brandmodel",
      },
      {
        title: "Brands",
        path: "/product-brands",
        icon: <Hammer />,
        permissionReq: "read_brand",
      },
      {
        title: "Variants",
        path: "/product-variants",
        icon: <Hammer />,
        permissionReq: "read_brandmodel",
      },
    ],
  },
  {
    title: "Plans",
    path: "/plans",
    icon: <Hammer />,
    permissionReq: "read_plan",
  },
  {
    title: "Website",
    path: "/website-pages",
    icon: <Globe />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Pages",
        path: "/website-pages",
        icon: <Globe />,
        permissionReq: "read_staticpage",
      },
      {
        title: "Faqs",
        path: "/faqs",
        icon: <CircleQuestionMark />,
        permissionReq: "read_faq",
      },
      {
        title: "Coupons",
        path: "/coupons",
        icon: <Ticket />,
        permissionReq: "read_coupon",
      },
      {
        title: "Banners",
        path: "/advertisements",
        icon: <Image />,
        permissionReq: "read_banner",
      },
      {
        title: "Testimonials",
        path: "/testimonials",
        icon: <LetterText />,
        permissionReq: "read_testimonial",
      },
    ],
  },
];

const organisationLinks: Array<INavLink> = [
  {
    title: "Team Members",
    path: "/team-members",
    icon: <UserStar />,
    permissionReq: "read_user",
  },
  {
    title: "Agents",
    path: "/agent",
    icon: <Hammer />,
    permissionReq: "read_user",
  },
  {
    title: "Agent Targets",
    path: "/agent-targets",
    icon: <Hammer />,
    permissionReq: "read_agenttarget",
  },
  {
    title: "Roles & Permissions",
    path: "/permissions",
    icon: <ShieldCheck />,
    permissionReq: "read_permission",
  },
  {
    title: "Organization",
    path: "/organization",
    icon: <Building />,
    permissionReq: "read_city",
  },
  {
    title: "Workflow Notifications",
    path: "/notifications",
    icon: <BellRing />,
    permissionReq: "read_notification",
  },
];

const googleLinks: Array<INavLink> = [
  {
    title: "Integrations",
    path: "/enable-integrations",
    permissionReq: "read_notification",
    icon: <Rotate3d />,
  },
  {
    title: "Google Analytics",
    path: "/google-analytics",
    permissionReq: "read_agenttarget",
    icon: <Hammer />,
  },
  {
    title: "Google Business",
    path: "/google-business",
    icon: <Hammer />,
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

  const { selectedOrg, setSelectedOrg, organisations, switchOrganisation } =
    useOrganisation();
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

  const handleSetSelectedOrg = async (org) => {
    try {
      await API.post(`${key}/${org.id}/switch`);
    } catch (error) {
      handleApiError(error, history);
    }
    await switchOrganisation(org);
  };

  return (
    <>
      <nav className={`flex flex-col justify-start overflow-auto py-4 px-0 z-10 top-0 left-0 bottom-0 h-screen bg-sidebar transition-all duration-300 ease-in-out ${isNavOpen ? "active pb-0" : ""}`}>
        {isDesktop && (
          <div className="flex justify-between items-center">
            <Logo />
          </div>
        )}

        <div className="all-links px-4 overflow-auto mt-2">
          <OrganizationSwitcher
            organisations={organisations}
            selectedOrg={selectedOrg}
            onSelect={handleSetSelectedOrg}
          />

          {/* Dashboard */}
          <ul className="pt-4 mb-4">
            <Navlink
              title="Dashboard"
              path="/dashboard"
              onClick={closeNavBar}
              icon={<LayoutGrid />}
              isNavOpen={isNavOpen}
              permissionReq="read_dashboard"
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          </ul>

          {/* Sections */}
          <p className="text-muted mb-2">MAIN</p>
          <ul className="mb-4">
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
          <ul className="mb-4">
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
              <ul className="mb-4">
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
