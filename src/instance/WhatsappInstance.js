import axios from "axios";
const whatsappApi = axios.create({
  baseURL: "http://16.171.198.197:3000/whatsapp/message",
  // baseURL: "http://localhost:3000/whatsapp/message",
 
});

export default whatsappApi;
