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
        bg: "#f8d7da",
        color: "red",
      };

    if (variant === "warning")
      return {
        bg: "#fff3cd",
        color: "#ccb81f",
      };

    if (variant === "success")
      return {
        bg: "#d4edda",
        color: "green",
      };

    if (variant === "primary")
      return {
        bg: "#cce5ff",
        color: "blue",
      };
  };

  return (
    <span
      style={{
        backgroundColor: setBgAndColor().bg,
        color: setBgAndColor().color,
        fontSize,
        padding: "3px 6px",
        whiteSpace: "nowrap",
      }}
      className="text-capitalize rounded"
    >
      {title}
    </span>
  );
};

export default CustomBadge;
