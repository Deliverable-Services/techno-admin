import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import fivetranService, {
  FivetranConnectorStatus,
} from "../../services/fivetranService";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { handleApiError } from "../../hooks/handleApiErrors";

interface UseGoogleBusinessIntegrationProps {
  organisationId?: number;
  onConnectionChange?: () => void;
}

export const useGoogleBusinessIntegration = ({
  organisationId,
  onConnectionChange,
}: UseGoogleBusinessIntegrationProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();
  const history = useHistory();

  // Query to get current connection status
  const {
    data: status,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useQuery<FivetranConnectorStatus>(
    ["google-business-status", organisationId],
    () => fivetranService.getGoogleBusinessStatus(organisationId!),
    {
      enabled: !!organisationId,
      retry: false,
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        // Only show error if it's not a 404 (not configured)
        if (error.response?.status !== 404) {
          handleApiError(error, history);
        }
      },
    }
  );

  // Mutation to start OAuth flow
  const connectMutation = useMutation(
    () => fivetranService.startGoogleBusinessAuth(organisationId!),
    {
      onSuccess: async (authData) => {
        setIsConnecting(true);

        try {
          // Open OAuth popup
          const result = await fivetranService.openOAuthPopup(
            authData.auth_url
          );

          if (result.success) {
            // Refetch status after successful OAuth
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait a bit for backend processing
            await refetchStatus();
            showMsgToast("Google Business Profile connected successfully!");

            // Call the connection change callback if provided
            if (onConnectionChange) {
              onConnectionChange();
            }
          } else {
            showErrorToast(result.error || "Failed to complete OAuth flow");
          }
        } catch (error) {
          showErrorToast("Failed to connect Google Business Profile");
          console.error("OAuth error:", error);
        } finally {
          setIsConnecting(false);
        }
      },
      onError: (error: AxiosError) => {
        setIsConnecting(false);
        handleApiError(error, history);
      },
    }
  );

  // Mutation to disconnect
  const disconnectMutation = useMutation(
    () => fivetranService.disconnectGoogleBusiness(organisationId!),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([
          "google-business-status",
          organisationId,
        ]);
        showMsgToast(
          data.message || "Google Business Profile disconnected successfully"
        );
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  // Connect function
  const connect = useCallback(() => {
    if (!organisationId) {
      showErrorToast("Organization ID not found");
      return;
    }
    connectMutation.mutate();
  }, [organisationId, connectMutation]);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (!organisationId) {
      showErrorToast("Organization ID not found");
      return;
    }
    disconnectMutation.mutate();
  }, [organisationId, disconnectMutation]);

  // Derived state
  const isConnected = status?.connected || false;
  const connectionStatus = status?.status || "not_configured";
  const hasValidToken = status?.has_valid_token || false;
  const connectorName = status?.connector_name;
  const connectedAt = status?.connected_at;
  const lastSyncAt = status?.last_sync_at;
  const latestSync = status?.latest_sync;

  const isLoading =
    isLoadingStatus ||
    isConnecting ||
    connectMutation.isLoading ||
    disconnectMutation.isLoading;

  return {
    // State
    isConnected,
    connectionStatus,
    hasValidToken,
    connectorName,
    connectedAt,
    lastSyncAt,
    latestSync,
    isLoading,
    isConnecting,

    // Actions
    connect,
    disconnect,
    refetchStatus,

    // Mutation states
    isConnectingOAuth: connectMutation.isLoading,
    isDisconnecting: disconnectMutation.isLoading,

    // Raw data
    status,
    error: statusError,
  };
};
