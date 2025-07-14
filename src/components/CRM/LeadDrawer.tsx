import React, { useEffect, useRef, useState } from "react";
import { Comment, Lead } from "./types";
import { FcProcess } from "react-icons/fc";
import { MdCreate } from "react-icons/md";
import "./lead-drawer.css";
import { formatTimestamp } from "../../utils/utitlity";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "leads";
interface Props {
  lead: Lead;
  onClose: () => void;
}

const LeadDrawer: React.FC<Props> = ({
  lead,
  onClose,
}) => {
  const history = useHistory();
  const editorRef = useRef<HTMLDivElement>(null);
  const localStorageKey = `draft-comment-${lead.id}`;
  const loggedInUser = useUserProfileStore((state) => state.user);
  const [imageData, setImageData] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [`${key}/${lead.id}`, ,],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  // console.log({ data });

  useEffect(() => {
    if (data) setComments(data.comments);
  }, [data]);

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

  const handleCommentSubmit = async () => {
    const text = editorRef.current?.innerText.trim() || "";
    if (!text && !imageData) return;
    const username = loggedInUser?.name || "User Name";
    const avatar =
      localStorage.getItem("avatar") || "https://i.pravatar.cc/40?u=default";

    const response = await API.post(`${key}/${lead.id}/comment`, {
      comment: text,
    });
    if (response.status !== 201) {
      showErrorToast("Error making a comment");
    }

    const newComment = {
      id: Date.now().toString(),
      comment: text,
      image: imageData || undefined,
      username,
      avatar,
      user_id: loggedInUser.id,
      lead_id: lead.id,
    };
    setComments((prev) => [...prev, newComment]);

    editorRef.current!.innerText = "";
    setImageData(null);
    localStorage.removeItem(localStorageKey);
  };

  const handleCommentUpdate = async (
    leadId: number,
    commentId: string,
    editText: string,
    comment: Comment
  ) => {
    if (!editText && !imageData) return;

    const response = await API.put(`${key}/${leadId}/comment/${commentId}`, {
      comment: editText,
    });
    if (response.status === 200) {
      showMsgToast("Comment updated successfully");
      comment.comment = editText;
      setComments((prev) =>
        prev.map((t) => (t.id === commentId ? comment : t))
      );
    } else {
      showErrorToast("Error updating comment");
    }

    setImageData(null);
  };

  const handleCommentDelete = async (leadId: number, commentId: string) => {
    if (!commentId) return;

    const response = await API.delete(`${key}/${leadId}/comment/${commentId}`);
    if (response.status === 204) {
      showMsgToast("Comment deleted successfully");
      setComments((prev) => prev.filter((t) => t.id !== commentId));
    } else {
      showErrorToast("Error deleting comment");
    }
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
              {/* <p>
                <strong>Message :</strong>&nbsp;{lead.message}
              </p> */}
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
              {comments?.map((comment) => (
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
                          handleCommentUpdate(
                            lead.id,
                            comment.id,
                            editText,
                            comment
                          );
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
                          {/* <img
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
                          /> */}
                          <div
                            className="d-flex align-items-center justify-content-center bg-primary"
                            style={{
                              height: 30,
                              width: 30,
                              borderRadius: "50%",
                            }}
                          >
                            <p className="mb-0 text-white display-5">
                              {comment.user?.name?.charAt(0).toUpperCase() ||
                                " "}
                            </p>
                          </div>
                          <strong>{comment.user?.name}</strong>
                        </div>
                        <small className="text-muted">
                          {new Date(Number(comment.id)).toLocaleString()}
                        </small>
                      </div>
                      <p>{comment.comment}</p>
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
                            setEditText(comment.comment);
                          }}
                        >
                          Edit
                        </span>
                        <span
                          onClick={() =>
                            handleCommentDelete(lead.id, comment.id)
                          }
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
