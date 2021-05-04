import axios from "axios";
import { adminApiBaseUrl } from "./constants";





const API = axios.create({
    baseURL: adminApiBaseUrl,

    // baseURL: config.baseURL,
});

export default API;