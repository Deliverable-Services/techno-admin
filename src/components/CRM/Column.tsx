// column.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { Lead } from "./types";
import LeadCard from "./LeadCard";
import {
  Calendar,
  Truck,
  CheckCircle,
  CreditCard,
  Circle,
  CircleDot,
} from "../../components/ui/icon";

interface Props {
  title: string;
  status: string;
  leads: Lead[];
  onDrop: (leadId: number, newStatus: string) => void;
  onCardClick: (leadId: number) => void;
}

const statusIcons: { [key: string]: JSX.Element } = {
  NEW: <Circle className="text-orange mr-2" />,
  SCHEDULED: <Calendar className="text-secondary mr-2" />,
  EN_ROUTE: <Truck className="text-warning mr-2" />,
  IN_PROGRESS: <CircleDot className="text-blue mr-2" />,
  COMPLETED: <CheckCircle className="text-green mr-2" />,
  PAID: <CreditCard className="text-blue-dark mr-2" />,
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
    <div className="p-2 ticket-width" ref={drop}>
      <div className="rounded shadow-sm ticket-main-div relative">
        <div
          className="flex items-center p-3 gap-3 sticky top-0 z-50 bg-[#fafafa]"
        >
          <h6 className="mb-0 font-bold text-primary capitalize flex items-center">
            {Icon} {title}
          </h6>
          <span className="badge badge-light">{leads?.length} Leads</span>
        </div>

        <div
          className="p-3 overflow-auto"
          style={{ maxHeight: "calc(100vh - 280px)" }}
        >
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
