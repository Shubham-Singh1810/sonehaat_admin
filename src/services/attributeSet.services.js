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
export const getAttributeSetServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "attribute-set/list", formData);
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

export const addAttributeSetServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "attribute-set/create", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateAttributeSetServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "attribute-set/update", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteAttributeSetServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "attribute-set/delete/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
