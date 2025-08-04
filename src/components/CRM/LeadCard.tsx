// leadcard.tsx

import React from "react";
import { useDrag } from "react-dnd";
import { Lead } from "./types";
import {
  FaFlag,
  FaComment,
  FaPaperclip,
  FaCalendarAlt,
  FaRedoAlt,
} from "react-icons/fa";
import moment from "moment";

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

  const formattedDate = (date) => {
    return (
      <>
        {date ? (
          <>
            <span>{date ? moment(date).format("DD MMMM YY") : "NA"}</span>
            &nbsp;<span>({date ? moment(date).format("hh:mm a") : "NA"})</span>
          </>
        ) : (
          <span>NA</span>
        )}
      </>
    );
  };

  return (
    <div
      ref={drag}
      className="card shadow-sm mb-3 border-0"
      style={{
        opacity: isDragging ? 0.5 : 1,
        borderLeft: "4px solid #eb5757",
      }}
    >
      <div className="card-body p-3">
        {/* Top row: Order ID, Lead Source, Priority */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small"> 🔗 #{lead.id || "ORD-456"}</span>

          <span
            className="badge badge-light px-2 py-1 text-dark"
            style={{
              backgroundColor: "#e6f4ea", // light green bg
              fontSize: "12px",
              borderRadius: "12px",
            }}
          >
            {lead.page || "Source"}
          </span>

          {/* <span className="text-danger small d-flex align-items-center">
            <FaFlag className="mr-1" style={{ fontSize: 12 }} />
            {lead.priority || "Urgent"}
          </span> */}
        </div>

        {/* Title */}
        <h6 className="font-weight-bold mb-1 text-dark">
          {lead.name || "New microdose website"}
        </h6>

        {/* Message with bone/rotation icon */}
        <p
          className="text-muted small mb-2 d-flex align-items-center"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            lineHeight: "1.4",
            minHeight: "2.8em", // reserve height for 2 lines
          }}
        >
          <FaRedoAlt className="mr-2 text-secondary" />
          {lead.message || "Landing page for microdose campaign and lead gen."}
        </p>

        {/* Date and Time */}
        <div className="d-inline-flex align-items-center mb-3">
          <span
            className="small px-2 py-1"
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "12px",
              fontSize: "11px",
            }}
          >
            <FaCalendarAlt className="mr-1 text-muted" />
            Created At:{" "}
            <strong className="text-dark">
              {formattedDate(lead.created_at) || "July 29, ‘24 3:00 PM"}
            </strong>
          </span>
        </div>

        {/* Bottom Row: Avatar · Comment Count · Attachment Count */}
        <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
          {/* Assignee Image */}
          <img
            src={String(lead.assignee) || `https://i.pravatar.cc/24?u=${lead.id}`}
            alt="user"
            className="rounded-circle crm-user-img"
            width={24}
            height={24}
          />

          {/* Comment & Attachments */}
          <div className="d-flex align-items-center text-muted small">
            <div className="d-flex align-items-center mr-3">
              <FaComment className="mr-1" />
              {lead.comments || 0}
            </div>
            <div className="d-flex align-items-center">
              <FaPaperclip className="mr-1" />
              {lead.attachments || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
