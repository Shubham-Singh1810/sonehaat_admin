import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import JoditEditor from "jodit-react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Same masters as AddProduct
import { getTagSetServ } from "../../services/tag.service";
import { getProductTypeServ } from "../../services/productType.service";
import { getProductLocationServ } from "../../services/ProductLocation.service";
import { getTaxServ } from "../../services/tax.service";
import { getVenderListServ } from "../../services/vender.services";

// Product APIs
import {
  getProductDetailsServ,
  updateProductServ,
} from "../../services/product.services";

function ProductUpdateStep1() {
  const params = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const config = { placeholder: "Start typing...", height: "300px" };

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

  // masters
  const [tags, setTags] = useState([]);
  const [productType, setProductType] = useState([]);
  const [taxList, setTaxList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  // Fetch masters (same as AddProduct)
  useEffect(() => {
    (async () => {
      const [t, pt, tx, loc, ven] = await Promise.all([
        getTagSetServ({ status: true }),
        getProductTypeServ({ status: true }),
        getTaxServ({ status: true }),
        getProductLocationServ({ status: true }),
        getVenderListServ(),
      ]);
      if (t?.data?.statusCode == "200") setTags(t?.data?.data);
      if (pt?.data?.statusCode == "200") setProductType(pt?.data?.data);
      if (tx?.data?.statusCode == "200") setTaxList(tx?.data?.data);
      if (loc?.data?.statusCode == "200") setLocationList(loc?.data?.data);
      if (ven?.data?.statusCode == "200") setVendorList(ven?.data?.data);
    })();
  }, []); // [memory:3][memory:1]

  // Prefill from product details
  useEffect(() => {
    (async () => {
      if (!params?.id) return;
      const res = await getProductDetailsServ(params.id);
      if (res?.data?.statusCode == "200") {
        const d = res?.data?.data || {};
        setFormData({
          name: d?.name || "",
          // If backend stores tags as array of strings, ok; if IDs, map to names you want to display
          tags: Array.isArray(d?.tags) ? d.tags : [],
          productType: d?.productType || "",
          tax: d?.tax || "",
          madeIn: d?.madeIn || "",
          hsnCode: d?.hsnCode || "",
          shortDescription: d?.shortDescription || "",
          createdBy: d?.createdBy?._id ? String(d.createdBy._id) : "",
          // if backend stores boolean or adminId, normalize to "Yes"/"No" used by UI
          createdByAdmin: d?.createdByAdmin
            ? typeof d.createdByAdmin === "string"
              ? d.createdByAdmin
              : "Yes"
            : "No",
        });
      }
    })();
  }, [params?.id]); // [memory:1]

  const [loader, setLoader] = useState(false);
  // ProductUpdateStep1.jsx
const handleUpdateAndNext = async () => {
    setLoader(true);
    try {
      const isAdminCreate = formData?.createdByAdmin === "Yes";
      const payload = {
        _id: String(params?.id),
        name: formData?.name,
        tags: formData?.tags,
        productType: formData?.productType,
        tax: formData?.tax,
        madeIn: formData?.madeIn,
        hsnCode: formData?.hsnCode,
        shortDescription: formData?.shortDescription,
        createdBy: isAdminCreate ? null : (formData?.createdBy || null),
        createdByAdmin: isAdminCreate ? (localStorage.getItem("adminId") || null) : null,
      };
      // remove keys with null to avoid unintended overwrites if you prefer
      Object.keys(payload).forEach(k => payload[k] === null && delete payload[k]);
  
      const resp = await updateProductServ(payload);
      if (resp?.data?.statusCode == "200") {
        toast.success(resp?.data?.message);
        navigate(`/update-product-step2/${params?.id}`);
      } else {
        toast.error("Something went wrong");
      }
    } catch (e) {
      toast.error("Internal Server Error");
    } finally {
      setLoader(false);
    }
  };
  

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4
                    className="p-2 text-dark shadow rounded mb-4"
                    style={{ background: "#e6f2ff" }}
                  >
                    Update Product : Step 1/4
                  </h4>
                </div>
              </div>

              {/* Same form as AddProduct, but values from formData and button text changed */}
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
                    value={tags
                      .filter((v) => formData.tags.includes(v?.name))
                      .map((v) => ({ label: v?.name, value: v?._id }))}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        tags: selected.map((o) => o.label), // match AddProduct behavior
                      })
                    }
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
                    {productType?.map((v) => (
                      <option key={v?._id}>{v?.name}</option>
                    ))}
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
                    {taxList?.map((v) => (
                      <option key={v?._id}>
                        {v?.name + "" + (v?.percentage + " %")}
                      </option>
                    ))}
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
                    {locationList?.map((v) => (
                      <option key={v?._id}>{v?.name}</option>
                    ))}
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
                    value={formData?.createdByAdmin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        createdByAdmin: e?.target?.value,
                      })
                    }
                  >
                    <option>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {formData?.createdByAdmin === "No" && (
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
                      {vendorList?.map((v) => (
                        <option key={v?._id} value={String(v?._id)}>
                          {v?.firstName + " " + v?.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="col-12 mb-3">
                  <label>Short Description*</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={formData?.shortDescription}
                    onChange={(newContent) =>
                      setFormData({ ...formData, shortDescription: newContent })
                    }
                  />
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-primary w-100"
                    style={{
                        color: "#fff",
                        border: "none",
                        borderRadius: "24px",
                        background: "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                        boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                    }}
                    onClick={handleUpdateAndNext}
                  >
                    Update & Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdateStep1;
