import React from "react";
import { Button } from "react-bootstrap";
import { AiFillPlusSquare } from "react-icons/ai";
interface Props {
  title: string;
  onClick?: () => void;
  totalRecords: number;
}
const PageHeading: React.FC<Props> = ({ title, onClick, totalRecords }) => {
  return (
    <div className="d-flex justify-content-between py-2">
      <h2 className="font-weight-bolder">
        {title}
        {totalRecords ? (
          <small style={{ fontSize: 14, marginLeft: 5, opacity: 0.6 }}>
            ({totalRecords})
          </small>
        ) : null}
      </h2>

      {onClick && (
        <Button variant="primary" onClick={onClick}>
          <div className="text-white">
            <AiFillPlusSquare size={25} /> <b>Create</b>
          </div>
        </Button>
      )}
    </div>
  );
};

export default PageHeading;
