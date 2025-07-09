// components/CRM/Column.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { Task } from "./types";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  status: string;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: string) => void;
  onCardClick: (taskId: string) => void;
}

const Column: React.FC<Props> = ({ title, status, tasks, onDrop, onCardClick }) => {
  const [, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { id: string }) => {
      onDrop(item.id, status);
    },
  }));

  return (
    <div className="col-md-3 p-2" ref={drop}>
      <div className="bg-white rounded shadow-sm p-2">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 font-weight-bold text-uppercase text-secondary">{title}</h6>
          <span className="badge badge-light">{tasks.length}</span>
        </div>
        {tasks.map((task) => (
          <div key={task.id} onClick={() => onCardClick(task.id)}>
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;

