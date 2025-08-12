import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import { Lead } from "./types";

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Triangle } from 'lucide-react';


const key = "leads";
const membersKey = "users";

// Utility function to get user initials
const getInitials = (fullName: string) => {
  if (!fullName) return "U";

  const names = fullName.trim().split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
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
      <div className="view-padding flex justify-between items-center">
        <PageHeading
          icon={<Triangle size={24} />}
          title="CRM"
          description="Manage all ongoing leads"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_lead"
        />

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {membersList?.data.slice(0, 3).map((member, index) => (
            <Avatar key={index} className="h-8 w-8" data-slot="avatar">
              <AvatarImage
                src={member?.user?.profile_pic}
                alt={member?.name || "User"}
              />
              <AvatarFallback className="text-xs font-bold">
                {getInitials(member?.name || "User")}
              </AvatarFallback>
            </Avatar>
          ))}

          {membersList?.data.length > 3 && (
            <Avatar className="h-8 w-8 bg-gray-300" data-slot="avatar">
              <AvatarFallback className="text-xs font-bold">
                +{membersList.data.length - 3}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <hr />

      <DndProvider backend={HTML5Backend}>
        <div className="overflow-x-auto pb-5">
          <div className="flex gap-0 min-w-max">
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
