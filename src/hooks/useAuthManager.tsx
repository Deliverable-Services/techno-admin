import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useTokenStore from "./useTokenStore";
import useUserProfileStore from "./useUserProfileStore";
import API from "../utils/API";
import { AxiosError } from "axios";
import { config } from "../utils/constants";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useAuthManager = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
  });

  const history = useHistory();
  const { pathname } = useLocation();
  const token = useTokenStore((state) => state.accessToken);
  const setToken = useTokenStore((state) => state.setToken);
  const removeToken = useTokenStore((state) => state.removeToken);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserPermissions = useUserProfileStore(
    (state) => state.setUserPermssions
  );

  // Clear all authentication data
  const clearAuthData = () => {
    localStorage.clear();
    sessionStorage.clear();
    removeToken();
    setUser(null);
    setUserPermissions([]);

    // Clear browser cache if available
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
  };

  // Check if token exists in localStorage
  const getStoredToken = (): string | null => {
    try {
      const storedTokenData = localStorage.getItem("accessToken");
      if (storedTokenData) {
        const parsedData = JSON.parse(storedTokenData);
        return parsedData?.state?.accessToken || null;
      }
    } catch (error) {
      console.error("Error parsing stored token:", error);
    }
    return null;
  };

  // Validate token and get user profile
  const validateTokenAndGetProfile = async (
    tokenToValidate: string
  ): Promise<boolean> => {
    try {
      const response = await API.get(`${config.adminApiBaseUrl}profile`, {
        headers: {
          Authorization: `Bearer ${tokenToValidate}`,
        },
      });

      if (response.data?.user) {
        // Token is valid, set user data
        setUser(response.data.user);
        setUserPermissions(response.data.permissions || []);

        // Ensure token is in store if it's not already there
        if (!token) {
          setToken(tokenToValidate);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  };

  // Try to refresh the token
  const refreshToken = async (): Promise<string | null> => {
    try {
      const response = await API.post("/auth/refresh");
      if (response.data?.access_token) {
        const newToken = response.data.access_token;
        setToken(newToken);
        return newToken;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
    return null;
  };

  // Main authentication check
  const checkAuthentication = async () => {
    const isLoginPage =
      pathname.includes("login") || pathname.includes("verify-otp");

    // Skip auth check on login pages
    if (isLoginPage) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    // Get token from store or localStorage
    const currentToken = token || getStoredToken();

    if (!currentToken) {
      // No token found anywhere - logout
      clearAuthData();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      history.replace("/login");
      return;
    }

    // Try to validate the current token
    const isTokenValid = await validateTokenAndGetProfile(currentToken);

    if (isTokenValid) {
      // Token is valid
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    // Token is invalid, try to refresh
    console.log("Token invalid, attempting refresh...");
    const newToken = await refreshToken();

    if (newToken) {
      // Refresh successful, validate new token
      const isNewTokenValid = await validateTokenAndGetProfile(newToken);

      if (isNewTokenValid) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        return;
      }
    }

    // Both original token and refresh failed - logout
    console.log("Authentication failed, logging out...");
    clearAuthData();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    });
    history.replace("/login");
  };

  // Initialize authentication on app start
  useEffect(() => {
    // Small delay to ensure stores are hydrated
    const timer = setTimeout(() => {
      checkAuthentication();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run when pathname changes

  // Set up API interceptor for automatic token refresh on 401 errors
  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true;

          const newToken = await refreshToken();
          if (newToken) {
            // Update the authorization header and retry the request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            return API(originalRequest);
          } else {
            // Refresh failed, logout
            clearAuthData();
            history.replace("/login");
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, []);

  // Update API headers when token changes
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);

  return authState;
};

export default useAuthManager;
