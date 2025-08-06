import React from "react";
import { Button } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import Restricted from "./Restricted";
interface Props {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  totalRecords?: number;
  permissionReq?: string;
}
const PageHeading: React.FC<Props> = ({
  title,
  icon,
  onClick,
  totalRecords,
  permissionReq,
}) => {
  return (
    <div className="d-flex justify-content-between pb-3">
      <p className="d-flex align-items-center gap-3">
        {icon}
        <span className="page-title">{title}</span>
        {totalRecords ? (
          <small style={{ fontSize: 14, marginLeft: 5, opacity: 0.6 }}>
            ({totalRecords})
          </small>
        ) : null}
      </p>

      {onClick && (
        <Restricted to={permissionReq}>
          <Button
            variant="primary"
            className="d-flex align-items-center"
            onClick={onClick}
            size={"sm"}
          >
            <AiOutlinePlus size={18} />
            <p className="mb-0 ml-1">Create</p>
          </Button>
        </Restricted>
      )}
    </div>
  );
};

export default PageHeading;
