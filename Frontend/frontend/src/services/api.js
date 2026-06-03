import axios from "axios";

const API = axios.create({
  baseURL: "https://minicrud-production.up.railway.app",
});

export default API;