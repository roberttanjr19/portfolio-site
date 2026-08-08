import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";
// auth.routes.js is mounted at '/auth' in server.js, not under '/api'
const AUTH_BASE_URL = "http://localhost:3000/auth";

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

// AUTHENTICATION

export const signin = async (email, password) => {
  const response = await api.post(`${AUTH_BASE_URL}/signin`, { email, password });
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await api.post("/users", { name, email, password });
  return response.data;
};

export const signout = async () => {
  const response = await api.get(`${AUTH_BASE_URL}/signout`);
  return response.data;
};

// CONTACTS

export const getAllContacts = async () => {
  const response = await api.get("/contacts");
  return response.data;
};

export const getContactById = async (id) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (contactData) => {
  const response = await api.post("/contacts", contactData);
  return response.data;
};

export const updateContact = async (id, contactData) => {
  const response = await api.put(`/contacts/${id}`, contactData);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

// PROJECTS

export const getAllProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// QUALIFICATIONS

export const getAllQualifications = async () => {
  const response = await api.get("/qualifications");
  return response.data;
};

export const getQualificationById = async (id) => {
  const response = await api.get(`/qualifications/${id}`);
  return response.data;
};

export const createQualification = async (qualData) => {
  const response = await api.post("/qualifications", qualData);
  return response.data;
};

export const updateQualification = async (id, qualData) => {
  const response = await api.put(`/qualifications/${id}`, qualData);
  return response.data;
};

export const deleteQualification = async (id) => {
  const response = await api.delete(`/qualifications/${id}`);
  return response.data;
};

// USERS

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export default api;
