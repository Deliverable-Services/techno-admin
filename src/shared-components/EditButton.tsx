import React from "react";
import { Button } from "../components/ui/button";
import { AiFillEdit } from "react-icons/ai";
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
          className="flex items-center edit-btn"
        >
          <AiFillEdit size={16} className="mr-1" />
          Edit
        </Button>
      </Restricted>
    </div>
  );
};

export default EditButton;
