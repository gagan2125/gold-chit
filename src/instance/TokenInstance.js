import axios from "axios";
const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: "http://16.171.198.197:3000/api",
  // baseURL: "http://localhost:3000/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
