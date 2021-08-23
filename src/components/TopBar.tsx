import React, { useContext } from "react";
import { Container, Dropdown, Form } from "react-bootstrap";
import { BiMenuAltLeft } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import profile from "../assets/profile.svg";
import { IsDesktopContext } from "../context/IsDesktopContext";
import useTokenStore from "../hooks/useTokenStore";
import useUserProfileStore from "../hooks/useUserProfileStore";
import Logo from "../shared-components/Logo";
import { INavBar } from "../types/interface";
import API from "../utils/API";
import { primaryColor } from "../utils/constants";

const logout = () => {
  return API.post("/auth/logout");
};

const TopBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
  const isDesktop = useContext(IsDesktopContext);
  const history = useHistory();
  const removeToken = useTokenStore((state) => state.removeToken);
  const removeUser = useUserProfileStore((state) => state.removeUser);
  const user = useUserProfileStore((state) => state.user);

  const { mutate, isLoading } = useMutation(logout, {
    onSuccess: () => {
      removeUser();
      removeToken();
      history.push("/login");
    },
    onError: () => {
      removeUser();
      removeToken();
      history.push("/login");
    },
  });
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
          <Form.Group className="form-group store-select ">
            <Form.Label className="text-muted font-weight-bold">
              Select Store
            </Form.Label>

            <Form.Control
              as="select"
              style={{
                width: 150,
                fontSize: 14,
              }}
              disabled
            >
              <option value="carsafai">Car Safai</option>
            </Form.Control>
          </Form.Group>
        )}

        <div className="d-flex align-items-center justify-content-center ml-4">
          <Dropdown className="ml-4">
            <Dropdown.Toggle
              id="dropdown-basic"
              className="filter-button bg-transparent border-0"
              style={{ color: "#000" }}
            >
              {isLoading ? (
                "Loading"
              ) : (
                <img src={profile} alt="profile" className="profile" />
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/profile">Profile</Dropdown.Item>
              <Dropdown.Item onClick={() => mutate()}>
                {isLoading ? "Loading" : "Log out"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {user && <p className="text-muted small mb-0">{user?.name}</p>}
        </div>
      </div>
    </Container>
  );
};

export default TopBar;
