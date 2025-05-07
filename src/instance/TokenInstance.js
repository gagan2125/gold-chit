import axios from "axios";
const token = localStorage.getItem("token");
const api = axios.create({
   baseURL: "http://13.51.87.99:3000/api",
  //baseURL: "http://localhost:3000/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
