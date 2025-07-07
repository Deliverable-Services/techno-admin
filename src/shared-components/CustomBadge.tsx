import React from "react";

interface Props {
  variant: "success" | "danger" | "warning" | "primary";
  title: string;
  fontSize?: 14 | 16 | 18 | 20;
}

const CustomBadge = ({ variant, title, fontSize = 14 }: Props) => {
  const setBgAndColor: () => { bg: string; color: string } = () => {
    if (variant === "danger")
      return {
        bg: "#f52c3d",
        color: "red",
      };

    if (variant === "warning")
      return {
        bg: "#f2bf18",
        color: "#ccb81f",
      };

    if (variant === "success")
      return {
        bg: "#20e34d",
        color: "green",
      };

    if (variant === "primary")
      return {
        bg: "#137ae8",
        color: "blue",
      };
  };

  return (
    <span
      style={{
       
      
        fontSize,
        padding: "3px 6px",
        whiteSpace: "nowrap",
      }}
      className="text-capitalize rounded indicator-box"
    >
      <span className="status-indicator" style={{ backgroundColor: setBgAndColor().bg,}}></span>
      {title}
    </span>
  );
};

export default CustomBadge;
