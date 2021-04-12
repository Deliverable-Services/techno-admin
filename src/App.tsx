import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import Brands from "./components/Brands/Brands";
import NavBar from "./components/NavBar"
import TopBar from "./components/TopBar";
import { IsDesktopContext } from "./context/IsDesktopContext";


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
  return (
    <IsDesktopContext.Provider value={isDesktop}>
      <div className="App">
        <NavBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        <Container fluid className="main-layout p-0">
          <TopBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
          <Switch>
            <Route path="/brands" exact component={Brands} />
          </Switch>
        </Container>
      </div>
    </IsDesktopContext.Provider>
  );
}

export default App;
