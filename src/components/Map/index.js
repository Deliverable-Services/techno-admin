import React from "react";

const TrackingMap = ({ order }) => {
  const { address: userAddress } = order || {};
  if (!userAddress)
    return (
      <h3 style={{ width: "100%", textAlign: "center", marginTop: 10 }}>
        No address found
      </h3>
    );
  return (
    <div
      style={{
        height: 350,
        width: "100%",
        borderRadius: 8,
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
      }}
    >
      Map preview disabled
    </div>
  );
};

export default TrackingMap;
