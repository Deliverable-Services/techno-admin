// components/CRM/CRMBoard.tsx

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import { initialTasks } from "./data";
import { Task, Comment } from "./types";
import "./crm-board.css";
import TaskDrawer from "./TaskDrawer";

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
                    <div className="crm-header px-3">
                        <h2 className="crm-title">CRM</h2>
                        {/* <div className="crm-breadcrumb">Projects / Beyond Gravity</div> */}

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
                <TaskDrawer
                    task={selectedTask}
                    onClose={handleClose}
                    onAddComment={(id, comment) => {
                        setTasks(prev =>
                            prev.map(t =>
                                t.id === id ? { ...t, comments: [...t.comments, comment] } : t
                            )
                        );
                    }}
                    onUpdateComment={(id, commentId, newText) => {
                        setTasks(prev =>
                            prev.map(t =>
                                t.id === id
                                    ? {
                                        ...t,
                                        comments: t.comments.map(c =>
                                            c.id === commentId ? { ...c, text: newText } : c
                                        ),
                                    }
                                    : t
                            )
                        );
                    }}
                    onDeleteComment={(id, commentId) => {
                        setTasks(prev =>
                            prev.map(t =>
                                t.id === id
                                    ? { ...t, comments: t.comments.filter(c => c.id !== commentId) }
                                    : t
                            )
                        );
                    }}
                />
            )}

        </>
    );
};

export default CRMBoard;
