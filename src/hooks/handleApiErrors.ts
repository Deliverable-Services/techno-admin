import { AxiosError } from "axios";

export const handleApiError = async (error: AxiosError, history?: any) => {
  if (!error) return;

  // Log error for debugging
  console.error("API Error:", error.response?.status, error.message);

  // For non-401 errors, just log and return
  // The useAuthManager hook will handle 401 errors via interceptors
  if (error?.response?.status !== 401) {
    console.error("Non-auth error:", error.message);
    return;
  }

  // 401 errors are now handled by the API interceptor in useAuthManager
  // This function is kept for backward compatibility but logic is simplified
  console.log("401 error detected - should be handled by auth manager");
};
