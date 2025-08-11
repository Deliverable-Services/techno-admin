import React from "react";
import { Button } from "../components/ui/button";
import Restricted from "./Restricted";
import { Hammer } from "../components/ui/icon";
import { Plus } from 'lucide-react';

interface Props {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  totalRecords?: number;
  permissionReq?: string;
  customButton?: React.ReactNode;
  description?: string;
  btnText?: string;
}
const PageHeading: React.FC<Props> = ({
  title,
  icon,
  onClick,
  totalRecords,
  permissionReq,
  customButton,
  description,
  btnText,
}) => {
  return (
    <div className="flex justify-between items-center">
      <p className="flex items-center gap-3">
        {icon && (
          <span className="icon-bg bg-[#0b64fe33] p-[15px] size-[54px] rounded-[50px] flex items-center justify-center">
            <span className="icon-color text-blue">{icon}</span>
          </span>
        )}
        <div>
          <div>
            <span className="page-title text-black text-[22px] leading-8 font-semibold">{title}</span>
            {totalRecords ? (
              <small style={{ fontSize: 14, marginLeft: 5 }}>
                ({totalRecords})
              </small>
            ) : null}
          </div>
          <span className="page-description text-gray-color text-sm font-normal">{description}</span>
        </div>
      </p>

      {onClick && (
        <Restricted to={permissionReq}>
          <Button
            variant="default"
            onClick={onClick}
            size={"sm"}
            style={{
              background: "var(--primary-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <div className="text-white flex items-center">
              <Plus size={18} />
              <p className="mb-0 ml-1">{btnText || "Create"}</p>
            </div>
          </Button>
        </Restricted>
      )}

      {customButton}
    </div>
  );
};

export default PageHeading;
