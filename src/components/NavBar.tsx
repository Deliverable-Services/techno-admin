// NavBar.tsx

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
import {
  Triangle,
  Clock,
  Target,
  PackageSearch,
  HatGlasses,
  Lightbulb,
  SwatchBook,
  Tag,
  LayoutGrid,
  ShoppingCart,
  Boxes,
  Rotate3d,
  LetterText,
  Building,
  BellRing,
  UserStar,
  ShieldCheck,
  CircleQuestionMark,
  Banknote,
  ReceiptText,
  UserRoundPlus,
  CreditCard,
  Users,
  CircleAlert,
  HeartPulse,
  VectorSquare,
  Building2,
  Globe,
  Ticket,
  Image,
} from "lucide-react";

// === Main Navigation Sections ===
const mainLinks: Array<INavLink> = [
  {
    title: "Orders",
    path: "/orders",
    icon: <Boxes className="w-4 h-4" />,
    permissionReq: "read_booking",
  },
  {
    title: "Leads",
    icon: <Triangle className="w-4 h-4" />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "CRM",
        path: "/crm",
        permissionReq: "read_subscription",
        icon: <Triangle className="w-4 h-4" />,
      },
      {
        title: "Meetings",
        path: "/meetings",
        permissionReq: "read_booking",
        icon: <Clock className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Billings",
    icon: <Banknote className="w-4 h-4" />,
    path: "/invoices",
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Invoices",
        path: "/invoices",
        icon: <ReceiptText className="w-4 h-4" />,
        permissionReq: "read_city",
      },
      {
        title: "Subscriptions",
        path: "/subscriptions",
        icon: <UserRoundPlus className="w-4 h-4" />,
        permissionReq: "read_subscription",
      },
      {
        title: "Transactions",
        path: "/transactions",
        permissionReq: "read_transaction",
        icon: <CreditCard className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Cart",
    path: "/cart",
    icon: <ShoppingCart className="w-4 h-4" />,
    permissionReq: "read_booking",
  },
  {
    title: "Customers",
    path: "/users",
    icon: <Users className="w-4 h-4" />,
    permissionReq: "read_user",
  },
  {
    title: "Support Tickets",
    path: "/issues",
    icon: <CircleAlert className="w-4 h-4" />,
    permissionReq: "read_ticket",
  },
  {
    title: "Services",
    path: "/services",
    icon: <HeartPulse className="w-4 h-4" />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Services",
        path: "/services",
        icon: <HeartPulse className="w-4 h-4" />,
        permissionReq: "read_service",
      },
      {
        title: "Categories",
        path: "/categories",
        icon: <VectorSquare className="w-4 h-4" />,
        permissionReq: "read_category",
      },
      {
        title: "Servicable Cities",
        path: "/cities",
        icon: <Building2 className="w-4 h-4" />,
        permissionReq: "read_city",
      },
    ],
  },
  {
    title: "Products",
    path: "/products",
    icon: <PackageSearch className="w-4 h-4" />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Products",
        path: "/products",
        icon: <PackageSearch className="w-4 h-4" />,
        permissionReq: "read_brandmodel",
      },
      {
        title: "Brands",
        path: "/product-brands",
        icon: <Tag className="w-4 h-4" />,
        permissionReq: "read_brand",
      },
      {
        title: "Variants",
        path: "/product-variants",
        icon: <SwatchBook className="w-4 h-4" />,
        permissionReq: "read_brandmodel",
      },
    ],
  },
  {
    title: "Plans",
    path: "/plans",
    icon: <Lightbulb className="w-4 h-4" />,
    permissionReq: "read_plan",
  },
  {
    title: "Website",
    path: "/website-pages",
    icon: <Globe className="w-4 h-4" />,
    permissionReq: "read_bookingslot",
    children: [
      {
        title: "Pages",
        path: "/website-pages",
        icon: <Globe className="w-4 h-4" />,
        permissionReq: "read_staticpage",
      },
      {
        title: "Faqs",
        path: "/faqs",
        icon: <CircleQuestionMark className="w-4 h-4" />,
        permissionReq: "read_faq",
      },
      {
        title: "Coupons",
        path: "/coupons",
        icon: <Ticket className="w-4 h-4" />,
        permissionReq: "read_coupon",
      },
      {
        title: "Banners",
        path: "/advertisements",
        icon: <Image className="w-4 h-4" />,
        permissionReq: "read_banner",
      },
      {
        title: "Testimonials",
        path: "/testimonials",
        icon: <LetterText className="w-4 h-4" />,
        permissionReq: "read_testimonial",
      },
    ],
  },
];

