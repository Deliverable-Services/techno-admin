import React from "react";
import { Button } from "../components/ui/button";
import Restricted from "./Restricted";
import { Pencil } from 'lucide-react';



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

          onClick={props.onClick}
          className="flex items-center edit-btn gap-0 p-0 m-0 bg-transparent"
        >
          <Pencil className="mr-1 !w-[12px] !h-[12px] !underline-offset-1 !underline" />
          Edit

        </Button>
      </Restricted>
    </div>
  );
};

export default EditButton;
