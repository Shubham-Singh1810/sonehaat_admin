import axios from "axios";
import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = () => ({
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export const getOperationalCityServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "operational-city/list",
      formData
    );
    return response;
  } catch (error) {
    console.error("Error fetching Operational Cities:", error);
    throw error;
  }
};

export const addOperationalCityServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "operational-city/create",
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error creating Operational City:", error);
    throw error;
  }
};

export const updateOperationalCityServ = async (formData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}operational-city/update/${formData._id}`,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error updating Operational City:", error);
    throw error;
  }
};


export const deleteOperationalCityServ = async (id) => {
  try {
    const response = await axios.delete(
      BASE_URL + "operational-city/delete/" + id,
      getConfig()
    );
    return response;
  } catch (error) {
    console.error("Error deleting Operational City:", error);
    throw error;
  }
};
