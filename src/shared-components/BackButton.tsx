import React from "react";
import { Button } from "react-bootstrap";
import { BiArrowFromRight } from "react-icons/bi";
import { useHistory } from "react-router-dom";
interface Props {
  title: string;
}
const BackButton: React.FC<Props> = ({ title }) => {
  const history = useHistory();
  const _onBackClick = () => history.goBack();
  return (
    <>
      <div  className="d-flex justify-content-between py-2 px-0">
        {/* <p className="font-weight-bold text-capitalize lead mb-0">{title}</p> */}
        <Button variant="primary" onClick={_onBackClick} size="sm">
          <div className="text-white d-flex align-items-center">
            <BiArrowFromRight size={18} /> <p className="mb-0">Back</p>
          </div>
        </Button>
      </div>
  
    </>
  );
};

export default BackButton;
