// components/CRM/TaskCard.tsx


import React from "react";
import { useDrag } from "react-dnd";
import { Task } from "./types";

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      className={`card mb-2 border-left-${task.tags[0]?.toLowerCase()} shadow-sm`}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="card-body p-2 pointer">
        <h6 className="card-title mb-1 text-truncate">{task.title}</h6>
        {task.tags.map((tag) => (
          <span key={tag} className={`badge badge-${tag.toLowerCase()} mr-1`}>{tag}</span>
        ))}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="text-muted small font-weight-bold">{task.ticketId}</span>
          <img
            src={`https://i.pravatar.cc/24?u=${task.id}`}
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

export default TaskCard;
