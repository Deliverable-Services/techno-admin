import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import { Lead } from "./types";
import "./crm-board.css";
import LeadDrawer from "./LeadDrawer";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { queryClient } from "../../utils/queryClient";
import PageHeading from "../../shared-components/PageHeading";
import { SiCivicrm } from "react-icons/si";

const key = "leads";
const membersKey = "users";

interface UserAvatarProps {
  profilePic?: string;
  name?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  profilePic,
  name,
  className,
}) => {
  const [showFallback, setShowFallback] = useState<boolean>(!profilePic);

  const handleImageError = () => {
    setShowFallback(true);
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "U";

    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      "#7e56da",
      "#ffd76a",
      "#7bbfff",
      "#ff6b6b",
      "#51cf66",
      "#ffa726",
      "#42a5f5",
      "#ab47bc",
      "#26c6da",
      "#ffca28",
    ];

    if (!name) return colors[0];

    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (profilePic) {
      setShowFallback(false);
    } else {
      setShowFallback(true);
    }
  }, [profilePic]);

  if (!profilePic || showFallback) {
    return (
      <div
        className={`d-flex align-items-center justify-content-center text-white ${
          className || ""
        }`}
        style={{
          backgroundColor: getBackgroundColor(name || "User"),
          borderRadius: "50%",
          fontSize: "12px",
          fontWeight: "bold",
          width: "30px",
          height: "30px",
        }}
      >
        {getInitials(name || "User")}
      </div>
    );
  }

  return (
    <img
      src={profilePic}
      alt={name || "User"}
      className={className}
      onError={handleImageError}
      style={{
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        objectFit: "cover",
      }}
    />
  );
};

const statusMap: { [key in string]: string } = {
  NEW: "New",
  SCHEDULED: "Scheduled",
  EN_ROUTE: "En-Route",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  PAID: "Paid",
};

const changeStatus = ({ id, newStatus }: { id: number; newStatus: any }) => {
  return API.post(`${key}/${id}/change-status`, {
    status: newStatus,
  });
};

const Index: React.FC = () => {
  const history = useHistory();
  const [leads, setLeads] = useState<Lead[]>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data } = useQuery<any>([key], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data: membersList } = useQuery<any>([`${membersKey}?role=admin`], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  useEffect(() => {
    if (data) {
      data.forEach((lead: any) => {
        if (lead?.hasOwnProperty("status")) {
          lead.status = lead.status.toUpperCase();
        }
      });
      setLeads(data);
    }
  }, [data]);

  const { mutate } = useMutation(changeStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Status updated successfully");
    },
    onError: (error: AxiosError) => {
      showErrorToast("Error updating lead status");
      handleApiError(error, history);
    },
  });

  const handleDrop = async (leadId: number, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );

    mutate({ id: leadId, newStatus });
  };

  const handleCardClick = (leadId: number) => setSelectedId(leadId);
  const handleClose = () => setSelectedId(null);

  const selectedLead = leads?.find((t) => t.id === selectedId);

  const _onCreateClick = () => {
    // TODO: Create LEAD form in popup
  };

  return (
    <>
      <div className="view-padding d-flex justify-content-between align-items-center">
        <PageHeading
          icon={<SiCivicrm size={24} />}
          title="CRM"
          description="Manage all ongoing leads"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_lead"
        />

        <div className="crm-users">
          {membersList?.data.slice(0, 3).map((member, index) => (
            <UserAvatar
              key={index}
              profilePic={member?.user?.profile_pic}
              name={member?.name}
              className="crm-avatar"
            />
          ))}

          {membersList?.data.length > 3 && (
            <span className="crm-avatar crm-avatar-extra">
              +{membersList.data.length - 3}
            </span>
          )}
        </div>
      </div>
      <hr />

      <DndProvider backend={HTML5Backend}>
        <div className="crm-board-overflow">
          <div className="row no-gutters crm-board">
            {Object.keys(statusMap).map((key) => {
              const typedKey = key as string;
              return (
                <Column
                  key={typedKey}
                  title={statusMap[typedKey]}
                  status={typedKey}
                  leads={leads?.filter((lead) => lead.status === typedKey)}
                  onDrop={handleDrop}
                  onCardClick={handleCardClick}
                />
              );
            })}
          </div>
        </div>
      </DndProvider>

      {selectedLead && <LeadDrawer lead={selectedLead} onClose={handleClose} />}
    </>
  );
};

export default Index;
