import React from "react";
import { Button } from "react-bootstrap";
import { AiFillEye } from "react-icons/ai";
import Restricted from "./Restricted";

interface Props {
  onClick: () => void;
  permissionReq?: string;
}

const NotAvailable = () => <p className="mb-0 text-muted">NA</p>;

const ViewButton = (props: Props) => {
  return (
    <div>
      <Restricted to={props.permissionReq} fallBackUI={NotAvailable}>
        <Button
          variant="outline-primary"
          onClick={props.onClick}
          className="d-flex align-items-center"
        >
          <AiFillEye size={16} className="mr-1" />
          View
        </Button>
      </Restricted>
    </div>
  );
};

export default ViewButton;
