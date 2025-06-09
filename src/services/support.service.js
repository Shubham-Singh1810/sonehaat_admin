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

export const getSupportDetailsServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "support/details");
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateSupportDetailsServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "support/update-details", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getFaqListServ = async () => {
  try {
    const response = await axios.get(BASE_URL + "support/list-faq");
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addFaqServ = async (formData) => {
    try {
      const response = await axios.post(BASE_URL + "support/create-faq", formData);
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};
export const deleteFaqServ = async (id) => {
    try {
      const response = await axios.delete(BASE_URL + "support/delete-faq/"+id, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
};

export const getContactListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "support/list-contact-query", payload);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};


