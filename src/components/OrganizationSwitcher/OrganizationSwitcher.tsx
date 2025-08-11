import React from "react";
import { Organisation } from "../../types/interface";
import { useMutation } from "react-query";
import useTokenStore from "../../hooks/useTokenStore";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { ChevronDown, Check, User, X } from "../ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

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
  const user = useUserProfileStore((state) => state.user);
  const removeToken = useTokenStore((state) => state.removeToken);
  const removeUser = useUserProfileStore((state) => state.removeUser);

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
      return (
        <img
          src={url}
          alt={(user as any)?.name || "User"}
          className="h-full w-full object-cover"
        />
      );
    }
    const initials = ((user as any)?.name || "U")
      .split(" ")
      .map((w: string) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return <span className="text-sm font-medium">{initials}</span>;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {selectedOrg?.logo ? (
                <img
                  src={selectedOrg.logo}
                  alt={selectedOrg.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium">
                  {selectedOrg ? getInitials(selectedOrg.name) : "?"}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">
                {selectedOrg?.name || "Select Organisation"}
              </span>
              {selectedOrg?.pivot?.role && (
                <span
                  className="text-xs"
                  style={{ color: getRoleBadgeColor(selectedOrg.pivot.role) }}
                >
                  {selectedOrg.pivot.role}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80">
        {organisations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => onSelect(org)}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {getInitials(org.name)}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{org.name}</span>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  {org.pivot?.role && (
                    <span
                      className="px-1.5 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor:
                          getRoleBadgeColor(org.pivot.role) + "20",
                        color: getRoleBadgeColor(org.pivot.role),
                      }}
                    >
                      {org.pivot.role}
                    </span>
                  )}
                  <span>{org.store_type}</span>
                </div>
              </div>
            </div>
            {selectedOrg?.id === org.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/profile" className="flex items-center gap-3 p-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {renderUserAvatar()}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">
                {(user as any)?.name || "User"}
              </span>
              <span className="text-sm text-muted-foreground">
                {(user as any)?.email || ""}
              </span>
            </div>
            <User className="h-4 w-4 ml-auto" />
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logoutMutate()}
          className="flex items-center gap-3 p-3"
        >
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </div>
          <span className="font-medium">
            {isLogoutLoading ? "Logging out..." : "Log out"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
