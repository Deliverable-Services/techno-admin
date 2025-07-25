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
  <section
    style={{
      fontSize: "11px",
      fontWeight: "bold",
      color: "#667085",
      textAlign: "center",
      marginBottom: "4px",
    }}
  >
    Organisation
  </section>

  <Dropdown.Toggle
    id="dropdown-basic"
    className="bg-white border rounded-pill px-3 py-1 shadow-sm d-flex align-items-center btn-focus-none"
    style={{ color: "#000", fontWeight: "500", fontSize: "14px" }}
  >
    <span className="text-truncate" style={{ maxWidth: 150 }}>
      {user?.organisation?.name}
    </span>
  </Dropdown.Toggle>

  <Dropdown.Menu className=" rounded border-0 mt-2  global-card" style={{ minWidth: "260px" }}>
    <div className="d-flex flex-column gap-2">
      <section className="d-flex align-items-center py-2 px-4 border-bottom">
        <FaEnvelope className="text-primary mr-2" size={14} />
        <span>{user?.organisation?.email}</span>
      </section>
      <section className="d-flex align-items-center py-2 px-4 border-bottom">
        <FaPhone className="text-primary mr-2" size={14} />
        <span>{user?.organisation?.phone}</span>
      </section>
      <section className="d-flex align-items-center py-2 px-4 border-bottom">
        <FaMap className="text-primary mr-2" size={14} />
        <span>{user?.organisation?.address}</span>
      </section>
      <section className="d-flex align-items-center py-2 px-4 ">
        <FaClock className="text-primary mr-2" size={14} />
        <span>{formatTimestamp(user?.organisation?.created_at)}</span>
      </section>
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
