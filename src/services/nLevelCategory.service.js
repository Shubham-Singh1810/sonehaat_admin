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

export const getNlevelCategoryTreeServ = async (subCategoryId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}n-level-category/${subCategoryId}`,
        getConfig()
      );
      return res;
    } catch (err) {
      console.error("Error fetching N-level categories:", err);
      throw err;
    }
  };
 
  export const createNlevelCategoryServ = async (formData) => {
    try {
      const res = await axios.post(
        `${BASE_URL}n-level-category/create`,
        formData,
      );
      return res;
    } catch (err) {
      console.error("Error creating N-level category:", err);
      throw err;
    }
  };

  export const updateNlevelCategoryServ = async (id, formData) => {
    try {
      const res = await axios.put(
        `${BASE_URL}n-level-category/update/${id}`,
        formData,
        getConfig()
      );
      return res;
    } catch (err) {
      console.error("Error updating N-level category:", err);
      throw err;
    }
  };
  
  export const deleteNlevelCategoryServ = async (id) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}n-level-category/delete/${id}`,
        getConfig()
      );
      return res;
    } catch (err) {
      console.error("Error deleting N-level category:", err);
      throw err;
    }
  };