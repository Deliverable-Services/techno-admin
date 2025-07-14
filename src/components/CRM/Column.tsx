import React from "react";
import { useDrop } from "react-dnd";
import { Lead } from "./types";
import LeadCard from "./LeadCard";

interface Props {
  title: string;
  status: string;
  leads: Lead[];
  onDrop: (leadId: number, newStatus: string) => void;
  onCardClick: (leadId: number) => void;
}

const Column: React.FC<Props> = ({ title, status, leads, onDrop, onCardClick }) => {
  const [, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { id: number }) => {
      onDrop(item.id, status);
    },
  }));

  return (
    <div className="col-md-2 p-2" ref={drop}>
      <div className="bg-white rounded shadow-sm p-2">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 font-weight-bold text-uppercase text-secondary">{title}</h6>
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

