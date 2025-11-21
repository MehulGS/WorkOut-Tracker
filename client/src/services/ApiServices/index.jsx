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

export const RegisterAPI = async (formData) => {
  try {
    // The formData is already created in the component
    const response = await axios.post(`${API_URL}/auth/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Registration failed");
  }
};

export const ForgotPasswordAPI = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Request failed");
  }
};

export const VerifyOtpAPI = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Verification failed");
  }
};

export const ResetPasswordAPI = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Verification failed");
  }
};