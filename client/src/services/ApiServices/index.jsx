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

export const AddWeightAPI = async (data) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(`${API_URL}/auth/weight`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Weight update failed");
  }
};

export const GetWeightLogsAPI = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/auth/weight-log`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Weight logs fetch failed");
  }
};

export const GetNutritionEntriesAPI = async (page = 1, limit = 10) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/nutrition`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Nutrition entries fetch failed");
  }
};

export const GetDailyNutritionSummaryAPI = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/nutrition/summary/daily`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Daily nutrition summary fetch failed");
  }
};

export const AddNutritionAPI = async ({ foodName, calories, quantity, time, mealType }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/nutrition`,
      { foodName, calories, quantity, time, mealType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Add nutrition entry failed");
  }
};

export const GetExerciseBodyPartsAPI = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/exercise/body-parts/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Exercise body parts fetch failed");
  }
};

export const AddExerciseBodyPartAPI = async ({ name }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/exercise/body-part`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Add exercise body part failed");
  }
};

export const AddExerciseAPI = async ({ bodyPartId, name }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/exercise/`,
      { bodyPartId, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Add exercise failed");
  }
};

export const CreateGroupExerciseAPI = async (roomId, { bodyPartId, name }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/gymmate/groups/${roomId}/exercise`,
      { bodyPartId, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Create group exercise failed");
  }
};

export const GetBodyPartExercisesAPI = async (id) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/exercise/body-part/${id}/exercises`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Body part exercises fetch failed");
  }
};

export const GetExerciseHistoryAPI = async (exerciseId, page = 1, limit = 10) => {
  try {
    const token = sessionStorage.getItem("authToken");

    const response = await axios.get(`${API_URL}/exercise/${exerciseId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Exercise history fetch failed");
  }
};

export const GetGroupExerciseOverviewAPI = async (roomId, exerciseId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(
      `${API_URL}/gymmate/groups/${roomId}/exercise/${exerciseId}/overview`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Group exercise overview fetch failed");
  }
};

export const GetGroupsAPI = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/gymmate/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Groups fetch failed");
  }
};

export const CreateGroupAPI = async ({ name }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/gymmate/groups`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Create group failed");
  }
};

export const InviteMembersToGroupAPI = async (roomId, { email, emails, name }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/gymmate/groups/${roomId}/invite`,
      { email, emails, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Invite members failed");
  }
};

export const LogExerciseSetAPI = async ({ exerciseId, weightKg, reps }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/exercise/set`,
      { exerciseId, weightKg, reps },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Log exercise set failed");
  }
};

export const GroupLogExerciseSetAPI = async ({ roomId, exerciseId, weightKg, reps }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/gymmate/groups/${roomId}/set`,
      { exerciseId, weightKg, reps },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Group log exercise set failed");
  }
};

export const GetUserDetailsAPI = async (id) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/gymmate/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("User details fetch failed");
  }
};

export const RemoveMemberFromGroupAPI = async ({ roomId, memberId }) => {
  try {
    const token = sessionStorage.getItem("authToken");

    const response = await axios.delete(
      `${API_URL}/gymmate/groups/${roomId}/member/${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Remove member failed");
  }
};

export const GetGroupBodyPartsWithExercisesAPI = async (roomId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(
      `${API_URL}/gymmate/groups/${roomId}/body-parts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Group body parts fetch failed");
  }
};

export const CreateGroupBodyPartAPI = async (roomId, { days, name }) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.post(
      `${API_URL}/gymmate/groups/${roomId}/body-part`,
      { days, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Create group body part failed");
  }
};

export const GetGroupBodyPartExercisesAPI = async (roomId, bodyPartId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.get(
      `${API_URL}/gymmate/groups/${roomId}/body-part/${bodyPartId}/exercises`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Group body part exercises fetch failed");
  }
};

export const DeleteGroupAPI = async (roomId) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.delete(
      `${API_URL}/gymmate/groups/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Delete group failed");
  }
};