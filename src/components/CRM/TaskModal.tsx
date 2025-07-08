import React, { useState } from "react";
import { Task } from "./types";

interface Props {
  task: Task;
  onClose: () => void;
  onAddComment: (taskId: string, comment: string) => void;
}

const TaskModal: React.FC<Props> = ({ task, onClose, onAddComment }) => {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onAddComment(task.id, draft.trim());
    setDraft("");
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{task.ticketId}: {task.title}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{task.description}</p>

            <hr/>

            <h6 className="pt-3">Comments</h6>
            <ul className="list-unstyled">
              {task.comments.map((c, i) => (
                <li key={i} className="mb-2">
                  <div className="border rounded p-2">{c}</div>
                </li>
              ))}
            </ul>

            <div className="input-group">
                <textarea className="form-control"
                 id="exampleFormControlTextarea1"
                 placeholder="Write a comment…"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                ></textarea>
        
           
            </div>
               <div className="input-group-append mt-3 text-right justify-end">
                <button className="btn btn-primary" onClick={submit}>
                  Post
                </button>
              </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  );
};

export default TaskModal;