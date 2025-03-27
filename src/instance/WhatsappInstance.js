import axios from "axios";
const whatsappApi = axios.create({
  baseURL: "http://13.51.87.99:3000/whatsapp/message",
  // baseURL: "http://localhost:3000/whatsapp/message",
 
});

export default whatsappApi;
