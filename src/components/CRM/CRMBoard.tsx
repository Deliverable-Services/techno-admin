// components/CRM/CRMBoard.tsx
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { initialTasks } from "./data";
import { Task } from "./types";
import "./crm-board.css";

const CRMBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDrop = (taskId: string, newStatus: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleCardClick = (taskId: string) => setSelectedId(taskId);
  const handleClose = () => setSelectedId(null);
  const handleAddComment = (taskId: string, comment: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
      )
    );
  };

  const selectedTask = tasks.find(t => t.id === selectedId);

  const statusMap: { [key in string]: string } = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    DONE: "Done",
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="crm-container">
          <div className="crm-header">
            <div className="crm-breadcrumb">Projects / Beyond Gravity</div>
            <h2 className="crm-title">Board</h2>
            <div className="crm-users">
              <img src="https://i.pravatar.cc/32?img=1" alt="" className="crm-avatar" />
              <img src="https://i.pravatar.cc/32?img=2" alt="" className="crm-avatar" />
              <img src="https://i.pravatar.cc/32?img=3" alt="" className="crm-avatar" />
              <span className="crm-avatar crm-avatar-extra">+3</span>
            </div>
          </div>

          <div className="row no-gutters crm-board">
            {Object.keys(statusMap).map((key) => {
              const typedKey = key as string;
              return (
                <Column
                  key={typedKey}
                  title={statusMap[typedKey]}
                  status={typedKey}
                  tasks={tasks.filter((task) => task.status === typedKey)}
                  onDrop={handleDrop}
                  onCardClick={handleCardClick}
                />
              );
            })}
          </div>
        </div>
      </DndProvider>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleClose}
          onAddComment={handleAddComment}
        />
      )}
    </>
  );
};

export default CRMBoard;
