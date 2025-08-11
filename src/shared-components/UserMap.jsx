import React from "react";

const UserMap = ({ userAddress }) => {
  if (!userAddress?.lng && !userAddress?.lat) return <p>No Address found</p>;
  return (
    <div
      style={{
        height: 250,
        width: "98%",
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

export default UserMap;
