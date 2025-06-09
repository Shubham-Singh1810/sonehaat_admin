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
export const getOrderListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "booking/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const assignDriverServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "driver/assign-products", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const addCategoryServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "category/create", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateCategoryServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "category/update", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteCategoryServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "category/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
