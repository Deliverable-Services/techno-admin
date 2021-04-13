import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import BrandModels from "./components/BrandModels";
// ------pages components-------- 
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Coupons from "./components/Coupons";
import Faqs from "./components/Faqs";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";
import Plans from "./components/Plans";
import Services from "./components/Servicies";
import TopBar from "./components/TopBar";
import Users from "./components/Users";
import { IsDesktopContext } from "./context/IsDesktopContext";
import ErrorToast from "./shared-components/ErrorToast/ErrorToast";



const App = () => {


  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  useEffect(() => {

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () =>
      window.removeEventListener("resize", updateDimensions);
  }, [])


  const updateDimensions = () => {
    const width = window.innerWidth
    if (width > 800)
      setIsDesktop(true)
    else
      setIsDesktop(false)
  }

  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const { pathname } = useLocation()

  return (
    <IsDesktopContext.Provider value={isDesktop}>
      <div className="App">
        {pathname !== "/login" &&
          <NavBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />}
        <Container fluid className="main-layout p-0">
          {
            pathname !== "/login" &&
            <TopBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />}

          <Switch>
            <PrivateRoute path="/brands" exact component={Brands} />
            <Route path="/brand-models" exact component={BrandModels} />
            <Route path="/categories" exact component={Categories} />
            <Route path="/users" exact component={Users} />
            <Route path="/servicies" exact component={Services} />
            <Route path="/faqs" exact component={Faqs} />
            <Route path="/plans" exact component={Plans} />
            <Route path="/coupons" exact component={Coupons} />
            <Route path="/login" exact component={LoginPage} />
          </Switch>
          <ErrorToast />
        </Container>
      </div>
    </IsDesktopContext.Provider>
  );
}

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const history = useHistory()
  const isAuthenticated = true
  useEffect(() => {
    if (!isAuthenticated)
      history.push("/login")
  }, [isAuthenticated])
  return (
    <Route {...rest} render={(props) => (

      <Component {...props} />

    )} />
  )
}

export default App;
