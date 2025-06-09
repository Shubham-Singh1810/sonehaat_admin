import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

import { updateProductServ } from "../../services/product.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import JoditEditor from "jodit-react";
import Select from "react-select";
import {
  getCategoryServ,
  getCategoryDetailsServ,
} from "../../services/category.service";

import { getZipcodeServ } from "../../services/zipcode.service";
import { getBrandServ } from "../../services/brand.services";
import { useParams, useNavigate } from "react-router-dom";
function ProductUpdateStep2() {
  const params = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [_id, setId] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const contentRef = useRef(""); // ✅ Store content without causing re-renders

  // Jodit Editor Config
  const config = {
    placeholder: "Start typing...",
    height: "400px",
  };
  const [formData, setFormData] = useState({
    minOrderQuantity: "",
    maxOrderQuantity: "",
    warrantyPeriod: "",
    guaranteePeriod: "",
    categoryId: "",
    subCategoryId: "",
    stockQuantity: "",
    brandId: "",
    zipcodeId: [],
    isProductReturnable: "",
    isCodAllowed: "",
    isProductTaxIncluded: "",
    isProductCancelable: "",
    productVideoUrl: "",
    description: "",
    price: "",
    discountedPrice: "",
  });
  const [categoryList, setCategoryList] = useState([]);
  const getCategoryFunc = async () => {
    try {
      let response = await getCategoryServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setCategoryList(response?.data?.data);
      }
    } catch (error) {}
  };
  const [subCategoryList, setSubCategoryList] = useState([]);
  const getSubCategoryFunc = async () => {
    try {
      let response = await getCategoryDetailsServ(formData?.categoryId);
      if (response?.data?.statusCode == "200") {
        setSubCategoryList(response?.data?.data?.SubCategoryList);
      }
    } catch (error) {}
  };
  const [zipcodeList, setZipcodeList] = useState([]);
  const getZipcodeFunc = async () => {
    try {
      let response = await getZipcodeServ();
      if (response?.data?.statusCode == "200") {
        setZipcodeList(response?.data?.data);
      }
    } catch (error) {}
  };
  const [brandList, setBrandList] = useState([]);
  const getBrandList = async () => {
    try {
      let response = await getBrandServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setBrandList(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getCategoryFunc();
    getZipcodeFunc();
    getBrandList();
  }, []);
  useEffect(() => {
    if (formData?.categoryId) {
      getSubCategoryFunc();
    }
  }, [formData?.categoryId]);
  const updateProductFunc = async () => {
    setBtnLoader(true);
    try {
      let response = await updateProductServ({ ...formData, id: params?.id });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          minOrderQuantity: "",
          maxOrderQuantity: "",
          warrantyPeriod: "",
          guaranteePeriod: "",
          categoryId: "",
          subCategoryId: "",
          stockQuantity: "",
          brandId: "",
          zipcodeId: [],
          isProductReturnable: "",
          isCodAllowed: "",
          isProductTaxIncluded: "",
          isProductCancelable: "",
          productVideoUrl: "",
          description: "",
          price: "",
          discountedPrice: "",
        });
        navigate("/update-product-step3/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setBtnLoader(false);
  };
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          ></div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4
                    className="p-2 text-dark shadow rounded mb-4 "
                    style={{ background: "#05E2B5" }}
                  >
                    Update Product : Step 2/4
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Min Order Quantity</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderQuantity: e?.target.value,
                      })
                    }
                    value={formData?.minOrderQuantity}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Max Order Quantity</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxOrderQuantity: e?.target.value,
                      })
                    }
                    value={formData?.maxOrderQuantity}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Warranty Period</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warrantyPeriod: e?.target.value,
                      })
                    }
                    value={formData?.warrantyPeriod}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Guarantee Period</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guaranteePeriod: e?.target.value,
                      })
                    }
                    value={formData?.guaranteePeriod}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Stock Quantity</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e?.target.value,
                      })
                    }
                    value={formData?.stockQuantity}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Brand</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandId: e?.target.value,
                      })
                    }
                    value={formData?.brandId}
                    className="form-control"
                  >
                    <option>Select</option>
                    {brandList?.map((v, i) => {
                      return <option value={v?._id}>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Select Category</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e?.target.value,
                      })
                    }
                    value={formData?.categoryId}
                    className="form-control"
                  >
                    <option>Select</option>
                    {categoryList?.map((v, i) => {
                      return <option value={v?._id}>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Select Sub Category</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategoryId: e?.target.value,
                      })
                    }
                    value={formData?.subCategoryId}
                    className="form-control"
                  >
                    <option>Select</option>
                    {subCategoryList?.map((v, i) => {
                      return <option value={v?._id}>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Select Deliverable Zipcodes</label>
                  <Select
                    isMulti
                    options={zipcodeList?.map((v) => ({
                      label: v?.zipcode,
                      value: v?._id,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        zipcodeId: selectedOptions.map(
                          (option) => option.value
                        ), // only array of string IDs
                      })
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Product Price</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e?.target.value,
                      })
                    }
                    value={formData?.price}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Product Discounted Price</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountedPrice: e?.target.value,
                      })
                    }
                    value={formData?.discountedPrice}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Video URL</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productVideoUrl: e?.target.value,
                      })
                    }
                    value={formData?.productVideoUrl}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Product Returnable</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isProductReturnable: e?.target.value,
                      })
                    }
                    value={formData?.isProductReturnable}
                    className="form-control"
                  >
                    <option>Select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Product COD Allowed</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isCodAllowed: e?.target.value,
                      })
                    }
                    value={formData?.isCodAllowed}
                    className="form-control"
                  >
                    <option>Select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Product Tax Included</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isProductTaxIncluded: e?.target.value,
                      })
                    }
                    value={formData?.isProductTaxIncluded}
                    className="form-control"
                  >
                    <option>Select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Product Cancelable</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isProductCancelable: e?.target.value,
                      })
                    }
                    value={formData?.isProductCancelable}
                    className="form-control"
                  >
                    <option>Select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="col-12 mb-3">
                  <label>Product Description</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent; // ✅ Update ref without re-rendering
                    }}
                  />
                </div>
                {btnLoader ? (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                        opacity: "0.6",
                      }}
                    >
                      Updating ...
                    </button>
                  </div>
                ) : (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                      }}
                      onClick={() => updateProductFunc()}
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdateStep2;
