import { useQuery } from "react-query";
import fivetranService from "../../services/fivetranService";
import useUserProfileStore from "../../hooks/useUserProfileStore";

export const useGoogleBusinessConnection = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);
  const organisationId = loggedInUser?.organisations?.[0]?.id;

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
      refetchOnWindowFocus: true,
      staleTime: 0,
      cacheTime: 1 * 60 * 1000, // 1 minute cache
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
      onError: (error: any) => {
        if (error?.response?.status !== 404) {
          console.error("Error checking Google Business connection:", error);
        }
      },
    }
  );

  const isConnected =
    status?.connected &&
    status?.has_valid_token !== false &&
    status?.status === "connected";
  return {
    isConnected: isConnected || false,
    isLoading,
    connectionStatus: status?.status || "not_configured",
    refetch,
  };
};
