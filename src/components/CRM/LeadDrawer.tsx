import React, { useEffect, useRef, useState, useCallback } from "react";
import { Comment, Lead } from "./types";
import "./lead-drawer.css";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { useQuery, useMutation } from "react-query";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import { showMsgToast } from "../../utils/showMsgToast";

import {
  FaBuilding,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaComments,
  FaChevronDown,
  FaCheck,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { MdEmail, MdPerson, MdLocationOn, MdSms } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import {
  FaCalendarCheck,
  FaTruckMoving,
  FaCheckCircle,
  FaCreditCard,
} from "react-icons/fa";
import { BsDiamond, BsDiamondHalf } from "react-icons/bs";

import { Dropdown, Button, Form } from "react-bootstrap";
// Using Dropdown for assignee as well
import { queryClient } from "../../utils/queryClient";

const key = "leads";

interface Props {
  lead: Lead;
  onClose: () => void;
}

const LeadDrawer: React.FC<Props> = ({ lead, onClose }) => {
  const history = useHistory();
  const loggedInUser = useUserProfileStore((state) => state.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  // Separate tabs state to avoid cross-interference
  const [leftTab, setLeftTab] = useState<"about" | "address">("about");
  const [midTab, setMidTab] = useState<"overview" | "activities">("overview");
  // Keeping activity tabs for future use – default to notes
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [details, setDetails] = useState({
    name: lead?.name || "Jacob Jones",
    city: lead?.city || "Paris",
    zipcode: lead?.zipcode || "75010",
    country: lead?.country || "France",
    full_address: lead?.full_address || "174 Quai de Jemmas",
    website: lead?.website || "",
    contactName: lead?.name || "Jacob Jones",
    gender: (lead?.gender || "male").toString().toLowerCase(),
    email: lead?.email || "jacobjons@gmail.com",
    phone: lead?.phone || "(239) 555-0108",
    jobTitle: "Marketer",
    company: "PT Lokalpride shoe",
    relationship: "Partner",
    instagram: "@jacobsss",
    tiktok: "@jacobshoe",
  });

  const [leadStatus, setLeadStatus] = useState(lead?.status || "NEW");
  const [isStatusUpdating, setIsStatusUpdating] = useState<boolean>(false);
  const [assignedMember, setAssignedMember] = useState<any>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const autoAssignAttemptedRef = useRef<boolean>(false);

  const resolveAvatar = (name: string, avatar?: string | null) =>
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&size=24&background=667eea&color=fff`;

  const { data: membersList } = useQuery<any>(
    [`users?role=admin&perPage=1000`],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  // Assign using member id (used by Dropdown like status)
  const handleAssignById = useCallback(
    async (memberId: string) => {
      // If empty (Unassigned), just clear locally for now
      if (!memberId) {
        setAssignedMember(null);
        return;
      }
      try {
        await API.post(
          `${key}/${lead.id}/assign-member`,
          { member_id: memberId },
          { headers: { "Content-Type": "application/json" } }
        );
        const allMembers = (membersList as any)?.data ?? [];
        const m = allMembers.find(
          (m: any) => String(m.id) === String(memberId)
        );
        setAssignedMember(m ?? null);
        showMsgToast("Assignee updated");
        queryClient.invalidateQueries([`${key}/${lead.id}`]);
      } catch (error) {
        handleApiError(error as any, history);
      }
    },
    [lead.id, membersList, history]
  );

  // Fetch lead data
  const { data } = useQuery<any>([`${key}/${lead.id}`], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  useEffect(() => {
    if (!data) return;
    const d = (data as any)?.data ?? data;
    // Comments
    setComments(d?.comments ?? []);
    // Merge lead details with server
    setDetails((prev) => ({
      ...prev,
      name: d?.name ?? prev.name,
      city: d?.city ?? prev.city,
      zipcode: d?.zipcode ?? prev.zipcode,
      country: d?.country ?? prev.country,
      full_address: d?.full_address ?? prev.full_address,
      website: d?.website ?? prev.website,
      email: d?.email ?? prev.email,
      phone: d?.phone ?? prev.phone,
      jobTitle: d?.job_title ?? prev.jobTitle,
      company: d?.company ?? prev.company,
      gender: d?.gender ? String(d.gender).toLowerCase() : prev.gender,
    }));
    setLeadStatus((prev) => d?.status ?? prev);
    setAssignedMember(d?.assignee ?? d?.assigned_member ?? null);
  }, [data]);

  // Fetch activity logs
  useQuery<any>([`${key}/${lead.id}/activity-logs`], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
    onSuccess: (data) => {
      setActivityLogs(data);
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation(
    async (comment: string) => {
      const response = await API.post(`${key}/${lead.id}/comment`, {
        comment,
      });
      return response.data;
    },
    {
      onSuccess: (newComment) => {
        // Add the new comment at the beginning for latest first
        setComments((prev) => [newComment, ...prev]);
        setNewCommentText("");
        showMsgToast("Comment added successfully");
        queryClient.invalidateQueries([`${key}/${lead.id}`]);
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  // Edit comment mutation
  const editCommentMutation = useMutation(
    async ({ commentId, comment }: { commentId: string; comment: string }) => {
      const response = await API.put(`${key}/${lead.id}/comment/${commentId}`, {
        comment,
      });
      return response.data;
    },
    {
      onSuccess: (updatedComment) => {
        setComments((prev) =>
          prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
        );
        setEditingCommentId(null);
        setEditCommentText("");
        showMsgToast("Comment updated successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  // Delete comment mutation
  const deleteCommentMutation = useMutation(
    async (commentId: string) => {
      await API.delete(`${key}/${lead.id}/comment/${commentId}`);
      return commentId;
    },
    {
      onSuccess: (deletedCommentId) => {
        setComments((prev) => prev.filter((c) => c.id !== deletedCommentId));
        showMsgToast("Comment deleted successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  // Auto-assign to the only team member if none is set and exactly one member exists
  useEffect(() => {
    const members = (membersList as any)?.data ?? [];
    if (autoAssignAttemptedRef.current) return;
    if (!assignedMember && Array.isArray(members) && members.length === 1) {
      const onlyMember = members[0];
      (async () => {
        try {
          autoAssignAttemptedRef.current = true;
          await handleAssignById(String(onlyMember.id));
          setAssignedMember(onlyMember);
        } catch (err) {
          // If API not found or fails, silently keep unassigned
        }
      })();
    }
  }, [assignedMember, membersList, lead?.id, handleAssignById]);

  const handleAddComment = () => {
    const text = newCommentText.trim();
    if (!text) return;
    addCommentMutation.mutate(text);
  };

  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.comment);
  };

  const handleSaveEditComment = () => {
    if (!editingCommentId || !editCommentText.trim()) return;
    editCommentMutation.mutate({
      commentId: editingCommentId,
      comment: editCommentText.trim(),
    });
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const apiFieldName = (field: string): string => {
    const map: Record<string, string> = {
      jobTitle: "job_title",
      full_address: "full_address",
      name: "name",
      email: "email",
      phone: "phone",
      zipcode: "zipcode",
      city: "city",
      country: "country",
      website: "website",
      gender: "gender",
    };
    return map[field] || field;
  };

  const startEdit = (field: string) =>
    setEditing((p) => ({ ...p, [field]: true }));

  const handleFieldChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const saveField = async (field: string) => {
    try {
      // Backend requires name, email, phone on update. Always include them.
      const base: any = {
        name: details.name,
        email: details.email,
        phone: details.phone,
      };
      // Include other known fields to avoid unintended nulls
      const optional: any = {
        zipcode: details.zipcode,
        city: details.city,
        country: details.country,
        full_address: details.full_address,
        website: details.website,
        gender: String(details.gender || "").toLowerCase(),
      };
      const payload: any = { ...base, ...optional };
      // Ensure edited field is present with correct API key
      const keyName = apiFieldName(field);
      payload[keyName] = (details as any)[field];
      await API.put(`${key}/${lead.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setEditing((p) => ({ ...p, [field]: false }));
      showMsgToast("Updated successfully");
      queryClient.invalidateQueries([`${key}/${lead.id}`]);
      queryClient.invalidateQueries([key]);
    } catch (err) {
      handleApiError(err as any, history);
    }
  };

  const handleChangeStatus = async (value: string) => {
    try {
      setIsStatusUpdating(true);
      await API.post(
        `${key}/${lead.id}/change-status`,
        { status: value },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setLeadStatus(value);
      showMsgToast("Status updated");
      queryClient.invalidateQueries([`${key}/${lead.id}`]);
      queryClient.invalidateQueries([key]);
    } catch (error) {
      handleApiError(error as any, history);
    } finally {
      setIsStatusUpdating(false);
    }
  };

  // Use the same statuses and icons as the CRM board
  const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "EN_ROUTE", label: "En-Route" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "PAID", label: "Paid" },
  ];

  const statusIcons: { [key: string]: JSX.Element } = {
    NEW: <BsDiamond className="text-orange mr-2" />,
    SCHEDULED: <FaCalendarCheck className="text-secondary mr-2" />,
    EN_ROUTE: <FaTruckMoving className="text-warning mr-2" />,
    IN_PROGRESS: <BsDiamondHalf className="text-blue mr-2" />,
    COMPLETED: <FaCheckCircle className="text-green mr-2" />,
    PAID: <FaCreditCard className="text-blue-dark mr-2" />,
  };

  const renderStatus = (value: string) => {
    const opt = statusOptions.find((o) => o.value === value);
    return (
      <span className="d-flex align-items-center gap-2">
        {statusIcons[value]}
        <span>{opt?.label || value}</span>
      </span>
    );
  };

  // const currentStatus =
  //   statusOptions.find((s) => s.value === leadStatus) || statusOptions[0];

  const relatedDeals = [
    {
      id: 1,
      name: "Web3 Landing Page",
      amount: "$5,000",
      closeDate: "June 20, 2024",
      status: "Contract Signed",
      statusClass: "contract-signed",
    },
    {
      id: 2,
      name: "CRM Product",
      amount: "$16,000",
      closeDate: "June 24, 2024",
      status: "Contract Sent",
      statusClass: "contract-sent",
    },
    {
      id: 3,
      name: "Property Website",
      amount: "$10,000",
      closeDate: "June 28, 2024",
      status: "Contract Sent",
      statusClass: "contract-sent",
    },
  ];

  return (
    <>
      <div className="lead-drawer-overlay" onClick={onClose} />
      <div className="lead-drawer">
        {/* Main Content */}
        <div className="lead-details">
          <div className="crm-left-panel">
            <div className="panel-content">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="back-link btn btn-link p-0"
                  onClick={onClose}
                >
                  <IoMdArrowBack />
                  Back to leads
                </button>
                <div>
                  <span>
                    <BsThreeDotsVertical />
                    More
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-start gap-12">
                <img
                  src={`https://ui-avatars.com/api/?name=${details.name}&size=80&background=667eea&color=fff&font-size=0.4&bold=true`}
                  alt={details.name}
                  className="lead-avatar"
                />

                <div className="d-flex flex-column gap-0">
                  <h4 className="mb-0">{details.name}</h4>
                  <span className="text-muted">{details.email}</span>
                </div>
              </div>

              <div className="quick-actions">
                <button className="quick-action-btn" type="button">
                  <div className="icon">
                    <MdEmail />
                  </div>
                  <span className="label">Email</span>
                </button>
                <button className="quick-action-btn" type="button">
                  <div className="icon">
                    <MdSms />
                  </div>
                  <span className="label">SMS</span>
                </button>
                <button className="quick-action-btn" type="button">
                  <div className="icon">
                    <FaCalendarAlt />
                  </div>
                  <span className="label">Meeting</span>
                </button>
                <button className="quick-action-btn" type="button">
                  <div className="icon">
                    <FaCalendarAlt />
                  </div>
                  <span className="label">Reminder</span>
                </button>
              </div>

              {/* Status Updater - full width with icon */}
              <div className="mb-3 mt-3 d-flex align-items-center gap-4">
                <span>Status: </span>
                <Dropdown
                  onSelect={(eventKey) => handleChangeStatus(String(eventKey))}
                  className="w-100"
                >
                  <Dropdown.Toggle
                    size="sm"
                    variant="outline"
                    className="w-100 d-flex align-items-center justify-content-between border-secondary"
                    disabled={isStatusUpdating}
                  >
                    <span className="d-flex align-items-center justify-content-between gap-2 w-100">
                      {renderStatus(leadStatus)}
                      <FaChevronDown className="text-muted" />
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {statusOptions.map((s) => (
                      <Dropdown.Item
                        eventKey={s.value}
                        key={s.value}
                        active={s.value === leadStatus}
                        className="d-flex align-items-center gap-2"
                      >
                        {renderStatus(s.value)}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {/* Navigation Tabs */}
              <div className="mb-4">
                <div className="d-flex border-bottom">
                  <span
                    className={`btn btn-link text-decoration-none px-3 py-2 ${
                      leftTab === "about" ? "text-primary" : "text-muted"
                    }`}
                    onClick={() => setLeftTab("about")}
                  >
                    About account
                  </span>
                  <span
                    className={`btn btn-link text-decoration-none px-3 py-2 ${
                      leftTab === "address" ? "text-primary" : "text-muted"
                    }`}
                    onClick={() => setLeftTab("address")}
                  >
                    Address info
                  </span>
                </div>
              </div>

              {leftTab === "about" && (
                <>
                  {/* Contact Information */}
                  <div className="info-section">
                    <h6>
                      <MdPerson className="icon" />
                      Contact Information
                    </h6>
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span
                        className="info-value d-flex align-items-center gap-2"
                        style={{ maxWidth: 260 }}
                      >
                        {editing.name ? (
                          <>
                            <input
                              name="name"
                              value={details.name}
                              onChange={handleFieldChange}
                              className="form-control form-control-sm"
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveField("name")}
                            >
                              <FaCheck />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.name}
                            </span>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => startEdit("name")}
                            >
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span
                        className="info-value d-flex align-items-center gap-2"
                        style={{ maxWidth: 260 }}
                      >
                        {editing.email ? (
                          <>
                            <input
                              name="email"
                              value={details.email}
                              onChange={handleFieldChange}
                              className="form-control form-control-sm"
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveField("email")}
                            >
                              <FaCheck />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.email}
                            </span>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => startEdit("email")}
                            >
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone number</span>
                      <span
                        className="info-value d-flex align-items-center gap-2"
                        style={{ maxWidth: 220 }}
                      >
                        {editing.phone ? (
                          <>
                            <input
                              name="phone"
                              value={details.phone}
                              onChange={handleFieldChange}
                              className="form-control form-control-sm"
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveField("phone")}
                            >
                              <FaCheck />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.phone}
                            </span>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => startEdit("phone")}
                            >
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Assigned to</span>
                      <span className="info-value" style={{ maxWidth: 320 }}>
                        <Dropdown
                          onSelect={(eventKey) =>
                            handleAssignById(String(eventKey))
                          }
                        >
                          <Dropdown.Toggle
                            size="sm"
                            variant="outline-secondary"
                            className="w-100 d-flex align-items-center justify-content-between"
                          >
                            <span className="d-flex align-items-center gap-2">
                              {assignedMember ? (
                                <>
                                  <img
                                    src={resolveAvatar(
                                      assignedMember?.name,
                                      assignedMember?.profile_pic ||
                                        assignedMember?.user?.profile_pic
                                    )}
                                    alt={assignedMember?.name}
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <span className="text-truncate">
                                    {assignedMember?.name}
                                  </span>
                                </>
                              ) : (
                                <span className="text-muted">Unassigned</span>
                              )}
                            </span>
                            <FaChevronDown className="text-muted" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="w-100">
                            <Dropdown.Item eventKey="" active={!assignedMember}>
                              <span className="text-muted">Unassigned</span>
                            </Dropdown.Item>
                            {(((membersList as any)?.data ?? []) as any[]).map(
                              (m: any) => (
                                <Dropdown.Item
                                  eventKey={String(m.id)}
                                  key={m.id}
                                  active={assignedMember?.id === m.id}
                                  className="d-flex align-items-center gap-2"
                                >
                                  <img
                                    src={resolveAvatar(
                                      m?.name,
                                      m?.profile_pic || m?.user?.profile_pic
                                    )}
                                    alt={m?.name}
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <span>{m.name}</span>
                                </Dropdown.Item>
                              )
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Job title</span>
                      <span
                        className="info-value d-flex align-items-center gap-2"
                        style={{ maxWidth: 220 }}
                      >
                        {editing.jobTitle ? (
                          <>
                            <input
                              name="jobTitle"
                              value={details.jobTitle}
                              onChange={handleFieldChange}
                              className="form-control form-control-sm"
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveField("jobTitle")}
                            >
                              <FaCheck />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.jobTitle}
                            </span>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => startEdit("jobTitle")}
                            >
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender</span>
                      <span
                        className="info-value d-flex align-items-center gap-2"
                        style={{ maxWidth: 220 }}
                      >
                        {editing.gender ? (
                          <>
                            <select
                              name="gender"
                              value={details.gender}
                              onChange={(e: any) =>
                                setDetails((p) => ({
                                  ...p,
                                  gender: e.target.value,
                                }))
                              }
                              className="form-select form-select-sm"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveField("gender")}
                            >
                              <FaCheck />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate text-capitalize">
                              {details.gender}
                            </span>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => startEdit("gender")}
                            >
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last contacted</span>
                      <span className="info-value">-</span>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="info-section">
                    <h6>
                      <FaBuilding className="icon" />
                      Company Information
                    </h6>
                    <div className="info-item">
                      <span className="info-label">Company name</span>
                      <span
                        className="info-value d-flex align-items-center gap-2"
                        style={{ maxWidth: 220 }}
                      >
                        {editing.company ? (
                          <>
                            <input
                              name="company"
                              value={details.company}
                              onChange={handleFieldChange}
                              className="form-control form-control-sm"
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveField("company")}
                            >
                              <FaCheck />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.company}
                            </span>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => startEdit("company")}
                            >
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Website</span>
                      <span
                        className="info-value d-flex align-items-center gap-2"
                        style={{ maxWidth: 260 }}
                      >
                        {editing.website ? (
                          <>
                            <input
                              name="website"
                              value={details.website}
                              onChange={handleFieldChange}
                              placeholder="https://example.com"
                              className="form-control form-control-sm"
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveField("website")}
                            >
                              <FaCheck />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.website || "-"}
                            </span>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => startEdit("website")}
                            >
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Instagram account</span>
                      <span className="info-value">{details.instagram}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Tiktok account</span>
                      <span className="info-value">{details.tiktok}</span>
                    </div>
                  </div>
                </>
              )}

              {leftTab === "address" && (
                <div className="info-section">
                  <h6>
                    <MdLocationOn className="icon" />
                    Address Information
                  </h6>
                  <div className="info-item">
                    <span className="info-label">Full address</span>
                    <span
                      className="info-value d-flex align-items-center gap-2"
                      style={{ maxWidth: 260 }}
                    >
                      {editing.full_address ? (
                        <>
                          <input
                            name="full_address"
                            value={details.full_address}
                            onChange={handleFieldChange}
                            className="form-control form-control-sm"
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveField("full_address")}
                          >
                            <FaCheck />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">
                            {details.full_address}
                          </span>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => startEdit("full_address")}
                          >
                            <AiFillEdit />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">City</span>
                    <span
                      className="info-value d-flex align-items-center gap-2"
                      style={{ maxWidth: 200 }}
                    >
                      {editing.city ? (
                        <>
                          <input
                            name="city"
                            value={details.city}
                            onChange={handleFieldChange}
                            className="form-control form-control-sm"
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveField("city")}
                          >
                            <FaCheck />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">{details.city}</span>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => startEdit("city")}
                          >
                            <AiFillEdit />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Country</span>
                    <span
                      className="info-value d-flex align-items-center gap-2"
                      style={{ maxWidth: 200 }}
                    >
                      {editing.country ? (
                        <>
                          <input
                            name="country"
                            value={details.country}
                            onChange={handleFieldChange}
                            className="form-control form-control-sm"
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveField("country")}
                          >
                            <FaCheck />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">
                            {details.country}
                          </span>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => startEdit("country")}
                          >
                            <AiFillEdit />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Zipcode</span>
                    <span
                      className="info-value d-flex align-items-center gap-2"
                      style={{ maxWidth: 160 }}
                    >
                      {editing.zipcode ? (
                        <>
                          <input
                            name="zipcode"
                            value={details.zipcode}
                            onChange={handleFieldChange}
                            className="form-control form-control-sm"
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveField("zipcode")}
                          >
                            <FaCheck />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">
                            {details.zipcode}
                          </span>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => startEdit("zipcode")}
                          >
                            <AiFillEdit />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Timeline */}
          <div className="crm-center-panel">
            <div className="timeline-header">
              <div className="timeline-tabs">
                <div
                  className={`timeline-tab ${
                    midTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setMidTab("overview")}
                >
                  Customer Journey
                </div>
                <div
                  className={`timeline-tab ${
                    midTab === "activities" ? "active" : ""
                  }`}
                  onClick={() => setMidTab("activities")}
                >
                  Notes
                </div>
              </div>
            </div>

            <div className="timeline-content">
              {midTab === "overview" ? (
                // User Journey Timeline
                <div className="activity-timeline">
                  {activityLogs.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      No activity logs found
                    </div>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className="timeline-item">
                        <div className="timeline-icon">
                          <img
                            src={resolveAvatar(
                              log.user?.name || "System",
                              log.user?.profile_pic
                            )}
                            alt={log.user?.name || "System"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div className="timeline-content-wrapper">
                          <div className="timeline-header">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <strong>{log.user?.name || "System"}</strong>
                              <span className="timeline-action">
                                {log.action === "created" &&
                                  " created this lead"}
                                {log.action === "updated" &&
                                  " updated this lead"}
                                {log.action === "deleted" &&
                                  " deleted this lead"}
                              </span>
                            </div>
                            <div className="timeline-time text-muted small">
                              {log.formatted_time} •{" "}
                              {log.created_at &&
                                new Date(log.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Notes Section
                <div className="notes-section">
                  <div className="add-note-section mb-3">
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        ref={commentTextareaRef}
                        placeholder="Add a note..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        rows={3}
                        className="mb-2"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddComment}
                        disabled={
                          !newCommentText.trim() || addCommentMutation.isLoading
                        }
                      >
                        {addCommentMutation.isLoading
                          ? "Adding..."
                          : "Add Note"}
                      </Button>
                    </Form.Group>
                  </div>

                  <div className="notes-list">
                    {comments.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        No notes yet. Add your first note above.
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="note-item">
                          <div className="note-header">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={resolveAvatar(
                                  comment.username || "User",
                                  comment.avatar
                                )}
                                alt={comment.username}
                                className="note-avatar"
                              />
                              <div>
                                <strong>{comment.username || "User"}</strong>
                                <div className="text-muted small">
                                  {comment.created_at
                                    ? new Date(
                                        comment.created_at
                                      ).toLocaleString()
                                    : "Just now"}
                                </div>
                              </div>
                            </div>
                            {comment.user_id === loggedInUser.id && (
                              <div className="note-actions">
                                {editingCommentId === comment.id ? (
                                  <>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={handleSaveEditComment}
                                      disabled={editCommentMutation.isLoading}
                                    >
                                      <FaCheck />
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={handleCancelEditComment}
                                      className="ms-1"
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() =>
                                        handleStartEditComment(comment)
                                      }
                                    >
                                      <FaEdit />
                                    </Button>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="text-danger"
                                      onClick={() =>
                                        handleDeleteComment(comment.id)
                                      }
                                      disabled={deleteCommentMutation.isLoading}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="note-content mt-2">
                            {editingCommentId === comment.id ? (
                              <Form.Control
                                as="textarea"
                                value={editCommentText}
                                onChange={(e) =>
                                  setEditCommentText(e.target.value)
                                }
                                rows={2}
                              />
                            ) : (
                              <p className="mb-0">{comment.comment}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Related Entities */}
          <div className="crm-right-panel">
            <div className="panel-content">
              {/* Invoices / Subscriptions */}
              <div className="entity-section">
                <h6>
                  <FaFileInvoiceDollar className="icon" />
                  Deals ({relatedDeals.length})
                </h6>
                {relatedDeals.map((deal) => (
                  <div key={deal.id} className="entity-item">
                    <div className="entity-info">
                      <div className="entity-name">{deal.name}</div>
                      <div className="entity-details">
                        <div className="entity-detail">
                          <FaFileInvoiceDollar className="icon" />
                          {deal.amount}
                        </div>
                        <div className="entity-detail">
                          <FaCalendarAlt className="icon" />
                          {deal.closeDate}
                        </div>
                        <div className="entity-detail">
                          <span className={`status-badge ${deal.statusClass}`}>
                            {deal.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tickets */}
              <div className="entity-section">
                <h6>
                  <FaComments className="icon" />
                  Tickets (2)
                </h6>
                <div className="text-muted small">No tickets found</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDrawer;
