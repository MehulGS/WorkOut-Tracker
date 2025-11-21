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

export const ProfileAPI = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Profile fetch failed");
  }
};

export const EditProfileAPI = async (formData) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.put(`${API_URL}/auth/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Profile update failed");
  }
};

export const DeleteAccountAPI = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.delete(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Account delete failed");
  }
};