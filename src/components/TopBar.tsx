import React, { useContext } from "react";
import { Container, Dropdown, Form } from "react-bootstrap";
import { BiMenuAltLeft } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
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
    >
      {!isDesktop ? (
        <div className="menu-hamburger">
          {!isNavOpen ? (
            <BiMenuAltLeft
              size={32}
              onClick={openNavBar}
              color={primaryColor}
            />
          ) : null}
        </div>
      ) : null}

      {!isDesktop && <Logo />}

      {isDesktop && (
        <Form.Group className="form-group store-select">
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

        <div className="d-flex align-items-center justify-content-center ml-4">
          <span className="text-muted">{user.name}</span>
          <Dropdown className="ml-4">
            <Dropdown.Toggle
              id="dropdown-basic"
              className="filter-button bg-transparent border-0 text-primary"
            >
              {isLoading ? (
                "Loading"
              ) : (
                <img src={profile} alt="profile" className="profile" />
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => mutate()}>
                {isLoading ? "Loading" : "SignOut"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Container>
  );
};

export default TopBar;
