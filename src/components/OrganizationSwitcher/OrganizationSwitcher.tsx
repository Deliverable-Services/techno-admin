import React from "react";
import { Organisation } from "../../types/interface";
import { useMutation } from "react-query";
import useTokenStore from "../../hooks/useTokenStore";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import API from "../../utils/API";
import { ChevronDown, User, X, Check } from "../ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
    const url = (user as any)?.profile_pic as string | undefined;
    const initials = getInitials(((user as any)?.name || "User") as string);
    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={url} alt={(user as any)?.name || "User"} />
        <AvatarFallback className="text-white bg-gradient-to-br from-cyan-600 to-indigo-800">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full mt-2 flex items-center justify-between gap-2 bg-white rounded-xl px-2 py-1.5">
          <div className="flex items-center justify-start gap-2 w-full">
            <Avatar className="h-8 w-8">
              {selectedOrg?.logo ? (
                <AvatarImage
                  className="object-cover"
                  src={selectedOrg.logo}
                  alt={selectedOrg?.name}
                />
              ) : (
                <AvatarFallback className="text-sm text-white bg-cyan-400">
                  {selectedOrg ? getInitials(selectedOrg.name) : "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col gap-0 items-start">
              <p className="font-sans font-semibold text-sm">
                {selectedOrg?.name || "Select Organisation"}
              </p>
              {selectedOrg?.store_type ? (
                <span className="text-xs text-muted-foreground font-sans font-medium">
                  {selectedOrg.store_type}
                </span>
              ) : null}
            </div>
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-[260px] rounded-lg bg-white border shadow-lg z-[9999]"
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs font-sans font-medium">
          SWITCH STORE
        </DropdownMenuLabel>
        {organisations.map((org) => (
          <DropdownMenuItem key={org.id} onClick={() => onSelect(org)}>
            <Avatar>
              {org.logo ? (
                <AvatarImage src={org.logo} alt={org.name} />
              ) : (
                <AvatarFallback className="text-white bg-cyan-400">
                  {getInitials(org.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div>{org.name}</div>
              {org.store_type ? (
                <div className="text-xs text-muted-foreground">
                  {org.store_type}
                </div>
              ) : null}
            </div>
            {selectedOrg?.id === org.id ? (
              <Check className="ml-auto w-4 h-4" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem>
          <a href="/profile" className="w-full flex items-center gap-2">
            {renderUserAvatar()}
            <div>
              <div className="text-sm font-medium">
                {(user as any)?.name}{" "}
                <span className="text-muted-foreground text-xs">(You)</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Manage Profile
              </div>
            </div>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => logoutMutate()}>
          <div className="w-full flex items-center gap-2">
            <X className="ml-auto" />
            <span>{isLogoutLoading ? "Logging out..." : "Log out"}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
