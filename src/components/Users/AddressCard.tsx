import React from "react";
import UserMap from "../../shared-components/UserMap";

interface Props {
  address: any;
}

const AddressCard = ({ address }: Props) => {
  return (
    <div className="d-flex justify-content-between flex-column ">
      {address.lat && address.lng ? (
        <UserMap userAddress={address} />
      ) : (
        <div
          style={{ minHeight: "250px" }}
          className="d-flex align-items-center justify-content-center"
        >
          <p className=" text-muted">
            User latitude and longitude are not available
          </p>
        </div>
      )}
      <div className=" p-2">
        <span className="text-black font-weight-bold">{address.name}</span>
        <br />
        <span className="text-muted">{address.address},</span>
        <br />
        <span className="text-muted">{address.city},</span>
        <span className="text-muted">{address.state}</span>
        <br />
        <span className="text-muted">{address.pincode}</span>
      </div>
    </div>
  );
};

export default AddressCard;
