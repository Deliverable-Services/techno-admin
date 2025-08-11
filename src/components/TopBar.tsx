import { useContext } from "react";
import { Container } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { IsDesktopContext } from "../context/IsDesktopContext";
import Logo from "../shared-components/Logo";
import { INavBar } from "../types/interface";
import { BsBell } from "react-icons/bs";

const TopBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);

  const openNavBar = () => {
    if (setIsNavOpen) {
      setIsNavOpen(!isNavOpen);
    }
  };

  return (
    <Container
      fluid
      className="top-bar d-flex align-items-center justify-content-between"
    >
      {isDesktop ? (
        <div className="menu-hamburger" style={{ cursor: "pointer" }}>
          <GiHamburgerMenu size={28} onClick={openNavBar} />
        </div>
      ) : null}

      {isDesktop && !isNavOpen && <Logo />}
      {!isDesktop && <Logo />}

      <div
        className={
          isDesktop
            ? "d-flex align-items-center ml-auto"
            : "d-flex align-items-center"
        }
      >
        <div className="notification">
          <BsBell size={20} />
          <div className="circle bg-primary text-white d-flex  justify-content-center">
            <p>
              <b>1</b>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TopBar;
