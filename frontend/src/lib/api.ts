import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

export const projectAPI = {
  create: (data) => api.post("/projects", data),
  list: () => api.get("/projects"),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const taskAPI = {
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
  byProject: (projectId, filters) => api.get(`/tasks/project/${projectId}`, { params: filters }),
  dashboardStats: () => api.get("/tasks/dashboard/stats"),
};

export default api;
