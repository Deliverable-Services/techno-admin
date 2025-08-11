import React from "react";
import { Button } from "../components/ui/button";
import Restricted from "./Restricted";
import { Hammer } from "../components/ui/icon";

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
          variant="outline"
          onClick={props.onClick}
          className="flex items-center"
        >
          <Hammer size={16} className="mr-1" />
          View
        </Button>
      </Restricted>
    </div>
  );
};

export default ViewButton;
