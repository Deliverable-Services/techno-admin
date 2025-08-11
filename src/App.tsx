import { useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import useAuthManager from "./hooks/useAuthManager";
import Advertisements from "./components/Advertisements";
import AdvertisementCreateUpdateForm from "./components/Advertisements/AdvertisementUpdateCreateForm";
import AgentTargets from "./components/AgentTargets";
import TargetCreateUpdateForm from "./components/AgentTargets/AgentCreateUpdateForm";
import BookingSlots from "./components/BookingSlots";
import BrandModels from "./components/BrandModels";
import BrandModlesCreateUpdateForm from "./components/BrandModels/BrandModelsUpdateCreateForm";
// ------pages components--------
import Brands from "./components/Brands";
import BrandsCreateUpdateForm from "./components/Brands/BrandsCreateUpdateForm";
import Cart from "./components/Cart";
import CarTypes from "./components/CarTypes";
import CarTypesCreateUpdateForm from "./components/CarTypes/CarTypesCreateUpdateForm";
import Categories from "./components/Categories";
import CategoriesCreateUpdateForm from "./components/Categories/CategoriesCreateUpdateForm";
import Cities from "./components/Cities";
import CitiesCreateUpdateForm from "./components/Cities/CitiesCreateUpdateForm";
import Coupons from "./components/Coupons";
import CouponCreateUpdateForm from "./components/Coupons/CouponsCreateUpdateForm";
import Dashboard from "./components/Dashboard";
import Faqs from "./components/Faqs";
import FaqCreateUpdateForm from "./components/Faqs/FaqsCreateUpdateForm";
import Issues from "./components/Issues";
import IssuesCreateForm from "./components/Issues/IssuesCreateForm";
import SingleIssue from "./components/Issues/single";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";
import Notifications from "./components/Notification";
import NotificationCreateUpdateForm from "./components/Notification/NotificationCreateUpdateForm";
import Orders from "./components/Orders";
import AssignAgent from "./components/Orders/assignAgent";
import SingleOrder from "./components/Orders/single";
import Permissions from "./components/Permissions";
import AssignPermissionForm from "./components/Permissions/AssignPermissonCreateUpdateForm";
import PermissionsCreateUpdateForm from "./components/Permissions/PermissoinsCreateUpdateForm";
import RevokePermission from "./components/Permissions/RevokePermissions";
import Plans from "./components/Plans";
import PlanCreateUpdateForm from "./components/Plans/PlansCreateUpdateForm";
import Roles from "./components/Roles";
import RolesCreateUpdateForm from "./components/Roles/RolesCreateUpdateForm";
import Services from "./components/Servicies";
import ServicesCreateUpdateForm from "./components/Servicies/ServiciesCreateUpdateForm";

import Testimonial from "./components/Testimonials";
import TestimonialCreateUpdateForm from "./components/Testimonials/TestimonialCreateUpdateForm";
import TopBar from "./components/TopBar";
import Transactions from "./components/Transactions";
import Users from "./components/Users";
import Admins from "./components/Users/admin";
import Agents from "./components/Users/agent";
import ProfilePage from "./components/Users/profile";
import VerifyOtp from "./components/VerifyOtp";
import { IsDesktopContext } from "./context/IsDesktopContext";
import ErrorToast from "./shared-components/ErrorToast/ErrorToast";
import MsgToast from "./shared-components/MsgToast/MsgToast";
import { PrivateRoute } from "./shared-components/PrivateRoute";
import VerifingUserLoader from "./shared-components/VerifingUserLoader";
import CMS from "./components/CMS";

import CRMBoard from "./components/CRM";
import organization from "./components/Organization";
import InvoicePage from "./components/Invoices";
import { useOrganisation } from "./context/OrganisationContext";
import DynamicPageCreateUpdateForm from "./components/DynamicPages/DynamicPageCreateUpdateForm";
import ViewWebsite from "./components/DynamicPages/ViewWebsite";
import WebsitePages from "./components/WebsitePages";
import { BottomNavigation } from "./components/BottomNavigation/BottomNavigation";
import { MoreScreen } from "./components/MoreScreen/MoreScreen";
import useUserProfileStore from "./hooks/useUserProfileStore";
import SubscriptionPage from "./components/Subscription";
import UsersCreateEdit from "./components/Users/UsersCreateEdit";
import StaticPageCreateForm from "./components/StaticPages/StaticPageCreateUpdateForm";
import {
  IntegrationsPage,
  GoogleAnalytics,
  GoogleBusinessDashboard,
} from "./components/Integrations";

const App = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const loggedInUser = useUserProfileStore((state) => state.user);
  const { setOrganisations, selectedOrg, setSelectedOrg } = useOrganisation();

  // Use the new authentication manager
  const { isLoading: isAuthLoading, isInitialized } = useAuthManager();

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (isDesktop) return setIsNavOpen(true);

    setIsNavOpen(false);
  }, [isDesktop]);

  // Scroll to top on route change
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement?.scrollTo?.({ top: 0, behavior: "smooth" });
      document.body?.scrollTo?.({ top: 0, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

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
    if (loggedInUser) handleSetOrganisations(loggedInUser?.organisations);
  }, [loggedInUser, selectedOrg, setOrganisations, setSelectedOrg]);

  const updateDimensions = () => {
    const width = window.innerWidth;
    if (width > 800) setIsDesktop(true);
    else setIsDesktop(false);
  };

  function showNavTopBar(): boolean {
    if (pathname.includes("login") || pathname.includes("verify-otp"))
      return false;
    else return true;
  }

  // Show loading while authentication is being checked
  if (!isInitialized || isAuthLoading) return <VerifingUserLoader />;

  // Route configuration
  type RouteConfig = {
    path: string;
    component: any;
    exact?: boolean;
    isPrivate?: boolean;
    permissionReq?: string;
    skipPermission?: boolean;
  };

  const routes: RouteConfig[] = [
    // - crm routes
    {
      path: "/dashboard",
      component: Dashboard,
      exact: true,
      isPrivate: true,
      permissionReq: "read_dashboard",
    },
    {
      path: "/crm",
      component: CRMBoard,
      exact: true,
      isPrivate: true,
      permissionReq: "read_user",
    },
    {
      path: "/meetings",
      component: BookingSlots,
      exact: true,
      isPrivate: true,
      permissionReq: "read_bookingslot",
    },
    {
      path: "/invoices",
      component: InvoicePage,
      exact: true,
      isPrivate: true,
      permissionReq: "read_city",
    },
    {
      path: "/subscriptions",
      component: SubscriptionPage,
      exact: true,
      isPrivate: true,
      permissionReq: "read_subscription",
    },
    {
      path: "/transactions",
      component: Transactions,
      exact: true,
      isPrivate: true,
      permissionReq: "read_transaction",
    },
    {
      path: "/users",
      component: Users,
      exact: true,
      isPrivate: true,
      permissionReq: "read_user",
    },
    {
      path: "/profile",
      component: ProfilePage,
      exact: true,
      isPrivate: true,
      permissionReq: "read_profile",
      skipPermission: true,
    },
    {
      path: "/categories",
      component: Categories,
      exact: true,
      isPrivate: true,
      permissionReq: "read_category",
    },
    {
      path: "/services",
      component: Services,
      exact: true,
      isPrivate: true,
      permissionReq: "read_service",
    },
    {
      path: "/cms",
      component: CMS,
      exact: true,
      isPrivate: true,
      permissionReq: "read_faq",
    },
    {
      path: "/services/create-edit",
      component: ServicesCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_service",
    },
    // - ecommerce routes
    {
      path: "/product-variants",
      component: CarTypes,
      exact: true,
      isPrivate: true,
      permissionReq: "read_brandmodelType",
    },
    {
      path: "/agent",
      component: Agents,
      exact: true,
      isPrivate: true,
      permissionReq: "read_user",
    },
    {
      path: "/plans",
      component: Plans,
      exact: true,
      isPrivate: true,
      permissionReq: "read_plan",
    },
    {
      path: "/coupons",
      component: Coupons,
      exact: true,
      isPrivate: true,
      permissionReq: "read_coupon",
    },
    {
      path: "/orders",
      component: Orders,
      exact: true,
      isPrivate: true,
      permissionReq: "read_booking",
    },
    {
      path: "/orders/assign-agent/:id",
      component: AssignAgent,
      exact: true,
      isPrivate: true,
      permissionReq: "assign_agent",
    },
    {
      path: "/orders/:id",
      component: SingleOrder,
      exact: true,
      isPrivate: true,
      permissionReq: "read_booking",
    },
    {
      path: "/cart",
      component: Cart,
      exact: true,
      isPrivate: true,
      permissionReq: "read_booking",
    },
    {
      path: "/plans/create-edit",
      component: PlanCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_plan",
    },
    {
      path: "/coupons/create-edit",
      component: CouponCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_coupon",
    },
    {
      path: "/agent-targets/create-edit",
      component: TargetCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_agenttarget",
    },
    {
      path: "/brands/create-edit",
      component: BrandsCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_brand",
    },
    {
      path: "/brand-models/create-edit",
      component: BrandModlesCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_brandmodel",
    },
    {
      path: "/car-types/create-edit",
      component: CarTypesCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_brandmodel",
    },
    {
      path: "/agent-targets",
      component: AgentTargets,
      exact: true,
      isPrivate: true,
      permissionReq: "read_agenttarget",
    },
    {
      path: "/products",
      component: BrandModels,
      exact: true,
      isPrivate: true,
      permissionReq: "read_brandmodel",
    },
    {
      path: "/product-brands",
      component: Brands,
      exact: true,
      isPrivate: true,
      permissionReq: "read_brand",
    },
    // - common routes
    {
      path: "/cities",
      component: Cities,
      exact: true,
      isPrivate: true,
      permissionReq: "read_city",
    },
    {
      path: "/notifications",
      component: Notifications,
      exact: true,
      isPrivate: true,
      permissionReq: "read_notification",
    },
    {
      path: "/notifications/create-edit",
      component: NotificationCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_notification",
    },
    {
      path: "/website",
      component: WebsitePages,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/website/:id",
      component: ViewWebsite,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/google-analytics",
      component: GoogleAnalytics,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/google-business",
      component: GoogleBusinessDashboard,
      exact: true,
      isPrivate: true,
      permissionReq: "read_dashboard",
    },
    {
      path: "/issues/:id",
      component: SingleIssue,
      exact: true,
      isPrivate: true,
      permissionReq: "read_ticket",
    },
    {
      path: "/testimonials/create-edit",
      component: TestimonialCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_testimonial",
    },
    {
      path: "/assign-permission/create-edit",
      component: AssignPermissionForm,
      exact: true,
      isPrivate: true,
      permissionReq: "assign_permission",
    },
    {
      path: "/revoke-permission/create-edit",
      component: RevokePermission,
      exact: true,
      isPrivate: true,
      permissionReq: "revoke_permission",
    },
    {
      path: "/permissions/create-edit",
      component: PermissionsCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_permission",
    },
    {
      path: "/roles/create-edit",
      component: RolesCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_role",
    },
    {
      path: "/website-pages/dynamic/create-edit",
      component: DynamicPageCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/website-pages/dynamic/:id",
      component: ViewWebsite,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/website-pages",
      component: WebsitePages,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/website-pages/create-edit/:id",
      component: StaticPageCreateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/more",
      component: MoreScreen,
      exact: true,
      isPrivate: true,
      permissionReq: "read_staticpage",
    },
    {
      path: "/faqs",
      component: Faqs,
      exact: true,
      isPrivate: true,
      permissionReq: "read_faq",
    },
    {
      path: "/faqs/create-edit",
      component: FaqCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_faq",
    },
    {
      path: "/cities/create-edit",
      component: CitiesCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_city",
    },
    {
      path: "/advertisements",
      component: Advertisements,
      exact: true,
      isPrivate: true,
      permissionReq: "read_banner",
    },
    {
      path: "/advertisements/create-edit",
      component: AdvertisementCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_banner",
    },
    {
      path: "/issues",
      component: Issues,
      exact: true,
      isPrivate: true,
      permissionReq: "read_ticket",
    },
    {
      path: "/issues/create-edit",
      component: IssuesCreateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "create_ticket",
    },
    {
      path: "/permissions",
      component: Permissions,
      exact: true,
      isPrivate: true,
      permissionReq: "read_permission",
    },
    {
      path: "/roles",
      component: Roles,
      exact: true,
      isPrivate: true,
      permissionReq: "read_role",
    },
    {
      path: "/users/create-edit",
      component: UsersCreateEdit,
      exact: true,
      isPrivate: true,
      permissionReq: "read_user",
    },
    {
      path: "/categories/create-edit",
      component: CategoriesCreateUpdateForm,
      exact: true,
      isPrivate: true,
      permissionReq: "read_category",
    },
    {
      path: "/organization",
      component: organization,
      exact: true,
      isPrivate: true,
      permissionReq: "read_config",
    },
    {
      path: "/enable-integrations",
      component: IntegrationsPage,
      exact: true,
      isPrivate: true,
      permissionReq: "read_config",
    },
    {
      path: "/testimonials",
      component: Testimonial,
      exact: true,
      isPrivate: true,
      permissionReq: "read_testimonial",
    },
    {
      path: "/team-members",
      component: Admins,
      exact: true,
      isPrivate: true,
      permissionReq: "read_user",
    },
    // - public routes
    { path: "/login", component: LoginPage, exact: true },
    { path: "/verify-otp", component: VerifyOtp, exact: true },
  ];

  return (
    <IsDesktopContext.Provider value={isDesktop}>
      <div className="App text-[#1e2022] bg-sidebar flex">
        {showNavTopBar() ? (
          <NavBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        ) : (
          ""
        )}
        <div
          style={{
            width: showNavTopBar() && isNavOpen ? "calc(100% - 250px" : "100%",
            minWidth: !isNavOpen && "100vw",
            marginLeft: showNavTopBar() && isNavOpen ? "250px" : "0",
            transition: "0.3s all ease-in-out",
          }}
        >
          {showNavTopBar() ? (
            <TopBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
          ) : (
            ""
          )}
          <div className="main-layout bg-white rounded-xl rounded-e-none mb-[50px] mt-16 w-full overflow-hidden overflow-y-auto min-h-[400px]">
            <Switch>
              <Route exact path="/">
                <Redirect to="/dashboard" />
              </Route>
              {routes.map((r) =>
                r.isPrivate ? (
                  <PrivateRoute
                    key={r.path}
                    path={r.path}
                    exact={r.exact}
                    component={r.component}
                    permissionReq={r.permissionReq as any}
                    skipPermission={r.skipPermission}
                  />
                ) : (
                  <Route
                    key={r.path}
                    path={r.path}
                    exact={r.exact}
                    component={r.component}
                  />
                )
              )}
            </Switch>
            <ErrorToast />
            <MsgToast />
          </div>
          {!isDesktop && showNavTopBar() && <BottomNavigation />}
        </div>
      </div>
    </IsDesktopContext.Provider>
  );
};

export default App;
