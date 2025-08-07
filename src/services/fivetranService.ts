import API from "../utils/API";

export interface FivetranConnectorStatus {
  connected: boolean;
  status: string;
  oauth_completed?: boolean;
  connector_name?: string;
  connected_at?: string;
  last_sync_at?: string;
  has_valid_token?: boolean;
  latest_sync?: {
    status: string;
    started_at: string;
    completed_at: string;
    records_synced: number;
  } | null;
}

export interface GoogleBusinessAuthResponse {
  auth_url: string;
  state: string;
  connector_id: number;
}

class FivetranService {
  /**
   * Start Google Business Profile OAuth flow
   */
  async startGoogleBusinessAuth(
    organisationId: number
  ): Promise<GoogleBusinessAuthResponse> {
    const response = await API.get("/google-business/auth/start", {
      params: { organisation_id: organisationId },
    });
    return response.data;
  }

  /**
   * Get Google Business Profile connection status
   */
  async getGoogleBusinessStatus(
    organisationId: number
  ): Promise<FivetranConnectorStatus> {
    const response = await API.get("/google-business/status", {
      params: { organisation_id: organisationId },
    });
    return response.data;
  }

  /**
   * Disconnect Google Business Profile
   */
  async disconnectGoogleBusiness(
    organisationId: number
  ): Promise<{ message: string }> {
    const response = await API.post("/google-business/disconnect", {
      organisation_id: organisationId,
    });
    return response.data;
  }

  /**
   * Open OAuth popup window and handle the flow
   */
  openOAuthPopup(
    authUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const popup = window.open(
        authUrl,
        "fivetran_oauth",
        "width=600,height=700,scrollbars=yes,resizable=yes,centerscreen=yes"
      );

      if (!popup) {
        resolve({
          success: false,
          error: "Popup blocked. Please allow popups for this site.",
        });
        return;
      }

      // Poll for popup closure
      const pollTimer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(pollTimer);
            // Give a moment for any background processing
            setTimeout(() => {
              resolve({ success: true });
            }, 1000);
          }
        } catch (error) {
          // Handle cross-origin errors
          clearInterval(pollTimer);
          resolve({ success: true });
        }
      }, 1000);

      // Timeout after 10 minutes
      setTimeout(() => {
        clearInterval(pollTimer);
        if (!popup.closed) {
          popup.close();
        }
        resolve({ success: false, error: "OAuth flow timed out" });
      }, 10 * 60 * 1000);
    });
  }
}

export default new FivetranService();
