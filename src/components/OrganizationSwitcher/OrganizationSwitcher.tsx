import React, { useState, useRef, useEffect } from "react";
import { Organisation } from "../../types/interface";
import { useMutation } from "react-query";
import useTokenStore from "../../hooks/useTokenStore";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import "./OrganizationSwitcher.css";
import { Hammer } from "../ui/icon";

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
  const user = useUserProfileStore((state) => state.user);
  const removeToken = useTokenStore((state) => state.removeToken);
  const removeUser = useUserProfileStore((state) => state.removeUser);

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

  const logout = () => API.post("/auth/logout");
  const { mutate: logoutMutate, isLoading: isLogoutLoading } = useMutation(
    logout,
    {
      onSettled: () => {
        removeUser();
        removeToken();
        window.location.href = "/login";
      },
    }
  );

  const renderUserAvatar = () => {
    const url = (user as any)?.profile_pic;
    if (url) {
      return <img src={url} alt={(user as any)?.name || "User"} />;
    }
    const initials = ((user as any)?.name || "U")
      .split(" ")
      .map((w: string) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return <div className="org-avatar-placeholder">{initials}</div>;
  };

  return (
    <div className="organization-switcher mt-2" ref={dropdownRef}>
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
                {selectedOrg ? getInitials(selectedOrg.name) : <Hammer />}
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
        <Hammer className={`chevron ${isOpen ? "rotated" : ""}`} />
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
                {selectedOrg?.id === org.id && <Hammer className="checkmark" />}
              </div>
            ))}

            {/* Divider */}
            <div className="org-divider" />

            {/* Profile Row */}
            <a href="/profile" className="org-option profile-row">
              <div className="org-option-content">
                <div className="org-avatar">{renderUserAvatar()}</div>
                <div className="org-info">
                  <div className="org-name">
                    {(user as any)?.name || "User"}
                  </div>
                  <div className="org-details">
                    {(user as any)?.email || ""}
                  </div>
                </div>
              </div>
              <Hammer className="action-icon" title="Edit profile" />
            </a>

            {/* Logout Row */}
            <button
              type="button"
              className="org-option logout-row"
              onClick={() => logoutMutate()}
            >
              <div className="org-option-content">
                <div className="org-avatar">
                  <div className="org-avatar-placeholder">
                    <Hammer />
                  </div>
                </div>
                <div className="org-info">
                  <div className="org-name">
                    {isLogoutLoading ? "Logging out..." : "Log out"}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;
