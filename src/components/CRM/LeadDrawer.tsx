import React, { useEffect, useState } from "react";
import { Comment, Lead } from "./types";
import Select, { components } from "react-select";
import "./lead-drawer.css";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import {
  FaTrash,
  FaUser,
  FaBuilding,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaUserTie,
  FaExchangeAlt,
  FaArchive,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {
  MdEmail,
  MdSms,
  MdNotifications,
  MdPerson,
  MdBusiness,
  MdLocationOn,
  MdPhone,
  MdWeb,
} from "react-icons/md";
import { AiOutlineUser, AiFillEdit } from "react-icons/ai";
import { BiTime, BiUser } from "react-icons/bi";

import { Dropdown, Row, Col } from "react-bootstrap";
import { FaComments, FaStickyNote, FaCheck } from "react-icons/fa";
import { BsEnvelope, BsBellFill, BsThreeDotsVertical } from "react-icons/bs";

import { queryClient } from "../../utils/queryClient";
import moment from "moment";
import { User } from "../../types/interface";

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

  const loggedInUser = useUserProfileStore((state) => state.user);
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

  const [leadStatus, setLeadStatus] = useState(lead?.status || "NEW");

  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});

  const { data: membersList } = useQuery<any>(
    [`users?role=admin&perPage=1000`],
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

  const handleCommentSubmit = async () => {
    const text = editText.trim() || "";
    if (!text) return;
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
      username: loggedInUser?.name || "User Name",
      avatar,
      user_id: loggedInUser.id,
      lead_id: lead.id,
    };
    setComments((prev) => [...prev, newComment]);

    setEditText("");
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

  const statusOptions = [
    { value: "NEW", label: "New", color: "#28a745" },
    { value: "CONTACTED", label: "Contacted", color: "#17a2b8" },
    { value: "QUALIFIED", label: "Qualified", color: "#ffc107" },
    { value: "PROPOSAL", label: "Proposal", color: "#fd7e14" },
    { value: "NEGOTIATION", label: "Negotiation", color: "#6f42c1" },
    { value: "CLOSED_WON", label: "Closed Won", color: "#28a745" },
    { value: "CLOSED_LOST", label: "Closed Lost", color: "#dc3545" },
    { value: "CUSTOMER", label: "Customer", color: "#20c997" },
  ];

  const currentStatus =
    statusOptions.find((s) => s.value === leadStatus) || statusOptions[0];

  const timelineEvents = [
    {
      id: 1,
      type: "customer_created",
      title: "Customer Created",
      description: "Lead was created in the system",
      user: "System",
      timestamp: lead.created_at,
      icon: <FaUser />,
      color: "#28a745",
    },
    {
      id: 2,
      type: "comment",
      title: "Comment Added",
      description: "Initial contact made via website form",
      user: "John Smith",
      timestamp: moment().subtract(2, "hours").toISOString(),
      icon: <FaComments />,
      color: "#17a2b8",
    },
    {
      id: 3,
      type: "email_sent",
      title: "Email Sent",
      description: "Welcome email sent to customer",
      user: "Sarah Johnson",
      timestamp: moment().subtract(1, "hours").toISOString(),
      icon: <MdEmail />,
      color: "#fd7e14",
    },
    {
      id: 4,
      type: "invoice_raised",
      title: "Invoice Created",
      description: "Invoice #INV-001 created for $1,500",
      user: "Michael Brown",
      timestamp: moment().subtract(30, "minutes").toISOString(),
      icon: <FaFileInvoiceDollar />,
      color: "#ffc107",
    },
    {
      id: 5,
      type: "meeting_scheduled",
      title: "Meeting Scheduled",
      description: "Demo meeting scheduled for tomorrow 2:00 PM",
      user: "Lisa Davis",
      timestamp: moment().subtract(15, "minutes").toISOString(),
      icon: <FaCalendarAlt />,
      color: "#6f42c1",
    },
  ];

  return (
    <>
      <div className="crm-drawer-overlay" onClick={onClose} />
      <div className="crm-drawer slide-in">
        {/* Modern Enhanced Header */}
        <div className="crm-drawer-header">
          <div className="header-glass-panel">
            <div className="d-flex justify-content-between align-items-start">
              {/* Close Button */}
              <button className="modern-close-btn" onClick={onClose}>
                <IoMdClose size={20} />
              </button>

              {/* Customer Profile Section */}
              <div className="customer-profile-section flex-grow-1 mx-4">
                <div className="d-flex align-items-center">
                  <div className="modern-avatar-container">
                    <div className="avatar-ring">
                      <img
                        src={`https://ui-avatars.com/api/?name=${lead.name}&size=80&background=667eea&color=fff&font-size=0.4&bold=true`}
                        alt={lead.name}
                        className="modern-avatar"
                      />
                    </div>
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: currentStatus.color }}
                    ></div>
                  </div>

                  <div className="customer-info ml-4">
                    <h3 className="customer-name">{lead.name}</h3>
                    <div className="customer-meta">
                      <div
                        className="modern-status-badge"
                        style={{
                          background: `linear-gradient(135deg, ${currentStatus.color}15, ${currentStatus.color}25)`,
                          border: `1px solid ${currentStatus.color}30`,
                        }}
                      >
                        <div
                          className="status-dot"
                          style={{ backgroundColor: currentStatus.color }}
                        ></div>
                        <span style={{ color: currentStatus.color }}>
                          {currentStatus.label}
                        </span>
                      </div>
                      <span className="meta-item">ID #{lead.id}</span>
                      <span className="meta-item">
                        {moment(lead.created_at).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="header-actions">
                <Dropdown>
                  <Dropdown.Toggle
                    as="div"
                    className="modern-action-btn status-btn"
                  >
                    <FaExchangeAlt className="btn-icon" />
                    <span>Status</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="modern-dropdown">
                    {statusOptions.map((status) => (
                      <Dropdown.Item
                        key={status.value}
                        onClick={() => setLeadStatus(status.value)}
                        className={`modern-dropdown-item ${
                          leadStatus === status.value ? "active" : ""
                        }`}
                      >
                        <div className="status-option">
                          <div
                            className="status-color"
                            style={{ backgroundColor: status.color }}
                          ></div>
                          <span>{status.label}</span>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle
                    as="div"
                    className="modern-action-btn menu-btn"
                  >
                    <BsThreeDotsVertical className="btn-icon" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="modern-dropdown">
                    <Dropdown.Item className="modern-dropdown-item">
                      <FaUserTie className="item-icon" />
                      <span>Convert to Customer</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="modern-dropdown-item">
                      <FaArchive className="item-icon" />
                      <span>Archive Lead</span>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="modern-dropdown-item danger">
                      <FaTrash className="item-icon" />
                      <span>Delete Lead</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          {/* Modern Quick Actions */}
          <div className="modern-quick-actions">
            <div className="actions-grid">
              <button className="modern-quick-btn primary">
                <div className="btn-icon-wrapper">
                  <MdEmail className="btn-icon" />
                </div>
                <span>Email</span>
              </button>
              <button className="modern-quick-btn success">
                <div className="btn-icon-wrapper">
                  <MdSms className="btn-icon" />
                </div>
                <span>SMS</span>
              </button>
              <button className="modern-quick-btn warning">
                <div className="btn-icon-wrapper">
                  <MdNotifications className="btn-icon" />
                </div>
                <span>Reminder</span>
              </button>
              <button className="modern-quick-btn info">
                <div className="btn-icon-wrapper">
                  <FaCalendarAlt className="btn-icon" />
                </div>
                <span>Meeting</span>
              </button>
              <button className="modern-quick-btn secondary">
                <div className="btn-icon-wrapper">
                  <FaFileInvoiceDollar className="btn-icon" />
                </div>
                <span>Invoice</span>
              </button>
            </div>
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
          <Row className="h-100 no-gutters">
            {/* Left Sidebar - Customer Information */}
            <Col lg={4} className="crm-left-panel">
              <div className="panel-content h-100">
                {/* Modern Personal Information */}
                <div className="modern-card mb-4">
                  <div className="modern-card-header">
                    <div className="card-icon-wrapper personal">
                      <MdPerson className="card-icon" />
                    </div>
                    <h6 className="card-title">Personal Information</h6>
                  </div>
                  <div className="modern-card-body">
                    <div className="compact-info-list">
                      {["contactName", "gender", "email", "phone"].map(
                        (field) => (
                          <div key={field} className="compact-info-row">
                            <div className="info-left">
                              <div className="info-icon-small">
                                {field === "email" && <MdEmail />}
                                {field === "phone" && <MdPhone />}
                                {field === "contactName" && <BiUser />}
                                {field === "gender" && <AiOutlineUser />}
                              </div>
                              <span className="info-label-compact">
                                {field === "contactName"
                                  ? "Name"
                                  : field.charAt(0).toUpperCase() +
                                    field.slice(1)}
                              </span>
                            </div>
                            <div className="info-right">
                              {editing[field] ? (
                                <div className="edit-mode-compact">
                                  <input
                                    className="compact-input"
                                    value={details[field]}
                                    onChange={(e) =>
                                      handleChange(field, e.target.value)
                                    }
                                    autoFocus
                                  />
                                  <button
                                    className="save-btn-compact"
                                    onClick={() => saveField(field)}
                                  >
                                    <FaCheck />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className="view-mode-compact"
                                  onClick={() => toggleEdit(field)}
                                >
                                  <span className="info-value-compact">
                                    {details[field]}
                                  </span>
                                  <AiFillEdit className="edit-icon-compact" />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Modern Company Information */}
                <div className="modern-card">
                  <div className="modern-card-header">
                    <div className="card-icon-wrapper company">
                      <MdBusiness className="card-icon" />
                    </div>
                    <h6 className="card-title">Company Information</h6>
                  </div>
                  <div className="modern-card-body">
                    <div className="compact-info-list">
                      {[
                        "name",
                        "website",
                        "city",
                        "country",
                        "zipcode",
                        "full_address",
                      ].map((field) => (
                        <div key={field} className="compact-info-row">
                          <div className="info-left">
                            <div className="info-icon-small">
                              {field === "name" && <FaBuilding />}
                              {field === "website" && <MdWeb />}
                              {(field === "city" ||
                                field === "country" ||
                                field === "full_address") && <MdLocationOn />}
                            </div>
                            <span className="info-label-compact">
                              {field === "full_address"
                                ? "Address"
                                : field.charAt(0).toUpperCase() +
                                  field.slice(1)}
                            </span>
                          </div>
                          <div className="info-right">
                            {editing[field] ? (
                              <div className="edit-mode-compact">
                                <input
                                  className="compact-input"
                                  value={details[field]}
                                  onChange={(e) =>
                                    handleChange(field, e.target.value)
                                  }
                                  autoFocus
                                />
                                <button
                                  className="save-btn-compact"
                                  onClick={() => saveField(field)}
                                >
                                  <FaCheck />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="view-mode-compact"
                                onClick={() => toggleEdit(field)}
                              >
                                <span
                                  className="info-value-compact"
                                  title={details[field]}
                                >
                                  {details[field]}
                                </span>
                                <AiFillEdit className="edit-icon-compact" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            {/* Center Panel - Modern Timeline */}
            <Col lg={5} className="crm-center-panel">
              <div className="panel-content h-100">
                <div className="modern-timeline-header">
                  <div className="timeline-title-wrapper">
                    <div className="timeline-icon-bg">
                      <BiTime className="timeline-title-icon" />
                    </div>
                    <h5 className="timeline-title">Customer Journey</h5>
                  </div>
                  <div className="timeline-stats">
                    <span className="stat-item">
                      {timelineEvents.length} Events
                    </span>
                  </div>
                </div>

                <div className="modern-timeline-container">
                  <div className="timeline-track">
                    {timelineEvents.map((event, index) => (
                      <div key={event.id} className="modern-timeline-item">
                        <div className="timeline-marker-wrapper">
                          <div
                            className="timeline-marker"
                            style={{ backgroundColor: event.color }}
                          >
                            <div className="marker-icon">{event.icon}</div>
                          </div>
                          {index < timelineEvents.length - 1 && (
                            <div className="timeline-connector"></div>
                          )}
                        </div>

                        <div className="timeline-event-card">
                          <div className="event-header">
                            <div
                              className="event-type"
                              style={{ color: event.color }}
                            >
                              {event.title}
                            </div>
                            <div className="event-time">
                              {moment(event.timestamp).format(
                                "MMM DD, hh:mm A"
                              )}
                            </div>
                          </div>

                          <div className="event-description">
                            {event.description}
                          </div>

                          <div className="event-footer">
                            <div className="event-user">
                              <img
                                src={`https://ui-avatars.com/api/?name=${event.user}&size=28&background=667eea&color=fff`}
                                alt={event.user}
                                className="user-avatar"
                              />
                              <span className="user-name">{event.user}</span>
                            </div>
                            <div className="event-actions">
                              <button className="action-btn">
                                <span>•••</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            {/* Right Panel - Notes Only */}
            <Col lg={3} className="crm-right-panel">
              <div className="panel-content h-100">
                {/* Modern Notes Section */}
                <div className="modern-card notes-card">
                  <div className="modern-card-header">
                    <div className="card-icon-wrapper notes">
                      <FaStickyNote className="card-icon" />
                    </div>
                    <h6 className="card-title">Notes & Comments</h6>
                    <span className="notes-count">{comments?.length || 0}</span>
                  </div>
                  <div className="modern-card-body notes-body">
                    {/* Modern Notes List */}
                    <div className="modern-notes-list">
                      {comments?.length > 0 ? (
                        comments?.map((comment, index) => (
                          <div key={index} className="modern-comment-item">
                            <div className="comment-header">
                              <div className="comment-user">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${comment?.user?.name}&size=32&background=667eea&color=fff`}
                                  alt="avatar"
                                  className="comment-avatar"
                                />
                                <div className="user-details">
                                  <div className="user-name">
                                    {comment?.user?.name}
                                  </div>
                                  <div className="comment-time">
                                    {formattedDate(comment?.updated_at)}
                                  </div>
                                </div>
                              </div>
                              <button
                                className="delete-comment-btn"
                                onClick={() =>
                                  handleCommentDelete(lead.id, comment?.id)
                                }
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <div className="comment-content">
                              {comment?.comment}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-notes-state">
                          <div className="empty-icon">
                            <FaStickyNote />
                          </div>
                          <div className="empty-text">No notes yet</div>
                          <div className="empty-subtext">
                            Start by adding your first note below
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Modern Add Note */}
                    <div className="modern-add-note">
                      <div className="note-input-wrapper">
                        <textarea
                          className="modern-note-input"
                          rows={3}
                          placeholder="Write a note..."
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                      </div>
                      <button
                        className={`modern-add-btn ${
                          !editText.trim() ? "disabled" : ""
                        }`}
                        onClick={handleCommentSubmit}
                        disabled={!editText.trim()}
                      >
                        <span className="btn-text">Add Note</span>
                        <div className="btn-icon">
                          <span>→</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
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
