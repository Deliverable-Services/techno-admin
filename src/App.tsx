import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Advertisements from "./components/Advertisements";
import AdvertisementCreateUpdateForm from "./components/Advertisements/AdvertisementUpdateCreateForm";
import AgentTargets from "./components/AgentTargets";
import TargetCreateUpdateForm from "./components/AgentTargets/AgentCreateUpdateForm";
import BookingSlots from "./components/BookingSlots";
import SlotCreateUpdateForm from "./components/BookingSlots/BookingSlotsCreateUpdateForm";
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
import Configurations from "./components/Configuration";
import ConfigCreateUpdateForm from "./components/Configuration/ConfigCreateUpdate";
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
import StaticPages from "./components/StaticPages";
import StaticPageCreateForm from "./components/StaticPages/StaticPageCreateUpdateForm";
import Subscriptions from "./components/Subscriptions";
import SingleSubscriptions from "./components/Subscriptions/single";
import Testimonial from "./components/Testimonials";
import TestimonialCreateUpdateForm from "./components/Testimonials/TestimonialCreateUpdateForm";
import TopBar from "./components/TopBar";
import Transactions from "./components/Transactions";
import Users from "./components/Users";
import Admins from "./components/Users/admin";
import Agents from "./components/Users/agent";
import ProfilePage from "./components/Users/profile";
import UserCreateUpdateForm from "./components/Users/UsersCreateUpdateForm";
import VerifyOtp from "./components/VerifyOtp";
import { IsDesktopContext } from "./context/IsDesktopContext";
import useMeQuery from "./hooks/useMeQuery";
import useTokenStore from "./hooks/useTokenStore";
import ErrorToast from "./shared-components/ErrorToast/ErrorToast";
import MsgToast from "./shared-components/MsgToast/MsgToast";
import { PrivateRoute } from "./shared-components/PrivateRoute";
import VerifingUserLoader from "./shared-components/VerifingUserLoader";
import API from "./utils/API";
import CMS from "./components/CMS";
import CRM from "./components/CRM";
import CRMBoard from "./components/CRM/CRMBoard";
import organization from "./components/Organization";
import Website from "./components/Website";
import ViewWebsite from "./components/Website/ViewWebsite";




