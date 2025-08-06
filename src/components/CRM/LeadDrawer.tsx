import React, { useEffect, useRef, useState } from "react";
import { Comment, Lead } from "./types";
import Select, { components } from "react-select";
import { FcProcess } from "react-icons/fc";
import { MdCreate } from "react-icons/md";
import "./lead-drawer.css";
import { formatTimestamp } from "../../utils/utitlity";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { RiChatFollowUpFill } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { FaTrash, FaFlag } from "react-icons/fa"; // Add at the top with other imports
import { IoIosArrowRoundBack } from "react-icons/io";

import { Button } from "react-bootstrap";
import {
  FaComments,
  FaBell,
  FaStickyNote,
  FaPhone,
  FaPencilAlt,
  FaCheck,
} from "react-icons/fa";
import { BsEnvelope, BsBellFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { queryClient } from "../../utils/queryClient";
import moment from "moment";
import { User } from "../../types/interface";
import { Email } from "@material-ui/icons";

const key = "leads";

const updateLeadData = ({ id, data }: any) => {
  return API.put(`${key}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};
interface Props {
  lead: Lead;
  onClose: () => void;
}

const LeadDrawer: React.FC<Props> = ({ lead, onClose }) => {
  const history = useHistory();
  const editorRef = useRef<HTMLDivElement>(null);
  const localStorageKey = `draft-comment-${lead.id}`;
  const loggedInUser = useUserProfileStore((state) => state.user);
  const [imageData, setImageData] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<User>();
  const [editText, setEditText] = useState<string>("");

  const [details, setDetails] = useState({
    name: lead?.name || "Balkan Brothers",
    city: lead?.city || "Paris",
    zipcode: lead?.zipcode || "75010",
    country: lead?.country || "France",
    full_address: lead?.full_address || "174 Quai de Jemmas",
    website: lead?.website || "bb.agency",
    contactName: lead?.name || "John Doe",
    gender: lead?.gender || "Male",
    email: lead?.email || "john@example.com",
    phone: lead?.phone || "+1234567890",
  });

  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});

  const { data: membersList } = useQuery<any>(
    [`users?role=admin&perPage=1000`, ,],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const handleChange = (field: string, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field: string) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const saveField = (field: string) => {
    toggleEdit(field);
    const primaryKeys = ["name", "email", "phone"];

    const data = {
      name: details.name,
      email: details.email,
      phone: details.phone,
      ...(primaryKeys.includes(field) ? {} : { [field]: details[field] }),
    };
    mutate({ id: lead.id, data });
  };

  const { mutate } = useMutation(updateLeadData, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(key);
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data } = useQuery<any>([`${key}/${lead.id}`], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

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
    const text = editText.trim() || "";
    if (!text && !imageData) return;
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
      username: loggedInUser?.name || "User Name",
      avatar,
      user_id: loggedInUser.id,
      lead_id: lead.id,
    };
    setComments((prev) => [...prev, newComment]);

    setEditText("");
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

  const [notes, setNotes] = useState<{ text: string; timestamp: string }[]>([]);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const timestamp = new Date().toLocaleString();
    setNotes((prev) => [...prev, { text: newNote.trim(), timestamp }]);
    setNewNote("");
  };

  const handleDeleteNote = (index: number) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const formattedDate = (date) => {
    return (
      <>
        {date ? (
          <>
            <span>{date ? moment(date).format("DD/MM/YY") : "NA"}</span>
            &nbsp;<span>({date ? moment(date).format("hh:mm a") : "NA"})</span>
          </>
        ) : (
          <span>NA</span>
        )}
      </>
    );
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: 10,
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: 4,
    }),
  };

  const assigneeOptions = membersList?.data?.map((member) => ({
    value: member.id,
    label: member.name,
    ...member,
  }));

  const handleSetSelectedAssignee = async (option) => {
    const assignee = assigneeOptions.find((o) => o.id === option.value);
    if (assignee) {
      try {
        await API.post(
          `${key}/${lead.id}/assign-member`,
          { member_id: assignee.id },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        handleApiError(error, history);
      }
      setSelectedAssignee(assignee);
    }
  };

  return (
    <>
      <div className="task-drawer-overlay" onClick={onClose} />
      <div className="task-drawer slide-in">
        <div className="drawer-header d-flex justify-content-between align-items-center mb-0 pb-0">
          <div className="close-drawer pointer">
            <IoIosArrowRoundBack />
            <button onClick={onClose}>Back</button>
          </div>
        </div>

        <div className="lead-details">
          <div className="d-flex align-items-center p-3 border-bottom ">
            <div className="d-flex align-items-center w-100">
              <div className="company-logo global-card mr-3">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/008/214/517/non_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg"
                  alt="Company Logo"
                  className="rounded p-1"
                  style={{ width: 75, height: 75 }}
                />
              </div>
              <div className="w-100">
                <div className="d-flex gap-3 align-items-center gap-5">
                  <h5 className="mb-2 font-weight-bold text-capitalize text-30px">
                    {lead.name}
                  </h5>
                  {/* <span className="text-danger small d-flex align-items-center">
                    <FaFlag className="mr-1" style={{ fontSize: 17 }} />
                    {lead.priority || "Urgent"}
                  </span> */}
                </div>
                <div className="d-flex gap-3 align-items-center mb-2">
                  <span className="text-muted small">
                    {" "}
                    🔗 {lead.name} #{lead.id}
                  </span>

                  <span
                    className="badge badge-light px-2 py-1 text-dark shadow-sm"
                    style={{
                      backgroundColor: "#e6f4ea", // light green bg
                      fontSize: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    <span className="text-green">Page: </span>
                    {lead.page || "Lead"}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-5 align-items-center w-600px">
                    <Action icon={<BsEnvelope />} label="Send Email" />
                    <Action icon={<FaComments />} label="Send SMS" />
                    <Action icon={<BsBellFill />} label="Create Reminder" />
                    <Action icon={<FaStickyNote />} label="Add Note" />
                  </div>
                  <Select
                    options={assigneeOptions}
                    value={
                      selectedAssignee
                        ? {
                            value: selectedAssignee.id,
                            label: selectedAssignee.name,
                          }
                        : null
                    }
                    onChange={handleSetSelectedAssignee}
                    placeholder="Select Assignee"
                    isClearable={false}
                    className="input-div w-25"
                    styles={customStyles}
                    components={{ Option, SingleValue }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="flex-1">
              <div className="card m-3 p-3 card">
                <h6 className="mb-3 d-flex align-items-center border-bottom p-3">
                  Company details
                </h6>
                <div className="pb-3">
                  {[
                    "name",
                    "city",
                    "zipcode",
                    "country",
                    "full_address",
                    "website",
                  ].map((field) => (
                    <div
                      key={field}
                      className="d-flex justify-content-between align-items-center px-3 py-1"
                    >
                      <div className="text-muted text-capitalize text-14px">
                        {field === "full_address" ? "Full Address" : field}
                      </div>
                      <div className="d-flex align-items-center">
                        {editing[field] ? (
                          <>
                            <input
                              className="form-control form-control-sm"
                              style={{ maxWidth: "200px" }}
                              value={details[field]}
                              onChange={(e) =>
                                handleChange(field, e.target.value)
                              }
                            />
                            <FaCheck
                              onClick={() => saveField(field)}
                              style={{
                                cursor: "pointer",
                                marginLeft: 8,
                                fontSize: 14,
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <span className="mr-2 font-500  pl-5 text-14px">
                              {details[field]}
                            </span>
                            <GoPencil
                              onClick={() => toggleEdit(field)}
                              style={{ cursor: "pointer", fontSize: "14px" }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card m-3 p-3 card">
                <h6 className="mb-3 d-flex align-items-center p-3 border-bottom">
                  Contact details
                </h6>
                <div className="pb-3">
                  {["contactName", "gender", "email", "phone"].map((field) => (
                    <div
                      key={field}
                      className="d-flex justify-content-between align-items-center px-3 py-1"
                    >
                      <div className="text-muted text-capitalize text-14px">
                        {field === "contactName"
                          ? "Name"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </div>
                      <div className="d-flex align-items-center">
                        {editing[field] ? (
                          <>
                            <input
                              className="form-control form-control-sm"
                              style={{ maxWidth: "200px" }}
                              value={details[field]}
                              onChange={(e) =>
                                handleChange(field, e.target.value)
                              }
                            />
                            <FaCheck
                              onClick={() => saveField(field)}
                              style={{
                                cursor: "pointer",
                                marginLeft: 8,
                                fontSize: 14,
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <span className="mr-2 font-500  pl-5 text-14px">
                              {details[field]}
                            </span>
                            <GoPencil
                              onClick={() => toggleEdit(field)}
                              style={{ cursor: "pointer", fontSize: "14px" }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="history-leads pl-4">
                <h6 className="mb-3 d-flex align-items-center py-3">History</h6>
                <div className="timeline">
                  <div className="timeline-item mb-4 d-flex">
                    <div className="timeline-icon mr-3">
                      <FaComments className="text-muted" size={20} />
                    </div>
                    <div className="timeline-content global-card  p-3 rounded  flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div>
                          <img
                            src="https://i.pravatar.cc/40?u=user1"
                            alt="avatar"
                            className="rounded-circle mr-2 "
                            width="30"
                            height="30"
                          />
                          <strong>Cameron McLawrence</strong> started a chat on
                          <span className="badge bg-success ml-3">
                            WhatsApp
                          </span>
                          <div className="text-muted small mt-1">
                            👤 Operator: Andrew Vance
                          </div>
                        </div>
                        <div className="text-muted small">
                          Active 12 min ago
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-item mb-4 d-flex">
                    <div className="timeline-icon mr-3">
                      <FaBell className="text-muted" size={20} />
                    </div>
                    <div className="timeline-content global-card p-3  flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div>
                          File has been uploaded
                          <a href="#" className="ml-1 text-info" target="">
                            my-cool-file.jpg
                          </a>
                          <BiDotsHorizontalRounded className="ml-1 text-muted" />
                          <div className="text-muted small mt-1">
                            👤 Added by: Lora Adams
                          </div>
                        </div>
                        <div className="text-muted small">2 hours ago</div>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-item mb-4 d-flex">
                    <div className="timeline-icon  mr-3">
                      <RiChatFollowUpFill className="text-muted" size={20} />
                    </div>
                    <div className="timeline-content global-card p-3 flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div>
                          Triggered an event{" "}
                          <span className="text-warning font-weight-bold">
                            webinar-email-follow-up
                          </span>
                          <div className="text-muted small mt-1">
                            👤 Triggered by: John Lock
                          </div>
                          <div className="text-muted small mt-2">
                            <span className="text-muted font-weight-bold">
                              source:
                            </span>
                            <span className="ml-1">
                              Christmas Promotion Website
                            </span>
                          </div>
                        </div>
                        <div className="text-muted small">
                          December 14, 2023 at 3:31 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="global-card m-3 p-3 notes-wrapper">
                <h6 className="mb-3 d-flex align-items-center border-bottom pb-2">
                  <FaStickyNote className="mr-2" /> Comments
                </h6>

                {/* Notes List */}
                <div className="mt-4">
                  {comments?.length > 0 ? (
                    comments?.map((comment, index) => (
                      <div
                        key={index}
                        className="global-card p-3 mb-3 bg-global  position-relative "
                      >
                        <div className="text-muted d-flex justify-content-between small mb-2">
                          <div className="d-flex">
                            <img
                              src={`https://ui-avatars.com/api/?name=${comment?.user?.name}`}
                              alt="avatar"
                              className="rounded-circle mr-2 "
                              style={{ width: "30px", height: "30px" }}
                              width="20"
                              height="20"
                            />
                            <div className="">
                              {comment?.user?.name}
                              <div>{formattedDate(comment?.updated_at)}</div>
                            </div>
                          </div>

                          <FaTrash
                            className="text-danger pointer-cursor"
                            onClick={() =>
                              handleCommentDelete(lead.id, comment?.id)
                            }
                          />
                        </div>
                        <div>{comment?.comment}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted small">No notes yet.</div>
                  )}
                </div>

                {/* Add New Note */}
                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Write a comment..."
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={handleCommentSubmit}
                    disabled={!editText.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
              {/* <div className="blank-div global-card m-3 p-3 "></div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Action = ({ icon, label }: { icon: JSX.Element; label: string }) => (
  <div
    className="d-flex align-items-center action-link mr-3"
    style={{ cursor: "pointer" }}
  >
    {icon}
    <span className="ml-1 medium">{label}</span>
  </div>
);

const SingleValue = (props) => {
  const { data } = props;
  console.log("data", data);
  return (
    <components.SingleValue {...props}>
      <img
        src={
          data.profile_pic || `https://ui-avatars.com/api/?name=${data.label}`
        }
        alt={data.label}
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: 8,
        }}
      />
      {data.label}
    </components.SingleValue>
  );
};

const Option = (props) => {
  const { data, innerRef, innerProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="custom-option p-2"
      key={data.value}
    >
      <img
        src={
          data.profile_pic || `https://ui-avatars.com/api/?name=${data.name}`
        }
        alt={data.label}
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "6px",
        }}
      />
      <span>{data.label}</span>
    </div>
  );
};

export default LeadDrawer;
