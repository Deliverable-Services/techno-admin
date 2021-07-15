import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Advertisements from "./components/Advertisements";
import AdvertisementCreateUpdateForm from "./components/Advertisements/AdvertisementUpdateCreateForm";
import BookingSlots from "./components/BookingSlots";
import SlotCreateUpdateForm from "./components/BookingSlots/BookingSlotsCreateUpdateForm";
import BrandModels from "./components/BrandModels";
import BrandModlesCreateUpdateForm from "./components/BrandModels/BrandModelsUpdateCreateForm";
// ------pages components--------
import Brands from "./components/Brands";
import BrandsCreateUpdateForm from "./components/Brands/BrandsCreateUpdateForm";
import Cart from "./components/Cart";
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
import TransactionUpdateForm from "./components/Transactions/TransactionUpdateForm";
import Users from "./components/Users";
import Admins from "./components/Users/admin";
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

const App = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const { isLoading: isVerifingLoggedInUser } = useMeQuery();
  console.log({ isVerifingLoggedInUser });
  //adding token to every request
  const token = useTokenStore((state) => state.accessToken);
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    if (width > 800) setIsDesktop(true);
    else setIsDesktop(false);
  };

  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

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
        <div></div>
        {showNavTopBar() ? (
          <TopBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        ) : (
          ""
        )}
        <Container fluid className="main-layout">
          <Switch>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
            <PrivateRoute path="/dashboard" exact component={Dashboard} />
            <PrivateRoute path="/brands" exact component={Brands} />
            <PrivateRoute path="/brand-models" exact component={BrandModels} />
            <PrivateRoute path="/categories" exact component={Categories} />
            <PrivateRoute path="/users" exact component={Users} />
            <PrivateRoute path="/admin" exact component={Admins} />
            <PrivateRoute path="/services" exact component={Services} />
            <PrivateRoute path="/faqs" exact component={Faqs} />
            <PrivateRoute path="/plans" exact component={Plans} />
            <PrivateRoute path="/coupons" exact component={Coupons} />
            <PrivateRoute path="/orders" exact component={Orders} />
            <PrivateRoute path="/cities" exact component={Cities} />
            <PrivateRoute path="/testimonials" exact component={Testimonial} />
            <PrivateRoute
              path="/advertisements"
              exact
              component={Advertisements}
            />
            <PrivateRoute
              path="/brands/create-edit"
              exact
              component={BrandsCreateUpdateForm}
            />
            <PrivateRoute
              path="/brand-models/create-edit"
              exact
              component={BrandModlesCreateUpdateForm}
            />
            <PrivateRoute
              path="/categories/create-edit"
              exact
              component={CategoriesCreateUpdateForm}
            />
            <PrivateRoute
              path="/users/create-edit"
              exact
              component={UserCreateUpdateForm}
            />
            <PrivateRoute
              path="/services/create-edit"
              exact
              component={ServicesCreateUpdateForm}
            />
            <PrivateRoute
              path="/plans/create-edit"
              exact
              component={PlanCreateUpdateForm}
            />
            <PrivateRoute
              path="/coupons/create-edit"
              exact
              component={CouponCreateUpdateForm}
            />
            <PrivateRoute
              path="/faqs/create-edit"
              exact
              component={FaqCreateUpdateForm}
            />
            <Route
              path="/cities/create-edit"
              exact
              component={CitiesCreateUpdateForm}
            />
            <PrivateRoute
              path="/advertisements/create-edit"
              exact
              component={AdvertisementCreateUpdateForm}
            />
            <PrivateRoute path="/transactions" exact component={Transactions} />
            <PrivateRoute path="/issues" exact component={Issues} />
            <PrivateRoute
              path="/issues/create-edit"
              exact
              component={IssuesCreateForm}
            />
            <PrivateRoute path="/permissions" exact component={Permissions} />
            <PrivateRoute path="/roles" exact component={Roles} />
            <PrivateRoute
              path="/push-notifications"
              exact
              component={Notifications}
            />
            <PrivateRoute path="/cart" exact component={Cart} />
            <PrivateRoute
              path="/booking-slots"
              exact
              component={BookingSlots}
            />
            <PrivateRoute
              path="/booking-slots/create-edit"
              exact
              component={SlotCreateUpdateForm}
            />
            <PrivateRoute
              path="/push-notifications/create-edit"
              exact
              component={NotificationCreateUpdateForm}
            />
            <PrivateRoute
              path="/testimonials/create-edit"
              exact
              component={TestimonialCreateUpdateForm}
            />
            <PrivateRoute
              path="/assign-permission/create-edit"
              exact
              component={AssignPermissionForm}
            />
            <PrivateRoute
              path="/permissions/create-edit"
              exact
              component={PermissionsCreateUpdateForm}
            />
            <PrivateRoute
              path="/roles/create-edit"
              exact
              component={RolesCreateUpdateForm}
            />
            <PrivateRoute
              path="/transactions/:id"
              exact
              component={TransactionUpdateForm}
            />
            <PrivateRoute
              path="/subscriptions"
              exact
              component={Subscriptions}
            />
            <PrivateRoute path="/static-pages" exact component={StaticPages} />
            <PrivateRoute
              path="/static-pages/create-edit"
              exact
              component={StaticPageCreateForm}
            />
            <PrivateRoute
              path="/subscriptions/:id"
              exact
              component={SingleSubscriptions}
            />
            <PrivateRoute path="/orders/:id" exact component={SingleOrder} />
            <PrivateRoute path="/issues/:id" exact component={SingleIssue} />
            <PrivateRoute
              path="/orders/assign-agent/:id"
              exact
              component={AssignAgent}
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
