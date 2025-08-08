// column.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { Lead } from "./types";
import LeadCard from "./LeadCard";
import {
  FaCalendarCheck,
  FaTruckMoving,
  FaCheckCircle,
  FaCreditCard,
} from "react-icons/fa";
import { BsDiamond, BsDiamondHalf } from "react-icons/bs";

interface Props {
  title: string;
  status: string;
  leads: Lead[];
  onDrop: (leadId: number, newStatus: string) => void;
  onCardClick: (leadId: number) => void;
}

const statusIcons: { [key: string]: JSX.Element } = {
  NEW: <BsDiamond className="text-orange mr-2" />,
  SCHEDULED: <FaCalendarCheck className="text-secondary mr-2" />,
  EN_ROUTE: <FaTruckMoving className="text-warning mr-2" />,
  IN_PROGRESS: <BsDiamondHalf className="text-blue mr-2" />,
  COMPLETED: <FaCheckCircle className="text-green mr-2" />,
  PAID: <FaCreditCard className="text-blue-dark mr-2" />,
};

const Column: React.FC<Props> = ({
  title,
  status,
  leads,
  onDrop,
  onCardClick,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { id: number }) => {
      onDrop(item.id, status);
    },
  }));

  const Icon = statusIcons[status];

  return (
    <div className="col-md-3 p-2 col-sm-2 ticket-width" ref={drop}>
      <div className="rounded shadow-sm ticket-main-div postiion-relative">
        <div
          className="d-flex align-items-center p-3 gap-3"
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 5,
            backgroundColor: "#fafafa",
          }}
        >
          <h6 className="mb-0 font-weight-bold text-uppercase text-primary text-capitalize d-flex align-items-center">
            {Icon} {title}
          </h6>
          <span className="badge badge-light">{leads?.length} Leads</span>
        </div>

        <div className="p-3" style={{ maxHeight: '600px', overflow: 'auto' }}>
          {leads?.map((lead) => (
            <div key={lead.id} onClick={() => onCardClick(lead.id)}>
              <LeadCard lead={lead} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Column;
