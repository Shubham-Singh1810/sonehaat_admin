import axios from "axios";
import { BASE_URL } from "../../src/utils/api_base_url_configration";

// Fetch product FAQ list
export const getProductFaqListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "productFaq/list", formData);
    return response;
  } catch (error) {
    console.error("Error fetching product FAQ list:", error);
    throw error;
  }
};
