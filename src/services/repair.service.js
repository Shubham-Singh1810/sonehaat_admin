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
export const getRepairServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "repair/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addRepairServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "repair/create", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateRepairServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "repair/update", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getRepairDetailsServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "repair/details", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addHowItWorksServ = async (formData) => {
    try {
      const response = await axios.put(BASE_URL + "repair/create-how-it-works", formData, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
export const deleteRepairServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "repair/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteHowItWorksRepairServ = async (formData) => {
  
  try {
    const response = await axios.post(BASE_URL + "repair/delete-how-it-works", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

