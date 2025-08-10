import { createContext, useContext, useState, useEffect } from "react";
import { Organisation } from "../types/interface";
import { queryClient } from "../utils/queryClient";

type OrganisationContextType = {
  selectedOrg: Organisation | null;
  setSelectedOrg: (org: Organisation) => void;
  organisations: Organisation[];
  setOrganisations: (orgs: Organisation[]) => void;
  switchOrganisation: (org: Organisation) => Promise<void>;
};

const OrganisationContext = createContext<OrganisationContextType | undefined>(
  undefined
);

export const OrganisationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organisation | null>(null);

  useEffect(() => {
    const storedOrg = localStorage.getItem("selectedOrganisation");
    if (storedOrg) setSelectedOrg(JSON.parse(storedOrg));
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      console.log("local selected org getting set");
      localStorage.setItem("selectedOrganisation", JSON.stringify(selectedOrg));
    }
  }, [selectedOrg]);

  const switchOrganisation = async (org: Organisation) => {
    setSelectedOrg(org);
    // Ensure persisted for next load
    try {
      localStorage.setItem("selectedOrganisation", JSON.stringify(org));
    } catch {}
    // Clear react-query cache and force a full refresh to reload all org-scoped data
    try {
      queryClient.clear();
    } catch {}
    // Small delay to allow state/localStorage flush
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  return (
    <OrganisationContext.Provider
      value={{
        selectedOrg,
        setSelectedOrg,
        organisations,
        setOrganisations,
        switchOrganisation,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};

export const useOrganisation = () => {
  const context = useContext(OrganisationContext);
  if (!context)
    throw new Error("useOrganisation must be used within OrganisationProvider");
  return context;
};
