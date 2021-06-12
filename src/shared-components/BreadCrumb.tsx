import React from "react";

interface Props {
  onFilterChange: (idx: string, value: any) => void;
  title: string;
  dataLength: number;
  currentValue: string;
  value: string;
  idx: string;
  isLast?: boolean;
}

const BreadCrumb = ({
  onFilterChange,
  title,
  dataLength,
  currentValue,
  value,
  idx,
  isLast = false,
}: Props) => {
  return (
    <>
      <span
        onClick={() => onFilterChange(idx, value)}
        className={`${currentValue === value ? "text-primary" : "text-muted"}`}
        style={{
          cursor: "pointer",
        }}
      >
        {title} {currentValue === value ? `(${dataLength})` : ""}
      </span>
      {!isLast && (
        <span className="mx-2" style={{ opacity: 0.2 }}>
          |
        </span>
      )}
    </>
  );
};

export default BreadCrumb;
