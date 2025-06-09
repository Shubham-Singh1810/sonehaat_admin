import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
export const getTicketListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "ticket/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateTicketServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "ticket/update", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getTicketCategoryListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "ticket-category/list", payload);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const ticketAddServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "ticket-category/create", payload);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const ticketUpdateServ = async (payload) => {
  try {
    const response = await axios.put(BASE_URL + "ticket-category/update", payload);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const ticketDeleteServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "ticket-category/delete/"+ id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getTicketDetailsServ = async (id) => {
  try {
    const response = await axios.post(BASE_URL + "chat/list/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const sendMessageServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "chat/create", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateMessageStatusServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "chat/update", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};