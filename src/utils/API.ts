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

export default API;
