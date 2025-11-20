import axios from "axios";

var API_URL=import.meta.env.VITE_BACKEND_URL;

export const LoginAPI = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};