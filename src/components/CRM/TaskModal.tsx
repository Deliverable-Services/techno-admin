// components/CRM/TaskModal.tsx

import React, { useEffect, useRef } from "react";
import { Task } from "./types";

interface Props {
  task: Task;
  onClose: () => void;
  onAddComment: (taskId: string, comment: string) => void;
}

const TaskModal: React.FC<Props> = ({ task, onClose }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const localStorageKey = `draft-comment-${task.id}`; // unique per task

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem(localStorageKey);
    if (editorRef.current && savedContent) {
      editorRef.current.innerText = savedContent;
    }
  }, [localStorageKey]);

  // Auto-save on input
  const handleInput = () => {
    const content = editorRef.current?.innerText || "";
    localStorage.setItem(localStorageKey, content);
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {task.ticketId}: {task.title}
            </h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <p>{task.description}</p>

            <hr />

            <h6 className="pt-3">Comments</h6>
            <ul className="list-unstyled">
              {task.comments.map((c, i) => (
                <li key={i} className="mb-2">
                  <div className="border rounded p-2">{c}</div>
                </li>
              ))}
            </ul>

            {/* ✅ Editor with Auto-Save */}
            <div className="mt-4">
              <label className="text-muted mb-2 d-block">
                Type your message (auto-saved)
              </label>
              <div
                ref={editorRef}
                contentEditable
                className="form-control"
                style={{ minHeight: "100px", whiteSpace: "pre-wrap" }}
                onInput={handleInput}
                suppressContentEditableWarning={true}
              ></div>
              <small className="text-muted d-block mt-1">
                Your message is auto-saved and will appear when you return.
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  );
};

export default TaskModal;
