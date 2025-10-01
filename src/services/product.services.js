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
export const getProductServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "product/list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getProductDetailsServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "product/details/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getProductRatingServ = async (id) => {
  try {
    const response = await axios.get(BASE_URL + "rating/details/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addProductServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "product/create", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateProductServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "product/update", formData,);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteProductServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "product/delete/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateProductHeroImage = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "product/update/hero-image", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateProductVideoServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "product/update-video", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const updateProductGalleryServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "product/update/add-product-gallery", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteProductGalleryServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "product/delete/product-gallery", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getSubcategoryAttributeListServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "sub-category/attribute-list", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const uploadExcelServ = async (formData)=> {
  try {
    const response = await axios.post(BASE_URL + "excel/upload-or-update", formData);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export const downloadProductExportServ = async (payload, format = "excel") => {
  try {
    const response = await axios.post(`${BASE_URL}excel/export`, {
      ...payload,
      format,
    }, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error exporting product list:", error);
    throw error;
  }
};

export const downloadSampleProductFileServ = async (format = "excel") => {
  try {
    const response = await axios.get(
      `${BASE_URL}excel/sample?format=${format}`,
      { responseType: "blob" }
    );
    return response;
  } catch (error) {
    console.error("Error downloading sample file:", error);
    throw error;
  }
};