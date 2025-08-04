// CRMBorad.tsx

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

const key = "leads";
const membersKey = "users";

const statusMap: { [key in string]: string } = {
  NEW: "New",
  SCHEDULED: "Scheduled",
  EN_ROUTE: "En-Route",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  PAID: "PAID",
};

const changeStatus = ({ id, newStatus }: { id: number; newStatus: any }) => {
  return API.post(`${key}/${id}/change-status`, {
    status: newStatus,
  });
};

const CRMBoard: React.FC = () => {
  const history = useHistory();
  const [leads, setLeads] = useState<Lead[]>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, isFetching, error } = useQuery<any>([key, ,], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data: membersList } = useQuery<any>([`${membersKey}?role=admin`, ,], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  useEffect(() => {
    if (data) {
      data.map((lead: any) => {
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

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="crm-container">
          <div className="crm-header px-3">
            <h2 className="crm-title">CRM</h2>
            {/* <div className="crm-breadcrumb">Projects / Beyond Gravity</div> */}

            <div className="crm-users">
              {membersList?.data.slice(0, 3).map((member, index) => (
                <img
                  key={index}
                  src={member?.profile_pic || `https://ui-avatars.com/api/?name=${member.name}`}
                  alt=""
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
        </div>
      </DndProvider>

      {selectedLead && <LeadDrawer lead={selectedLead} onClose={handleClose} />}
    </>
  );
};

export default CRMBoard;
