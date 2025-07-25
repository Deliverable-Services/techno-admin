import React from "react";
import { useDrag } from "react-dnd";
import { Lead } from "./types";

interface Props {
  lead: Lead;
}

const LeadCard: React.FC<Props> = ({ lead }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: lead.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      className={`card mb-2 border-left-billing shadow-sm`}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="card-body p-2 pointer">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="card-title mb-1 text-truncate">{lead.name}</h6>
          <span className={`badge badge-billing`}>{lead.page}</span>
        </div>
        <div className="d-flex justify-content-between align-items-end mt-2 flex-wrap">
          <div className="d-flex flex-column">
            <span className="text-muted small font-weight-bold">
              {lead.phone}
            </span>
            <span
              className="text-muted small font-weight-bold w-250px"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lead.email}
            </span>
          </div>
          <img
            src={`https://i.pravatar.cc/24?u=${lead.id}`}
            alt="assignee"
            className="rounded-circle user-image"
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
