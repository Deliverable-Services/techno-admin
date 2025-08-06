import { useContext } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { IsDesktopContext } from "../context/IsDesktopContext";
import useUserProfileStore from "../hooks/useUserProfileStore";
import Logo from "../shared-components/Logo";
import { INavBar } from "../types/interface";
import { useOrganisation } from "../context/OrganisationContext";
import { BiLogOut } from "react-icons/bi";
import { useMutation } from "react-query";
import useTokenStore from "../hooks/useTokenStore";
import API from "../utils/API";
import profile from "../assets/profile.svg";
import { GoMail } from "react-icons/go";

const logout = () => {
  return API.post("/auth/logout");
};

const TopBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);
  const removeToken = useTokenStore((state) => state.removeToken);
  const removeUser = useUserProfileStore((state) => state.removeUser);
  const user = useUserProfileStore((state) => state.user);
  const { selectedOrg } = useOrganisation();

  const openNavBar = () => {
    if (setIsNavOpen) {
      setIsNavOpen(!isNavOpen);
    }
  };

  const { mutate, isLoading } = useMutation(logout, {
    onSuccess: () => {
      removeUser();
      removeToken();
      window.location.href = "/login";
    },
    onError: () => {
      removeUser();
      removeToken();
      window.location.href = "/login";
    },
  });

  return (
    <Container
      fluid
      className="top-bar d-flex align-items-center justify-content-between"
      style={{ width: !isNavOpen ? "98vw" : "100%" }}
    >
      {isDesktop ? (

      <div className="menu-hamburger" style={{ cursor: "pointer" }}>
        <GiHamburgerMenu
          size={28}
          onClick={openNavBar}
        // color={primaryColor}
        />
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
          <>
            <div
              className="d-flex align-items-center user-dd"
            >
              <Dropdown
                className="w-100"
              >
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="d-flex align-items-center text-left gap-3 filter-button bg-transparent border-0 p-0"
                  style={{ color: "#000" }}
                >
                  {isLoading ? (
                    "Loading"
                  ) : (
                    <img src={profile} alt="profile" className="profile" />
                  )}
                  {user && <div>
                    <p className="text-muted small mb-0">{user?.name}</p>
                  </div>}
                </Dropdown.Toggle>

                <Dropdown.Menu className="global-card profile-dropdown-menu">
                  <Dropdown.Item href="/profile" className="border-bottom d-flex align-items-center">
                    {" "}
                    <GoMail className="mr-2" />
                    <p className="text-muted small mb-0">{selectedOrg?.email}</p>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => mutate()} className="d-flex align-items-center">
                    <BiLogOut className="mr-2" />
                    <p className="text-muted small mb-0">{isLoading ? "Loading" : "Log out"}</p>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default TopBar;
