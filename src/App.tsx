import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Switch, useLocation } from "react-router-dom";
import Advertisements from "./components/Advertisements";
import BrandModels from "./components/BrandModels";
// ------pages components--------
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Coupons from "./components/Coupons";
import Dashboard from "./components/Dashboard";
import Faqs from "./components/Faqs";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";
import Orders from "./components/Orders";
import AssignAgent from "./components/Orders/assignAgent";
import SingleOrder from "./components/Orders/single";
import Plans from "./components/Plans";
import Services from "./components/Servicies";
import TopBar from "./components/TopBar";
import Users from "./components/Users";
import VerifyOtp from "./components/VerifyOtp";
import { IsDesktopContext } from "./context/IsDesktopContext";
import useTokenStore from "./hooks/useTokenStore";
import ErrorToast from "./shared-components/ErrorToast/ErrorToast";
import { PrivateRoute } from "./shared-components/PrivateRoute";
import API from "./utils/API";

const App = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

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
            <PrivateRoute path="/" exact component={Dashboard} />
            <PrivateRoute path="/brands" exact component={Brands} />
            <PrivateRoute path="/brand-models" exact component={BrandModels} />
            <PrivateRoute path="/categories" exact component={Categories} />
            <PrivateRoute path="/users" exact component={Users} />
            <PrivateRoute path="/servicies" exact component={Services} />
            <PrivateRoute path="/faqs" exact component={Faqs} />
            <PrivateRoute path="/plans" exact component={Plans} />
            <PrivateRoute path="/coupons" exact component={Coupons} />
            <PrivateRoute path="/orders" exact component={Orders} />
            <PrivateRoute path="/orders/:id" exact component={SingleOrder} />
            <PrivateRoute path="/orders/assign-agent/:id" exact component={AssignAgent} />
            <PrivateRoute
              path="/advertisements"
              exact
              component={Advertisements}
            />
            <Route path="/login" exact component={LoginPage} />
            <Route path="/verify-otp/:id/:otp" exact component={VerifyOtp} />
          </Switch>
          <ErrorToast />
        </Container>
      </div>
    </IsDesktopContext.Provider>
  );
};

export default App;
