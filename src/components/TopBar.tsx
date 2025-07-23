import { useContext } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { IsDesktopContext } from "../context/IsDesktopContext";
import useUserProfileStore from "../hooks/useUserProfileStore";
import Logo from "../shared-components/Logo";
import { INavBar } from "../types/interface";
import { FaClock, FaEnvelope, FaMap, FaPhone } from "react-icons/fa";
import { formatTimestamp } from "../utils/utitlity";


const TopBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);
  const user = useUserProfileStore((state) => state.user);

  const openNavBar = () => {
    if (setIsNavOpen) {
      setIsNavOpen(true);
    }
  };

  return (
    <Container
      fluid
      className="top-bar d-flex align-items-center justify-content-between"
      style={{ width: !isNavOpen ? "98vw" : "100%" }}
    >
      {/* {!isDesktop ? ( */}
      {!isNavOpen ? (
        <div className="menu-hamburger" style={{ cursor: "pointer" }}>
          <GiHamburgerMenu
            size={28}
            onClick={openNavBar}
          // color={primaryColor}
          />
        </div>
      ) : null}
      {/* ) : null} */}

      {isDesktop && !isNavOpen && <Logo />}
      {!isDesktop && <Logo />}

      <div
        className={
          isDesktop
            ? "d-flex align-items-center ml-auto"
            : "d-flex align-items-center"
        }
      >
        {/* Todo: Add notification functionality */}
        {/* <div className="notification">
          <BsBell size={20} />
          <div className="circle bg-primary text-white d-flex  justify-content-center">
            <p>
              <b>1</b>
            </p>
          </div>
        </div> */}

        {isDesktop && (
          <div className="d-flex align-items-center justify-content-center ml-4 ">
            <Dropdown className="ml-4">
              <section style={{ fontSize: "11px", fontWeight: "bold", color: "#667085", textAlign: "center" }}>Organisation</section>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="filter-button bg-transparent border-0"
                style={{ color: "#000" }}
              >
                <span>{user?.organisation?.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <div className="d-flex flex-column gap-10 px-4 py-2">
                  <section className="d-flex align-items-center gap-10"><FaEnvelope size={14} /> {user?.organisation?.email}</section>
                  <section className="d-flex align-items-center gap-10"><FaPhone size={14} /> {user?.organisation?.phone}</section>
                  <section className="d-flex align-items-center gap-10"><FaMap size={14} />{user?.organisation?.address}</section>
                  <section className="d-flex align-items-center gap-10"><FaClock size={14} /> {formatTimestamp(user?.organisation?.created_at)}</section>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>


    </Container>
  );
};

export default TopBar;
