import React, { useEffect, useRef, useState, useCallback } from "react";
import { Comment, Lead } from "./types";

import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { useQuery, useMutation } from "react-query";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import { showMsgToast } from "../../utils/showMsgToast";

import {
  Building,
  FileInvoice,
  Calendar,
  MessageCircle,
  ChevronDown,
  Check,
  Edit,
  Trash,
  ArrowLeft,
  Mail,
  User,
  MapPin,
  MessageSquare,
  MoreVertical,
  CheckCircle,
  Truck,
  CreditCard,
  UserPlus,
  Circle,
  CircleDot,
} from "../../components/ui/icon";

import { Dropdown, Button, Form, Card, Badge } from "../ui/bootstrap-compat";
// Using Dropdown for assignee as well
import { queryClient } from "../../utils/queryClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

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
  const [invoices, setInvoices] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);
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
    user_id: lead?.user_id || null,
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
      user_id: d?.user_id ?? prev.user_id,
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

  // Fetch invoices
  useQuery<any>([`${key}/${lead.id}/invoices`], {
    onError: (error: AxiosError) => {
      console.error("Error fetching invoices:", error);
    },
    onSuccess: (data) => {
      setInvoices(data);
    },
  });

  // Fetch tickets
  useQuery<any>([`${key}/${lead.id}/tickets`], {
    onError: (error: AxiosError) => {
      console.error("Error fetching tickets:", error);
    },
    onSuccess: (data) => {
      setTickets(data);
    },
  });

  // Fetch meetings
  useQuery<any>([`${key}/${lead.id}/meetings`], {
    onError: (error: AxiosError) => {
      console.error("Error fetching meetings:", error);
    },
    onSuccess: (data) => {
      setMeetings(data);
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
    NEW: <Circle size={16} className="text-orange" />,
    SCHEDULED: <Calendar size={16} className="text-secondary" />,
    EN_ROUTE: <Truck size={16} className="text-warning" />,
    IN_PROGRESS: <CircleDot size={16} className="text-blue" />,
    COMPLETED: <CheckCircle size={16} className="text-success" />,
    PAID: <CreditCard size={16} className="text-blue-dark" />,
  };

  const renderStatus = (value: string) => {
    const opt = statusOptions.find((o) => o.value === value);
    return (
      <span className="flex items-center gap-2">
        {statusIcons[value]}
        <span>{opt?.label || value}</span>
      </span>
    );
  };

  // const currentStatus =
  //   statusOptions.find((s) => s.value === leadStatus) || statusOptions[0];

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "danger";
      case "active":
        return "primary";
      case "closed":
        return "secondary";
      case "approved":
        return "success";
      case "declined":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleInvoiceClick = (invoiceId: number) => {
    history.push(`/invoices/${invoiceId}`);
  };

  const handleTicketClick = (ticketId: number) => {
    history.push(`/tickets/${ticketId}`);
  };

  const handleMeetingClick = (meetingId: number) => {
    history.push(`/meetings/${meetingId}`);
  };

  const handleConvertToCustomer = async () => {
    try {
      setIsConverting(true);
      const response = await API.post(`${key}/${lead.id}/convert-to-customer`);

      showMsgToast("Lead successfully converted to customer!");

      // Show the temporary password to the user
      if (response.data.temporary_password) {
        alert(
          `Customer account created successfully!\n\nTemporary Password: ${response.data.temporary_password}\n\nPlease share this password with the customer securely.`
        );
      }

      // Refresh the lead data
      queryClient.invalidateQueries([`${key}/${lead.id}`]);
      queryClient.invalidateQueries([key]);
    } catch (error: any) {
      if (error.response?.status === 400) {
        showMsgToast(error.response.data.message);
      } else {
        handleApiError(error, history);
      }
    } finally {
      setIsConverting(false);
    }
  };

  const handleViewCustomer = () => {
    if (details.user_id) {
      history.push(`/users/${details.user_id}`);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-[#00000080] z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="lead-drawer fixed top-0 right-0 w-[90vw] max-w-[1400px] h-screen bg-white z-[51] flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.15)] animate-[slideInRight_0.3s_ease-out]">
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[400px] border-r border-gray-200 bg-white">
            <div className="h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  className="text-[#0b64fe] text-sm no-underline font-medium flex items-center gap-2 hover:text-blue-800 transition-colors"
                  onClick={onClose}
                >
                  <ArrowLeft />
                  Back to leads
                </button>
                <div>
                  <span className="flex items-center gap-1">
                    <MoreVertical size={16} />
                    More
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${details.name}&size=80&background=667eea&color=fff&font-size=0.4&bold=true`}
                  alt={details.name}
                  className="w-20 h-20 rounded-full object-cover border-[3px] border-solid !border-white shadow-lg"
                />

                <div className="flex flex-col gap-0">
                  <h4 className="mb-0 font-medium text-2xl">{details.name}</h4>
                  <span className="text-muted">{details.email}</span>
                </div>
              </div>

              <div className="flex text-center justify-between py-4">
                <button
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 text-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 no-underline"
                  type="button"
                >
                  <div className="text-lg border border-gray-300 h-10 w-10 flex items-center justify-center rounded-full">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 text-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 no-underline"
                  type="button"
                >
                  <div className="text-lg border border-gray-300 h-10 w-10 flex items-center justify-center rounded-full">
                    <MessageSquare size={16} />
                  </div>
                  <span className="text-sm font-medium">SMS</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 text-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 no-underline"
                  type="button"
                >
                  <div className="text-lg border border-gray-300 h-10 w-10 flex items-center justify-center rounded-full">
                    <Calendar size={16} />
                  </div>
                  <span className="text-sm font-medium">Meeting</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 text-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 no-underline"
                  type="button"
                >
                  <div className="text-lg border border-gray-300 h-10 w-10 flex items-center justify-center rounded-full">
                    <Calendar size={16} />
                  </div>
                  <span className="text-sm font-medium">Reminder</span>
                </button>
              </div>

              {/* Convert to Customer / View Customer Button */}
              <div className="mb-3 mt-3">
                {details.user_id ? (
                  <Button
                    variant="info"
                    className="w-full"
                    onClick={handleViewCustomer}
                  >
                    <User className="me-2" />
                    View Customer Profile
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    className="w-full text-black bg-success"
                    onClick={handleConvertToCustomer}
                    disabled={isConverting}
                  >
                    {isConverting ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Converting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="me-2" />
                        Convert to Customer
                      </>
                    )}
                  </Button>
                )}
              </div>
              {/* Status Updater - full width with icon */}
              <div className="mb-3 mt-3 flex items-center gap-4">
                <span>Status: </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-lg py-1 px-2 border border-secondary"
                    disabled={isStatusUpdating}>
                    <span className="flex items-center justify-between gap-2 w-full">
                      {renderStatus(leadStatus)}
                      <ChevronDown size={16} className="text-muted" />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {statusOptions.map((s) => (
                      <DropdownMenuItem
                        key={s.value}
                        onClick={() => handleChangeStatus(s.value)}
                        className="flex items-center gap-2"
                      >
                        {renderStatus(s.value)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Navigation Tabs */}
              <div className="mb-4">
                <div className="flex border-b">
                  <span
                    className={`cursor-pointer px-3 py-2 ${leftTab === "about" ? "text-primary" : "text-muted"
                      }`}
                    onClick={() => setLeftTab("about")}
                  >
                    About account
                  </span>
                  <span
                    className={`cursor-pointer px-3 py-2 ${leftTab === "address" ? "text-primary" : "text-muted"
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
                  <div className="info-section mb-8">
                    <h6 className="text-gray-700 flex items-center text-sm font-semibold gap-2 mb-4">
                      <User size={16} className="text-description text-base" />
                      Contact Information
                    </h6>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f3f4] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Name</span>
                      <span
                        className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                              className="py-1 px-2 rounded-lg bg-success"
                              onClick={() => saveField("name")}
                            >
                              <Check />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.name}
                            </span>
                            <button
                              className="text-secondary p-0"
                              onClick={() => startEdit("name")}
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f3f4] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Email</span>
                      <span
                        className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                              className="py-1 px-2 rounded-lg bg-success"
                              onClick={() => saveField("email")}
                            >
                              <Check size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.email}
                            </span>
                            <button
                              className="p-0 text-secondary"
                              onClick={() => startEdit("email")}
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f3f4] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Phone number</span>
                      <span
                        className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                              className="py-1 px-2 rounded-lg bg-success"
                              onClick={() => saveField("phone")}
                            >
                              <Check size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.phone}
                            </span>
                            <button
                              className="p-0 text-secondary"
                              onClick={() => startEdit("phone")}
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f3f4] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Assigned to</span>
                      <span className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis" style={{ maxWidth: 320 }}>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-lg py-1 px-2 border border-secondary">
                            <span className="flex items-center gap-2">
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
                            <ChevronDown size={16} className="text-muted" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            <DropdownMenuItem
                              onClick={() => handleAssignById("")}
                              className="flex items-center gap-2"
                            >
                              <span className="text-muted">Unassigned</span>
                            </DropdownMenuItem>
                            {(((membersList as any)?.data ?? []) as any[]).map(
                              (m: any) => (
                                <DropdownMenuItem
                                  key={m.id}
                                  onClick={() => handleAssignById(String(m.id))}
                                  className="flex items-center gap-2"
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
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Job title</span>
                      <span
                        className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                              className="py-1 px-2 rounded-lg bg-success"
                              onClick={() => saveField("jobTitle")}
                            >
                              <Check size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.jobTitle}
                            </span>
                            <button
                              className="p-0 text-secondary"
                              onClick={() => startEdit("jobTitle")}
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Gender</span>
                      <span
                        className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                              className="py-1 px-2 rounded-lg bg-success"
                              onClick={() => saveField("gender")}
                            >
                              <Check size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate text-capitalize">
                              {details.gender}
                            </span>
                            <button
                              className="p-0 text-secondary"
                              onClick={() => startEdit("gender")}
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Last contacted</span>
                      <span className="info-value text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis" style={{ maxWidth: 220 }}>-</span>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="info-section">
                    <h6 className="text-gray-700 flex items-center text-sm font-semibold gap-2 mb-4">
                      <Building size={16} className="text-description" />
                      Company Information
                    </h6>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Company name</span>
                      <span
                        className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                              className="py-1 px-2 rounded-lg bg-success"
                              onClick={() => saveField("company")}
                            >
                              <Check size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.company}
                            </span>
                            <button
                              className="p-0 text-secondary"
                              onClick={() => startEdit("company")}
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Website</span>
                      <span
                        className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                              className="py-1 px-2 rounded-lg bg-success"
                              onClick={() => saveField("website")}
                            >
                              <Check size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-truncate">
                              {details.website || "-"}
                            </span>
                            <button
                              className="p-0 text-secondary"
                              onClick={() => startEdit("website")}
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Instagram account</span>
                      <span className="info-value text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis" style={{ maxWidth: 220 }}>{details.instagram}</span>
                    </div>
                    <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                      <span className="info-label text-[13px] text-[#667085] font-medium">Tiktok account</span>
                      <span className="info-value text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis" style={{ maxWidth: 220 }}>{details.tiktok}</span>
                    </div>
                  </div>
                </>
              )}

              {leftTab === "address" && (
                <div className="info-section mb-8">
                  <h6 className="text-gray-700 flex items-center text-sm font-semibold gap-2 mb-4">
                    <MapPin size={16} className="text-description" />
                    Address Information
                  </h6>
                  <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                    <span className="info-label text-[13px] text-[#667085] font-medium">Full address</span>
                    <span
                      className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                            className="py-1 px-2 rounded-lg bg-success"
                            onClick={() => saveField("full_address")}
                          >
                            <Check size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">
                            {details.full_address}
                          </span>
                          <button
                            className="p-0 text-secondary"
                            onClick={() => startEdit("full_address")}
                          >
                            <Edit size={16} />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                    <span className="info-label text-[13px] text-[#667085] font-medium">City</span>
                    <span
                      className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                            className="py-1 px-2 rounded-lg bg-success"
                            onClick={() => saveField("city")}
                          >
                            <Check size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">{details.city}</span>
                          <button
                            className="p-0 text-secondary"
                            onClick={() => startEdit("city")}
                          >
                            <Edit size={16} />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                    <span className="info-label text-[13px] text-[#667085] font-medium">Country</span>
                    <span
                      className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                            className="py-1 px-2 rounded-lg bg-success"
                            onClick={() => saveField("country")}
                          >
                            <Check size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">
                            {details.country}
                          </span>
                          <button
                            className="p-0 text-secondary"
                            onClick={() => startEdit("country")}
                          >
                            <Edit size={16} />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="info-item flex items-center justify-between border-b border-[#f1f34] py-3">
                    <span className="info-label text-[13px] text-[#667085] font-medium">Zipcode</span>
                    <span
                      className="info-value flex items-center gap-2 text-gray-700 text-sm font-medium overflow-hidden text-right whitespace-nowrap text-ellipsis"
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
                            className="py-1 px-2 rounded-lg bg-success"
                            onClick={() => saveField("zipcode")}
                          >
                            <Check size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-truncate">
                            {details.zipcode}
                          </span>
                          <button
                            className="p-0 text-secondary"
                            onClick={() => startEdit("zipcode")}
                          >
                            <Edit size={16} />
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
          <div className="flex-1 bg-white">
            <div className="p-5 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-8 mb-4">
                <div
                  className={`py-2 cursor-pointer border-b-2 transition-all duration-200 font-medium ${midTab === "overview"
                    ? "text-secondary border-secondary"
                    : "text-gray-600 border-transparent"
                    }`}
                  onClick={() => setMidTab("overview")}
                >
                  Customer Journey
                </div>
                <div
                  className={`py-2 cursor-pointer border-b-2 transition-all duration-200 font-medium ${midTab === "activities"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent"
                    }`}
                  onClick={() => setMidTab("activities")}
                >
                  Notes
                </div>
              </div>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {midTab === "overview" ? (
                // User Journey Timeline
                <div className="activity-timeline pl-[30px] relative">
                  {activityLogs.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      No activity logs found
                    </div>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className="timeline-item border-l-2 border-[#e5e7eb] ml-2.5 pb-5 pl-5 relative">
                        <div className="timeline-icon flex items-center justify-center bg-[#667eea] border-2 border-whit text-white rounded-full shadow-sm text-[8px] size-6 overflow-hidden absolute top-0 -left-3">
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
                        <div className="timeline-content-wrapper bg-[#f9fafb] border-[#e5e7eb] rounded-lg border py-3 px-4">
                          <div className="timeline-header mb-1 bg-[#fafbfc] border-[#e9ecef] py-5 px-6">
                            <div className="flex items-center gap-2 mb-1">
                              <strong>{log.user?.name || "System"}</strong>
                              <span className="timeline-action text-[#6b7280]">
                                {log.action === "created" &&
                                  " created this lead"}
                                {log.action === "updated" &&
                                  " updated this lead"}
                                {log.action === "deleted" &&
                                  " deleted this lead"}
                              </span>
                            </div>
                            <div className="timeline-time text-muted text-xs">
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
                <div className="notes-section flex flex-col h-full">
                  <div className="add-note-section mb-3 border-b border-[#e5e7eb] pb-4">
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

                  <div className="notes-list flex-1 overflow-y-auto pt-4">
                    {comments.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        No notes yet. Add your first note above.
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="note-item bg-white border border-[#e5e7eb] rounded-lg p-4 mb-4">
                          <div className="note-header flex justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={resolveAvatar(
                                  comment.username || "User",
                                  comment.avatar
                                )}
                                alt={comment.username}
                                className="note-avatar rounded-full size-8 object-cover"
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
                              <div className="note-actions flex items-center justify-between mt-3 pt-3">
                                {editingCommentId === comment.id ? (
                                  <>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={handleSaveEditComment}
                                      disabled={editCommentMutation.isLoading}
                                    >
                                      <Check />
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
                                      <Edit />
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
                                      <Trash />
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
          <div className="w-[350px] border-l border-gray-200 bg-white">
            <div className="h-full overflow-y-auto p-6">
              {/* Invoices Section */}
              <div className="entity-section mb-4 border-b border-[#e5e7eb] pb-6">
                <h6 className="flex items-center gap-2 mb-4 text-gray-700 text-sm font-semibold">
                  <FileInvoice className="text-primary" size={16} />
                  <span>Invoices ({invoices.length})</span>
                </h6>
                {invoices.length === 0 ? (
                  <div className="text-muted small">No invoices found</div>
                ) : (
                  <div className="entity-list">
                    {invoices.map((invoice) => (
                      <Card
                        key={invoice.id}
                        className="entity-card mb-2 cursor-pointer"
                        onClick={() => handleInvoiceClick(invoice.id)}
                      >
                        <Card.Body className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h6 className="mb-1">
                                #{invoice.invoice_number}
                              </h6>
                              <p className="mb-1 text-muted small">
                                {invoice.description}
                              </p>
                            </div>
                            <Badge bg={getStatusBadgeVariant(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="fw-bold text-success">
                              {invoice.formatted_total}
                            </span>
                            <span className="text-muted small">
                              {invoice.invoice_date &&
                                new Date(
                                  invoice.invoice_date
                                ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-muted small mt-1">
                            {invoice.items_count} item(s)
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Support Tickets Section */}
              <div className="entity-section mb-4">
                <h6 className="flex items-center gap-2 mb-3">
                  <MessageCircle className="text-info" />
                  <span>Support Tickets ({tickets.length})</span>
                </h6>
                {tickets.length === 0 ? (
                  <div className="text-muted small">
                    No support tickets found
                  </div>
                ) : (
                  <div className="entity-list">
                    {tickets.map((ticket) => (
                      <Card
                        key={ticket.id}
                        className="entity-card mb-2 cursor-pointer"
                        onClick={() => handleTicketClick(ticket.id)}
                      >
                        <Card.Body className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h6 className="mb-1">{ticket.title}</h6>
                              <p className="mb-1 text-muted small">
                                #{ticket.ref_id}
                              </p>
                            </div>
                            <Badge bg={getStatusBadgeVariant(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted small">
                              {ticket.messages_count} message(s)
                            </span>
                            <span className="text-muted small">
                              {ticket.last_message_at &&
                                new Date(
                                  ticket.last_message_at
                                ).toLocaleDateString()}
                            </span>
                          </div>
                          {ticket.related_to && (
                            <div className="text-muted small mt-1">
                              Related to: {ticket.related_to}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Meetings Section */}
              <div className="entity-section mb-4">
                <h6 className="flex items-center gap-2 mb-3">
                  <Calendar className="text-warning" />
                  <span>Meetings ({meetings.length})</span>
                </h6>
                {meetings.length === 0 ? (
                  <div className="text-muted small">No meetings found</div>
                ) : (
                  <div className="entity-list">
                    {meetings.map((meeting) => (
                      <Card
                        key={meeting.id}
                        className="entity-card mb-2 cursor-pointer"
                        onClick={() => handleMeetingClick(meeting.id)}
                      >
                        <Card.Body className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h6 className="mb-1">{meeting.title}</h6>
                              <p className="mb-1 text-muted small">
                                {meeting.formatted_datetime}
                              </p>
                            </div>
                            <Badge bg={getStatusBadgeVariant(meeting.status)}>
                              {meeting.status}
                            </Badge>
                          </div>
                          {meeting.location && (
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="text-muted" size={14} />
                              <span className="text-muted small">
                                {meeting.location}
                              </span>
                            </div>
                          )}
                          {meeting.meet_link && (
                            <div className="text-muted small mb-1">
                              <a
                                href={meeting.meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                          <div className="text-muted small">
                            {meeting.guests_count} guest(s)
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDrawer;
