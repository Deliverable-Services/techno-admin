import React from "react";
import { useQuery } from "react-query";
import fivetranService from "../services/fivetranService";
import useUserProfileStore from "./useUserProfileStore";

export const useGoogleBusinessConnection = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);

  // Try multiple ways to get organisation ID for compatibility
  const organisationId =
    loggedInUser?.organisation?.id ||
    loggedInUser?.organisations?.[0]?.id ||
    loggedInUser?.primaryOrganisation?.id;

  const {
    data: status,
    isLoading,
    refetch,
  } = useQuery(
    ["google-business-connection-status", organisationId],
    () => fivetranService.getGoogleBusinessStatus(organisationId!),
    {
      enabled: !!organisationId,
      retry: false,
      refetchOnWindowFocus: true, // Enable refetch on focus
      staleTime: 0, // Always fetch fresh data
      cacheTime: 1 * 60 * 1000, // 1 minute cache
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
      onError: (error: any) => {
        // Ignore 404 errors - if service is not connected, this will throw 404
        if (error?.response?.status !== 404) {
          console.error("Error checking Google Business connection:", error);
        }
      },
    }
  );

  // More flexible connection detection - connected if OAuth completed OR fully connected
  const isConnected =
    status?.connected ||
    status?.oauth_completed ||
    (status?.status && ["connected", "pending"].includes(status.status));

  return {
    isConnected: isConnected || false,
    isLoading,
    connectionStatus: status?.status || "not_configured",
    refetch, // Expose refetch function
  };
};
