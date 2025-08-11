import React from "react";
import { Button } from "../components/ui/button";
import Restricted from "./Restricted";
import { Hammer } from "../components/ui/icon";

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
          variant="outline"
          onClick={props.onClick}
          className="flex items-center edit-btn"
        >
          <Hammer size={16} className="mr-1" />
          Edit
        </Button>
      </Restricted>
    </div>
  );
};

export default EditButton;
