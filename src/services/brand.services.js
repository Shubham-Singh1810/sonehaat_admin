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
export const getBrandServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "brand/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getBrandDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "brand/details/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const addBrandServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "brand/create", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateBrandServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "brand/update", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteBrandServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "brand/delete/"+id,  getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
