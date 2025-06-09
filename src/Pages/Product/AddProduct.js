import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { getTagSetServ } from "../../services/tag.service";
import { getProductTypeServ } from "../../services/productType.service";
import { getProductLocationServ } from "../../services/ProductLocation.service";
import { getTaxServ } from "../../services/tax.service";
import { addProductServ } from "../../services/product.services";
import { getVenderListServ } from "../../services/vender.services";
import Select from "react-select";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate } from "react-router-dom";
function AddProduct() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const editor = useRef(null);
  const config = {
    placeholder: "Start typing...",
    height: "300px",
  };

  const [formData, setFormData] = useState({
    name: "",
    tags: [],
    productType: "",
    tax: "",
    madeIn: "",
    hsnCode: "",
    shortDescription: "",
    createdBy: "",
    createdByAdmin: "",
  });
  const [tags, setTags] = useState([]);
  const getTagListFunc = async () => {
    try {
      let response = await getTagSetServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setTags(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [productType, setProductType] = useState([]);
  const getProductListFunc = async () => {
    try {
      let response = await getProductTypeServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setProductType(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [taxList, setTaxList] = useState([]);
  const getTaxListFunc = async () => {
    try {
      let response = await getTaxServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setTaxList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [locationList, setLocationList] = useState([]);
  const getProductLocationList = async () => {
    try {
      let response = await getProductLocationServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setLocationList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [vendorList, setVendorList] = useState([]);
  const getVendorListFunc = async () => {
    try {
      let response = await getVenderListServ();
      if (response?.data?.statusCode == "200") {
        setVendorList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTagListFunc();
    getProductListFunc();
    getTaxListFunc();
    getProductLocationList();
    getVendorListFunc();
  }, []);
  const [loader, setLoader] = useState(false);
  const handleSubmit = async () => {
    setLoader(true);
    try {
      let finalPayload;
      if(formData?.createdByAdmin != "No"){
        finalPayload = {
          name: formData?.name,
          tags: formData?.tags,
          productType: formData?.productType,
          tax: formData?.tax,
          madeIn: formData?.madeIn,
          hsnCode: formData?.hsnCode,
          shortDescription: formData?.shortDescription,
          createdByAdmin: formData?.createdByAdmin,
        }
      }
      if(formData?.createdByAdmin == "No"){
        finalPayload = {
          name: formData?.name,
          tags: formData?.tags,
          productType: formData?.productType,
          tax: formData?.tax,
          madeIn: formData?.madeIn,
          hsnCode: formData?.hsnCode,
          shortDescription: formData?.shortDescription,
          createdBy: formData?.createdBy,
        }
      }
      let response = await addProductServ(finalPayload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          name: "",
          tags: [],
          productType: "",
          tax: "",
          madeIn: "",
          hsnCode: "",
          shortDescription: "",
          createdBy: "",
          createdByAdmin: "",
        });
        navigate("/update-product-step2/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false);
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
                    Add Product : Step 1/4
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Product Name*</label>
                  <input
                    value={formData?.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e?.target?.value })
                    }
                    className="form-control"
                    style={{ height: "45px" }}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Tags*</label>
                  <Select
                    isMulti
                    options={tags?.map((v) => ({
                      label: v?.name,
                      value: v?._id,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        tags: selectedOptions.map((option) => option.label), // only array of string IDs
                      })
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Select Product Type*</label>
                  <select
                    className="form-control"
                    value={formData?.productType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productType: e?.target?.value,
                      })
                    }
                  >
                    <option>Select</option>
                    {productType?.map((v, i) => {
                      return <option>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Select Tax*</label>
                  <select
                    className="form-control"
                    value={formData?.tax}
                    onChange={(e) =>
                      setFormData({ ...formData, tax: e?.target?.value })
                    }
                  >
                    <option>Select</option>
                    {taxList?.map((v, i) => {
                      return (
                        <option>
                          {v?.name + "" + (v?.percentage + " %")}{" "}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Made In*</label>
                  <select
                    className="form-control"
                    value={formData?.madeIn}
                    onChange={(e) =>
                      setFormData({ ...formData, madeIn: e?.target?.value })
                    }
                  >
                    <option>Select</option>
                    {locationList?.map((v, i) => {
                      return <option>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>HSN Code*</label>
                  <input
                    className="form-control"
                    style={{ height: "45px" }}
                    value={formData?.hsnCode}
                    onChange={(e) =>
                      setFormData({ ...formData, hsnCode: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Created By Admin*</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        createdByAdmin: e?.target?.value,
                      })
                    }
                  >
                    <option>Select</option>
                    <option value={globalState?.user?._id}>Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {formData?.createdByAdmin == "No" && (
                  <div className="col-6 mb-3">
                    <label>Vendor*</label>
                    <select
                      className="form-control"
                      value={formData?.createdBy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          createdBy: e?.target?.value,
                        })
                      }
                    >
                      <option>Select</option>
                      {vendorList?.map((v, i) => {
                        return (
                          <option value={v?._id}>
                            {v?.firstName + " " + v?.lastName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="col-12 mb-3">
                  <label>Short Description*</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={formData?.shortDescription}
                    onChange={(newContent) => {
                      setFormData({
                        ...formData,
                        shortDescription: newContent,
                      });
                    }}
                  />
                </div>
                {loader ? (
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
                      Saving ...
                    </button>
                  </div>
                ) : formData?.name &&
                  formData?.tags?.length > 0 &&
                  formData?.hsnCode ? (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
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
                        opacity: "0.6",
                      }}
                    >
                      Submit
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

export default AddProduct;
