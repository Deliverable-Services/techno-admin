import React from "react";

interface Props {
  address: any;
}

const AddressCard = ({ address }: Props) => {
  return (
    <div className="d-flex justify-content-between p-2 flex-column">
      <div className="">
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
