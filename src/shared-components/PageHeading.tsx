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
    <div className="d-flex justify-content-between pb-2">
      <p
        className="font-weight-bolder mb-0 lead d-flex align-items-center gap-3"
        style={{ verticalAlign: "center" }}
      >
        {icon}
        {title}
        {totalRecords ? (
          <small style={{ fontSize: 14, marginLeft: 5, opacity: 0.6 }}>
            ({totalRecords})
          </small>
        ) : null}
      </p>

      {onClick && (
        <Restricted to={permissionReq}>
          <Button variant="primary" onClick={onClick} size={"sm"} style={{ background: '#303030', borderColor: '#303030' }}>
            <div className="text-white d-flex align-items-center">
              <AiOutlinePlus size={18} />
              <p className="mb-0 ml-1">Create</p>
            </div>
          </Button>
        </Restricted>
      )}
    </div>
  );
};

export default PageHeading;
