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
export const getServiceServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "service/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addServiceServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "service/create", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateServiceServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "service/update", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addHowItWorksServ = async (formData) => {
    try {
      const response = await axios.put(BASE_URL + "service/create-how-it-works", formData, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
export const deleteServiceServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "service/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getServiceDetailsServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "service/details", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteHowItWorksServiceServ = async (formData) => {
  
  try {
    const response = await axios.post(BASE_URL + "service/delete-how-it-works", formData );
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};