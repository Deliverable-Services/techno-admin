import React from "react";
import { Badge } from "react-bootstrap";
import CustomBadge from "./CustomBadge";

interface Props {
  value: any;
}

const IsActiveBadge = ({ value }: Props) => {
  return (
    <CustomBadge
      title={parseInt(value) === 1 ? "Yes" : "No"}
      variant={parseInt(value) === 1 ? "success" : "danger"}
    />
  );
  // return (
  //     <Badge variant={parseInt(value) === 1 ? "primary" : "danger"}>
  //         {
  //             parseInt(value) == 1 ? "Yes" : "No"
  //         }
  //     </Badge>
  // )
};

export default IsActiveBadge;
