import React from "react";

interface Props {
  onClick: (id) => void;
  id: string | number;
  title: string;
}

const TableLink = (props: Props) => {
  if (!props.id) return <p className="text-muted m-0">NA</p>;
  return (
    <p
      className="text-primary m-0"
      style={{ cursor: "pointer" }}
      onClick={() => props.onClick(props.id)}
    >
      {props.title || props.id}
    </p>
  );
};

export default TableLink;
