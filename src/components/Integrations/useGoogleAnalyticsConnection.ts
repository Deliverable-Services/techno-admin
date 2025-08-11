import { useQuery } from "react-query";
import googleAnalyticsService from "../../services/googleAnalyticsService";
import { useOrganisation } from "../../context/OrganisationContext";

export const useGoogleAnalyticsConnection = () => {
  const { selectedOrg } = useOrganisation();
  const organisationId = selectedOrg?.id;

  const {
    data: status,
    isLoading,
    refetch,
  } = useQuery(
    ["google-analytics-status", organisationId],
    () => googleAnalyticsService.getStatus(organisationId!),
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
          console.error("Error checking Google Analytics connection:", error);
        }
      },
    }
  );

  // More flexible connection detection - connected if OAuth completed OR fully connected
  const isConnected = !!status?.connected;

  return {
    isConnected: isConnected || false,
    isLoading,
    connectionStatus: status?.status || "not_configured",
    refetch, // Expose refetch function
  };
};
