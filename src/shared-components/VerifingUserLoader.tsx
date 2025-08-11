import React from "react";
import { Container } from "react-bootstrap";
import { FaShieldAlt, FaUserCheck, FaLock } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { primaryColor } from "../utils/constants";

const VerifingUserLoader = () => {
  return (
    <Container
      fluid
      style={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        zIndex: 10000000000,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backdropFilter: "blur(10px)",
      }}
      className="d-flex align-items-center justify-content-center"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        className="d-flex align-items-center justify-content-center flex-column text-center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "24px",
          padding: "60px 50px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "400px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `conic-gradient(from 0deg, transparent, ${primaryColor}15, transparent)`,
            animation: "rotate 8s linear infinite",
            borderRadius: "50%",
          }}
        />

        <div className="position-relative mb-4">
          <div
            className="d-flex align-items-center justify-content-center position-relative"
            style={{
              width: "100px",
              height: "100px",
              background: `linear-gradient(135deg, ${primaryColor}, #4299ff)`,
              borderRadius: "50%",
              boxShadow: `0 10px 30px ${primaryColor}40`,
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          >
            <FaShieldAlt size={40} color="white" />
          </div>

          <div
            className="position-absolute d-flex align-items-center justify-content-center"
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#28a745",
              borderRadius: "50%",
              top: "-5px",
              right: "-5px",
              border: "3px solid white",
              animation: "bounce-in 1s ease-out 0.5s both",
            }}
          >
            <MdVerifiedUser size={14} color="white" />
          </div>

          <div
            className="position-absolute d-flex align-items-center justify-content-center"
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "#ffc107",
              borderRadius: "50%",
              bottom: "10px",
              left: "-8px",
              border: "2px solid white",
              animation: "bounce-in 1s ease-out 1s both",
            }}
          >
            <FaLock size={10} color="white" />
          </div>

          <div
            className="position-absolute d-flex align-items-center justify-content-center"
            style={{
              width: "26px",
              height: "26px",
              backgroundColor: "#6f42c1",
              borderRadius: "50%",
              bottom: "-5px",
              right: "15px",
              border: "2px solid white",
              animation: "bounce-in 1s ease-out 1.5s both",
            }}
          >
            <FaUserCheck size={12} color="white" />
          </div>
        </div>

        <h3
          className="mb-2"
          style={{
            fontWeight: "700",
            color: "#2c3e50",
            fontSize: "24px",
            position: "relative",
            zIndex: 2,
          }}
        >
          Gettings things ready
        </h3>

        <p
          className="text-muted mb-4"
          style={{
            fontSize: "16px",
            lineHeight: "1.5",
            position: "relative",
            zIndex: 2,
          }}
        >
          We're getting things ready for you. It will take 10-20 seconds...
        </p>

        <div
          className="d-flex align-items-center justify-content-center mb-4"
          style={{ gap: "8px" }}
        >
          {[1, 2, 3, 4].map((step, index) => (
            <div
              key={step}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: primaryColor,
                opacity: 0.3,
                animation: `step-glow 1.5s ease-in-out infinite ${
                  index * 0.2
                }s`,
              }}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default VerifingUserLoader;
