import React from "react";
import { Button } from "../components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import Restricted from "./Restricted";
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
    <div className="d-flex justify-content-between align-items-center">
      <p className="d-flex align-items-center gap-12">
        {icon && (
          <span className="icon-bg">
            <span className="icon-color">{icon}</span>
          </span>
        )}
        <div>
          <div>
            <span className="page-title">{title}</span>
            {totalRecords ? (
              <small style={{ fontSize: 14, marginLeft: 5 }}>
                ({totalRecords})
              </small>
            ) : null}
          </div>
          <span className="page-description">{description}</span>
        </div>
      </p>

      {onClick && (
        <Restricted to={permissionReq}>
          <Button
            variant="primary"
            onClick={onClick}
            size={"sm"}
            style={{
              background: "var(--primary-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <div className="text-white d-flex align-items-center">
              <AiOutlinePlus size={18} />
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
