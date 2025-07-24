// column.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { Lead } from "./types";
import LeadCard from "./LeadCard";

// React Icons
import { FaCalendarCheck, FaTruckMoving, FaSpinner, FaCheckCircle, FaCreditCard,  } from "react-icons/fa";
import { BsDiamond, BsDiamondHalf } from "react-icons/bs";



interface Props {
  title: string;
  status: string;
  leads: Lead[];
  onDrop: (leadId: number, newStatus: string) => void;
  onCardClick: (leadId: number) => void;
}

// Icon mapping by status
const statusIcons: { [key: string]: JSX.Element } = {
  NEW: <BsDiamond   className="text-orange mr-2"/>,
  SCHEDULED: <FaCalendarCheck className="text-secondary mr-2" />,
  EN_ROUTE: <FaTruckMoving className="text-warning mr-2" />,
  IN_PROGRESS: <BsDiamondHalf className="text-blue mr-2" />,
  COMPLETED: <FaCheckCircle className="text-green mr-2" />,
  PAID: <FaCreditCard className="text-blue-dark mr-2" />,
};

const Column: React.FC<Props> = ({ title, status, leads, onDrop, onCardClick }) => {
  const [, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { id: number }) => {
      onDrop(item.id, status);
    },
  }));

  const Icon = statusIcons[status];

  return (
    <div className="col-md-3 p-2 col-sm-2" ref={drop}>
      <div className="rounded shadow-sm p-3 ticket-main-div">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 font-weight-bold text-uppercase text-primary text-capitalize d-flex align-items-center">
            {Icon} {title}
          </h6>
          <span className="badge badge-light">{leads?.length}</span>
        </div>
        {leads?.map((lead) => (
          <div key={lead.id} onClick={() => onCardClick(lead.id)}>
            <LeadCard lead={lead} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
