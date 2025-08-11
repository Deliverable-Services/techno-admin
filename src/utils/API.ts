import axios from "axios";
import { config } from "./constants";

const API = axios.create({
  baseURL: config.adminApiBaseUrl,
});

// Attach current organisation header and bearer token on every request
API.interceptors.request.use((req) => {
  try {
    // Token
    const token = localStorage.getItem("token");
    if (token) {
      req.headers = req.headers || {};
      req.headers.Authorization = `Bearer ${token}`;
    }

    // Selected organisation
    const stored = localStorage.getItem("selectedOrganisation");
    if (stored) {
      const org = JSON.parse(stored);
      const orgId = org?.id;
      if (orgId) {
        req.headers = req.headers || {};
        req.headers["X-Organisation-Id"] = String(orgId);
      }
    }
  } catch {
    // noop
  }
  return req;
});

// Response interceptor to transparently refresh token once on 401 and retry
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (isRefreshing) {
          await new Promise<void>((resolve) => pendingQueue.push(resolve));
        } else {
          isRefreshing = true;
          const res = await API.post("auth/refresh");
          // Persist the new token from refresh response
          try {
            const newToken = res?.data?.access_token || res?.data?.token;
            if (newToken) {
              localStorage.setItem("token", newToken);
            }
          } catch {}
          isRefreshing = false;
          pendingQueue.forEach((resolve) => resolve());
          pendingQueue = [];
        }
        // Update header with latest token
        const newToken = localStorage.getItem("token");
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return API(originalRequest);
      } catch (e) {
        isRefreshing = false;
        pendingQueue = [];
        // Bubble up to auth error handler (will redirect to login)
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
