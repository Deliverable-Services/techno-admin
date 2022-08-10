import axios from "axios";
import { config } from "./constants";

const API = axios.create({
  baseURL: config.adminApiBaseUrl,
});

export default API;
