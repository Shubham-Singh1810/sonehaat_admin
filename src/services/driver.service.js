import axios from "axios";

import { BASE_URL } from "../utils/api_base_url_configration";

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
export const getDriverListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "driver/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getDriverDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "driver/details/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateDriverProfile = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "driver/update", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteDriverServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "driver/delete/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const dashboardDetailsServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "user/dashboard-details");
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};