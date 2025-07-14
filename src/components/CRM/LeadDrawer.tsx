import React, { useEffect, useRef, useState } from "react";
import { Comment, Lead } from "./types";
import { FcProcess } from "react-icons/fc";
import { MdCreate } from "react-icons/md";
import "./lead-drawer.css";
import { formatTimestamp } from "../../utils/utitlity";
import useUserProfileStore from "../../hooks/useUserProfileStore";

interface Props {
  lead: Lead;
  onClose: () => void;
  onAddComment: (leadId: number, comment: Comment) => void;
  onUpdateComment: (leadId: number, commentId: string, newText: string) => void;
  onDeleteComment: (leadId: number, commentId: string) => void;
}

const LeadDrawer: React.FC<Props> = ({
  lead,
  onClose,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const localStorageKey = `draft-comment-${lead.id}`;
  const loggedInUser = useUserProfileStore((state) => state.user);
  const [imageData, setImageData] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    const savedContent = localStorage.getItem(localStorageKey);
    if (editorRef.current && savedContent) {
      editorRef.current.innerText = savedContent;
    }
  }, [localStorageKey]);

  const handleInput = () => {
    const content = editorRef.current?.innerText || "";
    localStorage.setItem(localStorageKey, content);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCommentSubmit = () => {
    const text = editorRef.current?.innerText.trim() || "";
    if (!text && !imageData) return;
    const username = loggedInUser?.name || "User Name";
    const avatar =
      localStorage.getItem("avatar") || "https://i.pravatar.cc/40?u=default";

    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      image: imageData || undefined,
      username,
      avatar,
    };

    onAddComment(lead.id, newComment);
    editorRef.current!.innerText = "";
    setImageData(null);
    localStorage.removeItem(localStorageKey);
  };

  return (
    <>
      <div className="task-drawer-overlay" onClick={onClose} />
      <div className="task-drawer slide-in">
        <div className="drawer-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {lead.name} #{lead.id}
          </h5>
          <button className="close-drawer" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-scroll-content">
            <div className="mb-4 ticket-drawer-status">
              {lead.message && (
                <div className="mb-3">
                  <h6 className="text-secondary">Description</h6>
                  <p>{lead.message}</p>
                </div>
              )}
              <p>
                <strong>Created by:</strong>&nbsp;{lead.name}
              </p>
              <p>
                <strong>Email id:</strong>&nbsp;{lead.email}
              </p>
              <p>
                <strong>Phone no:</strong>&nbsp;{lead.phone}
              </p>
              <p>
                <strong>Zipcode:</strong>&nbsp;{lead.zipcode}
              </p>
              <p>
                <strong>Lead origin page:</strong>&nbsp;{lead.page}
              </p>
              <p>
                <strong>Created at:</strong>&nbsp;
                {formatTimestamp(lead.created_at)}
              </p>
              <p>
                <strong>Status:</strong>&nbsp;{lead.status}
              </p>
              <p><strong>Message :</strong>&nbsp;{lead.message}</p>
              {/* <p><strong>Priority:</strong> Medium</p> */}
            </div>

            <div className="mb-4 activies">
              <h6 className="text-secondary">Activity</h6>
              <ul className="list-unstyled activity-log">
                <li>
                  <MdCreate /> Ticket created by {lead.name}
                </li>
                <li>
                  <FcProcess /> Status changed to {lead.status}
                </li>
              </ul>
            </div>

            <div className="comments-box">
              {lead.comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-3 p-2 border rounded bg-light comments-div"
                >
                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button
                        className="btn btn-sm btn-success mr-2"
                        onClick={() => {
                          onUpdateComment(lead.id, comment.id, editText);
                          setEditingCommentId(null);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              comment.avatar ||
                              "https://i.pravatar.cc/40?u=default"
                            }
                            alt="avatar"
                            className="rounded-circle mr-2"
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                            }}
                          />
                          <strong>{comment.username}</strong>
                        </div>
                        <small className="text-muted">
                          {new Date(Number(comment.id)).toLocaleString()}
                        </small>
                      </div>
                      <p>{comment.text}</p>
                      {comment.image && (
                        <img
                          src={comment.image}
                          alt="attachment"
                          className="img-fluid"
                        />
                      )}
                      <div className="d-flex justify-content-end py-1">
                        <span
                          className="mr-2"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditText(comment.text);
                          }}
                        >
                          Edit
                        </span>
                        <span
                          onClick={() => onDeleteComment(lead.id, comment.id)}
                        >
                          Delete
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="drawer-footer">
            <div className="mb-1">
              <label className="mb-1">Write your comment</label>
              <div
                ref={editorRef}
                contentEditable
                className="form-control mb-2 comment-editor"
                onInput={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
              />
              {imageData && (
                <div className="mb-2">
                  <img src={imageData} alt="preview" className="img-fluid" />
                </div>
              )}
              <div className="d-flex justify-content-between">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-control-file w-75"
                />
                <button
                  className="btn btn-primary btn-sm ml-2"
                  onClick={handleCommentSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDrawer;
