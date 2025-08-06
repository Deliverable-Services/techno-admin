import { AxiosError } from "axios";
import API from "../utils/API";
import useTokenStore from "../hooks/useTokenStore";

export const handleApiError = async (error: AxiosError, history: any) => {
  if (!error) return;
  console.log("error", error);
  const is401Error = error?.response?.status === 401;
  console.log("is401Error", is401Error);
  if (!is401Error) {
    localStorage.clear();
    sessionStorage.clear();
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
    return;
  }

  try {
    const { data } = await API.post("/auth/refresh");
    if (data) useTokenStore.getState().setToken(data.access_token);
  } catch (error) {
    console.log("error", error);
    localStorage.clear();
    sessionStorage.clear();
    useTokenStore.getState().removeToken();
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
    history.push("/login");
  }
};