const organisationLinks: Array<INavLink> = [
  {
    title: "Team Members",
    path: "/team-members",
    icon: <UserStar className="w-4 h-4" />,
    permissionReq: "read_user",
  },
  {
    title: "Agents",
    path: "/agent",
    icon: <HatGlasses className="w-4 h-4" />,
    permissionReq: "read_user",
  },
  {
    title: "Agent Targets",
    path: "/agent-targets",
    icon: <Target className="w-4 h-4" />,
    permissionReq: "read_agenttarget",
  },
  {
    title: "Roles & Permissions",
    path: "/permissions",
    icon: <ShieldCheck className="w-4 h-4" />,
    permissionReq: "read_permission",
  },
  {
    title: "Organization",
    path: "/organization",
    icon: <Building className="w-4 h-4" />,
    permissionReq: "read_city",
  },
  {
    title: "Workflow Notifications",
    path: "/notifications",
    icon: <BellRing className="w-4 h-4" />,
    permissionReq: "read_notification",
  },
];

const googleLinks: Array<INavLink> = [
  {
    title: "Integrations",
    path: "/enable-integrations",
    permissionReq: "read_notification",
    icon: <Rotate3d className="w-4 h-4" />,
  },
  {
    title: "Google Analytics",
    path: "/google-analytics",
    permissionReq: "read_agenttarget",
    icon: <Hammer className="w-4 h-4" />,
  },
  {
    title: "Google Business",
    path: "/google-business",
    icon: <Hammer className="w-4 h-4" />,
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

  const { selectedOrg, organisations, switchOrganisation } = useOrganisation();
  const { isConnected: isGoogleBusinessConnected } = useGoogleBusinessConnection();
  const { isConnected: isGoogleAnalyticsConnected } = useGoogleAnalyticsConnection();

  const closeNavBar = () => {
    if (!isDesktop && setIsNavOpen) setIsNavOpen(false);
  };

  const storeType = selectedOrg?.store_type.toLowerCase();

  const filterLinks = (links: INavLink[]): INavLink[] => {
    const hiddenRoutes = storeType === "ecommerce" ? hiddenRoutesForEcommerce : hiddenRoutesForCRM;
    return links
      .filter((link) => !hiddenRoutes.includes(link.path || ""))
      .map((link) => {
        if (link.children) {
          const filteredChildren = filterLinks(link.children);
          return { ...link, children: filteredChildren };
        }
        return link;
      })
      .filter((link) => link.path || (link.children && link.children.length > 0));
  };

  const filteredMainLinks = filterLinks(mainLinks);
  const filteredOrganisationLinks = filterLinks(organisationLinks);

  const filteredGoogleLinks = googleLinks.filter((link) => {
    if (link.path === "/google-business" && !isGoogleBusinessConnected) return false;
    if (link.path === "/google-analytics" && !isGoogleAnalyticsConnected) return false;
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
      <nav
        className={`
          flex flex-col justify-start overflow-auto py-2 px-0 bg-sidebar h-screen
          transition-transform duration-300 ease-in-out
          ${isDesktop
            ? `fixed top-0 left-0 w-[250px] z-10 ${isNavOpen ? "translate-x-0" : "-translate-x-full"
            }`
            : `fixed inset-y-0 left-0 w-[250px] z-40 ${isNavOpen ? "translate-x-0" : "-translate-x-full"
            }`
          }
          ${isNavOpen ? "active pb-0" : ""}
        `}
      >
        {isDesktop && (
          <div className="flex justify-between items-center px-4">
            <Logo />
          </div>
        )}

        <div className="all-links px-3 overflow-auto mt-2">
          <OrganizationSwitcher
            organisations={organisations}
            selectedOrg={selectedOrg}
            onSelect={handleSetSelectedOrg}
          />

          {/* Dashboard */}
          <ul className="pt-3 mb-4">
            <Navlink
              title="Dashboard"
              path="/dashboard"
              onClick={closeNavBar}
              icon={<LayoutGrid className="w-4 h-4" />}
              isNavOpen={isNavOpen}
              permissionReq="read_dashboard"
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
            {
              filteredMainLinks.map((link) => (
                <Navlink
                  key={link.title}
                  {...link}
                  onClick={closeNavBar}
                  isNavOpen={isNavOpen}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                />
              ))
            }
          </ul >
          <p className="text-xs text-muted font-medium">CONFIGURATIONS</p>
          <ul className="mb-4 mt-2">
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
              <p className="text-gray-500 mb-2 text-xs uppercase tracking-wide">Integrations</p>
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
      </nav >
      {isNavOpen && !isDesktop && <Overlay onClick={closeNavBar} />}
    </>
  );
};

export default NavBar;
