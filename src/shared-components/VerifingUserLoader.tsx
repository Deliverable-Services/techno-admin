import React from "react";
import { Container } from "react-bootstrap";
import IsLoading from "./isLoading";

const VerifingUserLoader = () => {
  return (
    <Container
      fluid
      style={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        zIndex: 10000000000,
      }}
      className="d-flex align-items-center justify-content-center "
    >
      <div className="d-flex align-items-center justify-content-center flex-column ">
        <IsLoading />
        <p className="text-center text-primary font-weight-bold">Verifing...</p>
      </div>
    </Container>
  );
};

export default VerifingUserLoader;
