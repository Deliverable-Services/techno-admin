import React from "react";
import { Button } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { primaryColor } from "../utils/constants";
import Restricted from "./Restricted";

interface Props {
  onClick: () => void;
  permissionReq?: string;
}

const NotAvailable = () => <p className="mb-0 text-muted">NA</p>;

const EditButton = (props: Props) => {
  return (
    <div>
      <Restricted to={props.permissionReq} fallBackUI={NotAvailable}>
        <Button
          variant="outline-primary"
          onClick={props.onClick}
          className="d-flex align-items-center edit-btn"
        >
          <AiFillEdit size={16} className="mr-1" />
          Edit
        </Button>
      </Restricted>
    </div>
  );
};

export default EditButton;
