import React, { useState, useRef, useEffect } from "react";
import { Organisation } from "../../types/interface";
import { IoChevronDown, IoCheckmark } from "react-icons/io5";
import { HiOfficeBuilding } from "react-icons/hi";
import "./OrganizationSwitcher.css";

interface OrganizationSwitcherProps {
  organisations: Organisation[];
  selectedOrg: Organisation | null;
  onSelect: (org: Organisation) => void;
}

const OrganizationSwitcher: React.FC<OrganizationSwitcherProps> = ({
  organisations,
  selectedOrg,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (org: Organisation) => {
    onSelect(org);
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "owner":
      case "admin":
        return "#10B981"; // Green
      case "manager":
        return "#F59E0B"; // Amber
      case "editor":
        return "#3B82F6"; // Blue
      case "viewer":
        return "#6B7280"; // Gray
      default:
        return "#8B5CF6"; // Purple
    }
  };

  return (
    <div className="organization-switcher" ref={dropdownRef}>
      <div className="org-switcher-label">Organisation</div>

      <div
        className={`org-switcher-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="org-switcher-selected">
          <div className="org-avatar">
            {selectedOrg?.logo ? (
              <img src={selectedOrg.logo} alt={selectedOrg.name} />
            ) : (
              <div className="org-avatar-placeholder">
                {selectedOrg ? (
                  getInitials(selectedOrg.name)
                ) : (
                  <HiOfficeBuilding />
                )}
              </div>
            )}
          </div>
          <div className="org-info">
            <div className="org-name">
              {selectedOrg?.name || "Select Organisation"}
            </div>
            {selectedOrg?.pivot?.role && (
              <div
                className="org-role"
                style={{ color: getRoleBadgeColor(selectedOrg.pivot.role) }}
              >
                {selectedOrg.pivot.role}
              </div>
            )}
          </div>
        </div>
        <IoChevronDown className={`chevron ${isOpen ? "rotated" : ""}`} />
      </div>

      {isOpen && (
        <div className="org-switcher-dropdown">
          <div className="org-dropdown-content">
            {organisations.map((org) => (
              <div
                key={org.id}
                className={`org-option ${
                  selectedOrg?.id === org.id ? "selected" : ""
                }`}
                onClick={() => handleSelect(org)}
              >
                <div className="org-option-content">
                  <div className="org-avatar">
                    {org.logo ? (
                      <img src={org.logo} alt={org.name} />
                    ) : (
                      <div className="org-avatar-placeholder">
                        {getInitials(org.name)}
                      </div>
                    )}
                  </div>
                  <div className="org-info">
                    <div className="org-name">{org.name}</div>
                    <div className="org-details">
                      {org.pivot?.role && (
                        <span
                          className="org-role-badge"
                          style={{
                            backgroundColor:
                              getRoleBadgeColor(org.pivot.role) + "20",
                            color: getRoleBadgeColor(org.pivot.role),
                          }}
                        >
                          {org.pivot.role}
                        </span>
                      )}
                      <span className="org-type">{org.store_type}</span>
                    </div>
                  </div>
                </div>
                {selectedOrg?.id === org.id && (
                  <IoCheckmark className="checkmark" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;
