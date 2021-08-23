import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { AiFillPlusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { IsDesktopContext } from "../context/IsDesktopContext";
interface Props {
  title: string;
  onClick?: () => void;
  totalRecords?: number;
  permissionReq?: string;
}
const PageHeading: React.FC<Props> = ({
  title,
  onClick,
  totalRecords,
  permissionReq,
}) => {
  const isDesktop = useContext(IsDesktopContext);
  return (
    <div className="d-flex justify-content-between py-2">
      <p
        className="font-weight-bolder mb-0 lead"
        style={{ verticalAlign: "center" }}
      >
        {title}
        {totalRecords ? (
          <small style={{ fontSize: 14, marginLeft: 5, opacity: 0.6 }}>
            ({totalRecords})
          </small>
        ) : null}
      </p>

      {onClick && (
        <Button variant="primary" onClick={onClick} size={"sm"}>
          <div className="text-white d-flex align-items-center">
            <AiOutlinePlusSquare size={18} />
            <p className="mb-0 ml-1">Create</p>
          </div>
        </Button>
      )}
    </div>
  );
};

export default PageHeading;
