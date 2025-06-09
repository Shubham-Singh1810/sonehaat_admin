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
export const getBookingListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "booking/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const assignVenderServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "booking/assign-vender/"+formData?.bookingId, {venderId : formData?.venderId});
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const markBookingDoneServ = async (id) => {
  try {
    const response = await axios.post(BASE_URL + "booking/mark-done/"+id, {});
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