const App = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const { isLoading: isVerifingLoggedInUser } = useMeQuery();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  //adding token to every request
  const token = useTokenStore((state) => state.accessToken);
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (isDesktop) return setIsNavOpen(true);

    setIsNavOpen(false);
  }, [isDesktop]);

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

  if (isVerifingLoggedInUser) return <VerifingUserLoader />;

  return (
    <IsDesktopContext.Provider value={isDesktop}>
      <div className="App">
        {showNavTopBar() ? (
          <NavBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        ) : (
          ""
        )}
        {isNavOpen && <div></div>}
        {showNavTopBar() ? (
          <TopBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        ) : (
          ""
        )}
        <Container
          fluid
          className="main-layout"
          style={{
            gridColumn: isNavOpen ? "2/3" : "1/3",
            minWidth: !isNavOpen && "100vw",
          }}
        >
          <Switch>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
            <PrivateRoute
              path="/dashboard"
              exact
              component={Dashboard}
              permissionReq="read_dashboard"
            />
            <PrivateRoute
              path="/profile"
              exact
              component={ProfilePage}
              permissionReq="read_profile"
              skipPermission
            />
            <PrivateRoute
              path="/product-brands"
              exact
              component={Brands}
              permissionReq="read_brand"
            />
            <PrivateRoute
              path="/products"
              exact
              component={BrandModels}
              permissionReq="read_brandmodel"
            />
            <PrivateRoute
              path="/product-variants"
              exact
              component={CarTypes}
              permissionReq="read_brandmodelType"
            />
            <PrivateRoute
              path="/categories"
              exact
              component={Categories}
              permissionReq="read_category"
            />
            <PrivateRoute
              path="/users"
              exact
              component={Users}
              permissionReq="read_user"
            />
            <PrivateRoute
              path="/team-members"
              exact
              component={Admins}
              permissionReq="read_user"
            />
            <PrivateRoute
              path="/agent"
              exact
              component={Agents}
              permissionReq="read_user"
            />
            <PrivateRoute
              path="/services"
              exact
              component={Services}
              permissionReq="read_service"
            />
            <PrivateRoute
              path="/plans"
              exact
              component={Plans}
              permissionReq="read_plan"
            />
            <PrivateRoute
              path="/coupons"
              exact
              component={Coupons}
              permissionReq="read_coupon"
            />
            <PrivateRoute
              path="/orders"
              exact
              component={Orders}
              permissionReq="read_booking"
            />
            {/* <PrivateRoute
              path="/crm"
              exact
              component={Orders}
              permissionReq="read_booking"
            /> */}
            <PrivateRoute
              path="/cities"
              exact
              component={Cities}
              permissionReq="read_city"
            />
            <PrivateRoute
              path="/testimonials"
              exact
              component={Testimonial}
              permissionReq="read_testimonial"
            />
            <PrivateRoute
              path="/agent-targets"
              exact
              component={AgentTargets}
              permissionReq="read_agenttarget"
            />
            <PrivateRoute
              path="/configurations"
              exact
              component={Configurations}
              permissionReq="read_config"
            />
            <PrivateRoute
              path="/organization"
              exact
              component={organization}
              permissionReq="read_config"
            />
            <PrivateRoute
              path="/cms"
              exact
              component={CMS}
              permissionReq="read_faq"
            />
            <PrivateRoute
              path="/brands/create-edit"
              exact
              component={BrandsCreateUpdateForm}
              permissionReq="read_brand"
            />
            <PrivateRoute
              path="/brand-models/create-edit"
              exact
              component={BrandModlesCreateUpdateForm}
              permissionReq="read_brandmodel"
            />
            <PrivateRoute
              path="/car-types/create-edit"
              exact
              component={CarTypesCreateUpdateForm}
              permissionReq="read_brandmodel"
            />
            <PrivateRoute
              path="/categories/create-edit"
              exact
              component={CategoriesCreateUpdateForm}
              permissionReq="read_category"
            />
            <PrivateRoute
              path="/agent-targets/create-edit"
              exact
              component={TargetCreateUpdateForm}
              permissionReq="read_agenttarget"
            />
            <PrivateRoute
              path="/configurations/create-edit"
              exact
              component={ConfigCreateUpdateForm}
              permissionReq="read_config"
            />
            <PrivateRoute
              path="/users/create-edit"
              exact
              component={UserCreateUpdateForm}
              permissionReq="read_user"
            />
            <PrivateRoute
              path="/services/create-edit"
              exact
              component={ServicesCreateUpdateForm}
              permissionReq="read_service"
            />
            <PrivateRoute
              path="/plans/create-edit"
              exact
              component={PlanCreateUpdateForm}
              permissionReq="read_plan"
            />
            <PrivateRoute
              path="/coupons/create-edit"
              exact
              component={CouponCreateUpdateForm}
              permissionReq="read_coupon"
            />
            <PrivateRoute
              path="/faqs"
              exact
              component={Faqs}
              permissionReq="read_faq"
            />
            <PrivateRoute
              path="/faqs/create-edit"
              exact
              component={FaqCreateUpdateForm}
              permissionReq="read_faq"
            />
            <PrivateRoute
              path="/cities/create-edit"
              exact
              component={CitiesCreateUpdateForm}
              permissionReq="read_city"
            />
            <PrivateRoute
              path="/advertisements"
              exact
              component={Advertisements}
              permissionReq="read_banner"
            />
            <PrivateRoute
              path="/advertisements/create-edit"
              exact
              component={AdvertisementCreateUpdateForm}
              permissionReq="read_banner"
            />
            <PrivateRoute
              path="/transactions"
              exact
              component={Transactions}
              permissionReq="read_transaction"
            />
            <PrivateRoute
              path="/issues"
              exact
              component={Issues}
              permissionReq="read_ticket"
            />
            <PrivateRoute
              path="/issues/create-edit"
              exact
              component={IssuesCreateForm}
              permissionReq="create_ticket"
            />
            <PrivateRoute
              path="/permissions"
              exact
              component={Permissions}
              permissionReq="read_permission"
            />
            <PrivateRoute
              path="/roles"
              exact
              component={Roles}
              permissionReq="read_role"
            />
            <PrivateRoute
              path="/push-notifications"
              exact
              component={Notifications}
              permissionReq="read_notification"
            />
            <PrivateRoute
              path="/cart"
              exact
              component={Cart}
              permissionReq="read_booking"
            />
            <PrivateRoute
              path="/crm-bookings"
              exact
              component={BookingSlots}
              permissionReq="read_bookingslot"
            />
            <PrivateRoute
              path="/booking-slots/create-edit"
              exact
              component={SlotCreateUpdateForm}
              permissionReq="create_bookingslot"
            />
            <PrivateRoute
              path="/push-notifications/create-edit"
              exact
              component={NotificationCreateUpdateForm}
              permissionReq="read_notification"
            />
            <PrivateRoute
              path="/testimonials/create-edit"
              exact
              component={TestimonialCreateUpdateForm}
              permissionReq="read_testimonial"
            />
            <PrivateRoute
              path="/assign-permission/create-edit"
              exact
              component={AssignPermissionForm}
              permissionReq="assign_permission"
            />
            <PrivateRoute
              path="/revoke-permission/create-edit"
              exact
              component={RevokePermission}
              permissionReq="revoke_permission"
            />
            <PrivateRoute
              path="/permissions/create-edit"
              exact
              component={PermissionsCreateUpdateForm}
              permissionReq="read_permission"
            />
            <PrivateRoute
              path="/roles/create-edit"
              exact
              component={RolesCreateUpdateForm}
              permissionReq="read_role"
            />
            <PrivateRoute
              path="/subscriptions"
              exact
              component={Subscriptions}
              permissionReq="read_subscription"
            />
            <PrivateRoute
              path="/website"
              exact
              component={Website}
              permissionReq="read_staticpage"
            />
            <PrivateRoute
              path="/website/:id"
              exact
              component={ViewWebsite}
              permissionReq="read_staticpage"
            />
            <PrivateRoute
              path="/static-pages"
              exact
              component={StaticPages}
              permissionReq="read_staticpage"
            />
            <PrivateRoute
              path="/static-pages/create-edit"
              exact
              component={StaticPageCreateForm}
              permissionReq="read_staticpage"
            />
            <PrivateRoute
              path="/subscriptions/:id"
              exact
              component={SingleSubscriptions}
              permissionReq="read_subscription"
            />
            <PrivateRoute
              path="/orders/:id"
              exact
              component={SingleOrder}
              permissionReq="read_booking"
            />
            <PrivateRoute
              path="/issues/:id"
              exact
              component={SingleIssue}
              permissionReq="read_ticket"
            />
            <PrivateRoute
              path="/orders/assign-agent/:id"
              exact
              component={AssignAgent}
              permissionReq="assign_agent"
            />
            <PrivateRoute
              path="/crm"
              exact
              component={CRMBoard}
              permissionReq="read_user"
            />

            <Route path="/login" exact component={LoginPage} />
            <Route path="/verify-otp" exact component={VerifyOtp} />
          </Switch>
          <ErrorToast />
          <MsgToast />
        </Container>
      </div>
    </IsDesktopContext.Provider>
  );
};

export default App;
