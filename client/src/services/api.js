import axios from "axios";

// auth.routes.js is mounted at '/auth' in server.js, not under '/api'
const AUTH_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '/auth') || "http://localhost:3000/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// AUTHENTICATION

const signin = async (email, password) => {
  const response = await API.post(`${AUTH_BASE_URL}/signin`, { email, password });
  return response.data;
};

const signup = async (name, email, password) => {
  const response = await API.post("/users", { name, email, password });
  return response.data;
};

const signout = async () => {
  const response = await API.get(`${AUTH_BASE_URL}/signout`);
  return response.data;
};

// CONTACTS

const getAllContacts = async () => {
  const response = await API.get("/contacts");
  return response.data;
};

const getContactById = async (id) => {
  const response = await API.get(`/contacts/${id}`);
  return response.data;
};

const createContact = async (contactData) => {
  const response = await API.post("/contacts", contactData);
  return response.data;
};

const updateContact = async (id, contactData) => {
  const response = await API.put(`/contacts/${id}`, contactData);
  return response.data;
};

const deleteContact = async (id) => {
  const response = await API.delete(`/contacts/${id}`);
  return response.data;
};

// PROJECTS

const getAllProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

const getProjectById = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data;
};

const createProject = async (projectData) => {
  const response = await API.post("/projects", projectData);
  return response.data;
};

const updateProject = async (id, projectData) => {
  const response = await API.put(`/projects/${id}`, projectData);
  return response.data;
};

const deleteProject = async (id) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};

// QUALIFICATIONS

const getAllQualifications = async () => {
  const response = await API.get("/qualifications");
  return response.data;
};

const getQualificationById = async (id) => {
  const response = await API.get(`/qualifications/${id}`);
  return response.data;
};

const createQualification = async (qualData) => {
  const response = await API.post("/qualifications", qualData);
  return response.data;
};

const updateQualification = async (id, qualData) => {
  const response = await API.put(`/qualifications/${id}`, qualData);
  return response.data;
};

const deleteQualification = async (id) => {
  const response = await API.delete(`/qualifications/${id}`);
  return response.data;
};

// USERS

const getUserProfile = async () => {
  const response = await API.get("/users/profile");
  return response.data;
};

export default API;
export {
  signin,
  signup,
  signout,
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAllQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
  getUserProfile,
};
