import { createContext, useContext, useState, useEffect } from 'react';
import { Organisation } from '../types/interface';

type OrganisationContextType = {
  selectedOrg: Organisation | null;
  setSelectedOrg: (org: Organisation) => void;
  organisations: Organisation[];
  setOrganisations: (orgs: Organisation[]) => void;
};

const OrganisationContext = createContext<OrganisationContextType | undefined>(undefined);

export const OrganisationProvider = ({ children }: { children: React.ReactNode }) => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organisation | null>(null);

  useEffect(() => {
    const storedOrg = localStorage.getItem('selectedOrganisation');
    if (storedOrg) setSelectedOrg(JSON.parse(storedOrg));
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      console.log('local selected org getting set')
      localStorage.setItem('selectedOrganisation', JSON.stringify(selectedOrg));
    }
  }, [selectedOrg]);

  return (
    <OrganisationContext.Provider value={{ selectedOrg, setSelectedOrg, organisations, setOrganisations }}>
      {children}
    </OrganisationContext.Provider>
  );
};

export const useOrganisation = () => {
  const context = useContext(OrganisationContext);
  if (!context) throw new Error('useOrganisation must be used within OrganisationProvider');
  return context;
};
