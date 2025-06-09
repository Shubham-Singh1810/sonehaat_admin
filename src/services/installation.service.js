import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    },
  };
};
export const getInstallationServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "installation/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addInstallationServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "installation/create", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateInstallationServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "installation/update", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addHowItWorksServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "installation/create-how-it-works", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteInstallationServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "installation/delete/" + id, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getInstallationDetailsServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "installation/details", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteHowItWorksInstallationServ = async (formData) => {
  
  try {
    const response = await axios.post(BASE_URL + "installation/delete-how-it-works", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
