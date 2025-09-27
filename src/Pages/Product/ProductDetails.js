import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

import { updateProductServ } from "../../services/product.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductDetailsServ,
  getProductRatingServ,
} from "../../services/product.services";
import { getProductFaqListServ } from "../../services/productFaq.services";
import { getVendorDetailsServ } from "../../services/vender.services";
function ProductDetails() {
  const [preview, setPreview] = useState({ open: false, src: "", title: "" });
  const [selectedTab, setSelectedTab] = useState("Product Details");

  const navigate = useNavigate();
  const params = useParams();
  const [details, setDetails] = useState(null);
  const [ratingList, setRatingList] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorLoading, setVendorLoading] = useState(false);

  const fetchVendorDetails = async () => {
    if (!details?.createdBy?._id) return;
    setVendorLoading(true);
    try {
      const res = await getVendorDetailsServ(details.createdBy._id);
      if (res?.data?.statusCode === 200) {
        setVendorDetails(res.data.data.venderDetails);
      } else {
        setVendorDetails(null);
      }
    } catch (err) {
      console.error("Error fetching vendor details:", err);
      toast.error("Failed to load Vendor Details");
    } finally {
      setVendorLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === "Vendor Details") {
      fetchVendorDetails();
    }
  }, [selectedTab, details]);

  const fetchProductFaqs = async () => {
    if (!details?._id) return;
    setFaqLoading(true);
    try {
      const formData = { productId: details._id };
      const res = await getProductFaqListServ(formData);
      if (res?.data?.statusCode === 200) {
        setFaqList(res?.data?.data || []);
      } else {
        setFaqList([]);
      }
    } catch (err) {
      console.error("Error fetching product FAQs:", err);
      toast.error("Failed to load FAQs");
    } finally {
      setFaqLoading(false);
    }
  };

  const getProductDetails = async () => {
    try {
      let response = await getProductDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
      }
    } catch (error) {}
  };
  const getProductRatingListFunc = async () => {
    try {
      let response = await getProductRatingServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setRatingList(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getProductDetails();
    getProductRatingListFunc();
  }, []);

  useEffect(() => {
    if (selectedTab === "FAQ") {
      fetchProductFaqs();
    }
  }, [selectedTab, details]);

  const groupedVariants = [];
  details?.productVariants.forEach((variant) => {
    const existingGroup = groupedVariants.find(
      (group) => group.variantKey === variant.variantKey
    );

    const { variantKey, ...rest } = variant;

    if (existingGroup) {
      existingGroup.variants.push(rest);
    } else {
      groupedVariants.push({
        variantKey: variant.variantKey,
        variants: [rest],
      });
    }
  });

  console.log(groupedVariants);

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="" />
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

          <div className="">
            <div className="d-flex mt-md-5 mt-5 pt-3 breadcrumb">
              <p style={{ color: "#5EBC67" }}>Product Management -</p>
              <p style={{ color: "#3D9970" }}>Products -</p>
              <p>{details?.name}</p>
            </div>
            <div className="row px-md-2 px-0 marginLeft0">
              <div className="col-md-6 col-12 row px-md-2 px-0">
                <div className="col-md-12 col-12 d-flex justify-content-center align-items-center border  mb-2">
                  <img
                    src={details?.productHeroImage}
                    // className="img-fuild"
                    style={{ height: "400px", width: "400px" }}
                  />
                </div>
                <div className="col-md-12 col-12 row my-auto">
                  {details?.productGallery?.map((v, i) => {
                    return (
                      <div className="border col-3">
                        <img src={v} className="img-fluid" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-6 col-12 mx-md-2 mx-0 px-md-2 px-0">
                <div className="border rounded p-4 productDetailsDiv mt-md-0 mt-3">
                  <h5 className="badge" style={{ background: "#3D9970" }}>
                    Save{" "}
                    {(
                      ((details?.price - details?.discountedPrice) /
                        details?.price) *
                      100
                    ).toFixed(2)}
                    %
                  </h5>

                  <h1 className="my-2">{details?.name}</h1>
                  <div className="d-flex align-items-center reviewDiv">
                    {[...Array(Math.round(Number(details?.rating) || 0))].map(
                      (_, i) => (
                        <img
                          key={i}
                          src="https://cdn-icons-png.flaticon.com/128/1828/1828884.png"
                          style={{ height: "20px", marginRight: "4px" }}
                        />
                      )
                    )}
                    <a>(4 reviews)</a>
                  </div>
                  <hr />
                  <div className="d-flex mb-2">
                    {details?.variantOptions &&
                      Object.entries(details.variantOptions).length > 0 && (
                        <div
                          key={Object.entries(details.variantOptions)[0][0]}
                          className="mb-2 d-flex align-items-center"
                        >
                          <b>{Object.entries(details.variantOptions)[0][0]}:</b>
                          <div className="d-flex ms-3">
                            {Object.entries(details.variantOptions)[0][1].map(
                              (value) => (
                                <span
                                  key={value}
                                  className="btn btn-outline-success btn-sm me-2"
                                  // onClick={() => handleVariantSelect( key, value )}
                                >
                                  {value}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="d-flex" style={{ overflow: "auto" }}>
                    {details?.productVariants?.map((v, i) => {
                      return (
                        <div className="varientDiv mb-2">
                          <div className="d-flex">
                            <div className="border me-2 py-0 px-3">
                              <img
                                src={v?.variantImage[0]}
                                style={{ height: "100px", width: "100px" }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="d-flex my-2">
                    {details?.variantOptions &&
                      Object.entries(details.variantOptions).length > 1 && (
                        <div
                          key={Object.entries(details.variantOptions)[1][0]}
                          className="d-flex align-items-center"
                        >
                          <b>{Object.entries(details.variantOptions)[1][0]}:</b>
                          <div className="d-flex ms-3">
                            {Object.entries(details.variantOptions)[1][1].map(
                              (value) => (
                                <span
                                  key={value}
                                  className="btn btn-outline-dark btn-sm me-2 "
                                  // onClick={() => handleVariantSelect( key, value )}
                                >
                                  {value}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <div>
                    <h5 className="mb-mb-3 mb-1">
                      M.R.P :{" "}
                      <s className="text-secondary">Rs. {details?.price}</s>
                    </h5>
                  </div>
                  <div>
                    <h5>
                      Discounted Price :{" "}
                      <span className="discountedPrice">
                        R.s {details?.discountedPrice}
                      </span>{" "}
                      {details?.tax}{" "}
                      {details?.isProductTaxIncluded ? "included" : "excluded"}
                    </h5>
                  </div>
                  <div>
                    <h5>
                      Brand : <span>{details?.brandId?.name}</span>
                    </h5>
                  </div>
                  <div>
                    <h5>
                      Tags :{" "}
                      {details?.tags?.map((v, i) => {
                        return <span>{v},</span>;
                      })}
                    </h5>
                  </div>

                  {details?.createdBy && (
                    <h5
                      className="mt-2 text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedTab("Vendor Details")}
                    >
                      Vendor : {details.createdBy.firstName}{" "}
                      {details.createdBy.lastName}
                    </h5>
                  )}

                  <div className="d-flex justify-content-between mt-md-3 mt-1 align-items-center productDetailsBtn">
                    <button
                      className="bg-primary"
                      onClick={() =>
                        navigate("/update-product-step1/" + details?._id)
                      }
                    >
                      Edit
                    </button>
                    {/* <button className="bg-danger">Delete</button> */}
                  </div>
                  <hr />
                  <div>
                    <h5
                      className="mb-0 d-flex align-items-baseline"
                      style={{ gap: 8, flexWrap: "wrap" }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: details?.shortDescription || "",
                        }}
                        style={{ display: "inline" }}
                      />
                      <u style={{ whiteSpace: "nowrap" }}>read more</u>
                    </h5>
                  </div>
                  <div>
                    <h5 className="mt-2">
                      Product Code :{" "}
                      <span className="border  px-2 rounded">
                        {details?.hsnCode}
                      </span>
                    </h5>
                  </div>
                  <div>
                    <h5>
                      Stock Quantity :{" "}
                      <span className="border  px-2 rounded">
                        {details?.stockQuantity}
                      </span>
                    </h5>
                  </div>
                  <div>
                    <h5 className="mb-0">
                      Type :{" "}
                      <span className="border  px-2 rounded">
                        {details?.productType}
                      </span>
                    </h5>
                  </div>
                  <div className="my-2">
                    <h5 className="mb-0">
                      Made in :{" "}
                      <span className="border  px-2 rounded">
                        {details?.madeIn}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12  p-2 mt-3 order-3 d-md-block d-none">
                <div className="d-flex  productDetailsLeftBtnGroup">
                  <p
                    onClick={() => setSelectedTab("Product Details")}
                    className={
                      selectedTab == "Product Details"
                        ? " bg-secondary text-light "
                        : " "
                    }
                  >
                    Product Details
                  </p>
                  <p
                    onClick={() => setSelectedTab("Reviews")}
                    className={
                      selectedTab == "Reviews"
                        ? " bg-secondary text-light "
                        : " "
                    }
                  >
                    Reviews
                  </p>
                  <p
                    onClick={() => setSelectedTab("FAQ")}
                    className={
                      selectedTab == "FAQ" ? " bg-secondary text-light " : " "
                    }
                  >
                    FAQ
                  </p>
                  <p
                    onClick={() => setSelectedTab("Vendor Details")}
                    className={
                      selectedTab == "Vendor Details"
                        ? " bg-secondary text-light "
                        : " "
                    }
                  >
                    Vendor Details
                  </p>
                </div>
              </div>
            </div>
            {selectedTab == "Product Details" && (
              <div className="productDetailsDiv mt-3 row">
                <div className="col-6 border">
                  <div className="  p-2">
                    <h3 className="mb-0">About The Product</h3>

                    <div>
                      <h4>
                        Category : <span>{details?.categoryId?.name}</span>
                      </h4>
                      <h4>
                        Sub Category :{" "}
                        <span>{details?.subCategoryId?.name}</span>
                      </h4>
                      {/* N‑Level Category (single) */}
                      {(details?.nLevelCategoryId ||
                        (Array.isArray(details?.nLevelCategoryIds) &&
                          details.nLevelCategoryIds.length)) && (
                        <div
                          className="d-flex align-items-center flex-wrap"
                          style={{ gap: 8, marginTop: 8 }}
                        >
                          <span
                            className="mb-2"
                            style={{ fontSize: 20, fontWeight: 600 }}
                          >
                            N‑Level Category :
                          </span>

                          {(() => {
                            // Prefer single field; fallback to first from legacy array
                            const n =
                              details?.nLevelCategoryId ||
                              (Array.isArray(details?.nLevelCategoryIds) &&
                                details.nLevelCategoryIds[0]) ||
                              null;

                            if (!n) return null;

                            const id = n?._id || n;
                            const name = n?.name || String(id);
                            const img = n?.image || "";

                            return (
                              <span
                                key={id}
                                className="badge text-dark"
                                onClick={() => {
                                  if (!img) return;
                                  setPreview({
                                    open: true,
                                    src: img,
                                    title: name,
                                  });
                                }}
                                title={img ? "Click to preview" : name}
                                style={{
                                  background: "#e6f2ff",
                                  border: "1px solid #90caf9",
                                  color: "#0d47a1",
                                  padding: "6px 10px",
                                  fontWeight: 600,
                                  cursor: img ? "pointer" : "default",
                                  userSelect: "none",
                                }}
                              >
                                {name}
                              </span>
                            );
                          })()}
                        </div>
                      )}

                      <div
                        className="d-flex align-items-start"
                        style={{ gap: 8 }}
                      >
                        <h4 className="mb-0">Description :</h4>
                        <div
                          className="lh-lg"
                          style={{ flex: 1, minWidth: 0 }}
                          dangerouslySetInnerHTML={{
                            __html: details?.description || "",
                          }}
                        />
                      </div>

                      {preview.open && (
                        <>
                          <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              background: "rgba(0,0,0,0.55)",
                              zIndex: 1050,
                            }}
                            onClick={() =>
                              setPreview({ open: false, src: "", title: "" })
                            }
                          >
                            <div
                              className="position-relative"
                              style={{
                                background: "#fff",
                                borderRadius: 16,
                                width: "min(560px, 92vw)",
                                boxShadow: "0 16px 36px rgba(0,0,0,0.35)",
                                overflow: "hidden",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="d-flex align-items-center justify-content-between px-3 py-2"
                                style={{ borderBottom: "1px solid #eee" }}
                              >
                                <div style={{ fontWeight: 700 }}>
                                  {preview.title}
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() =>
                                    setPreview({
                                      open: false,
                                      src: "",
                                      title: "",
                                    })
                                  }
                                >
                                  Close
                                </button>
                              </div>

                              <div
                                className="p-2"
                                style={{ background: "#f7f7f7" }}
                              >
                                <img
                                  src={preview.src}
                                  alt={preview.title}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "70vh",
                                    objectFit: "contain",
                                    borderRadius: 12,
                                    background: "#fff",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="modal-backdrop fade show" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center border mb-1 rounded  p-1">
                    <h5 className="mb-0">Minimum Order Quantity :</h5>
                    <p className="mb-0">{details?.minOrderQuantity}</p>
                  </div>
                  <div className="d-flex align-items-center border mb-1 rounded  p-1">
                    <h5 className="mb-0">Maximum Order Quantity :</h5>
                    <p className="mb-0">{details?.minOrderQuantity}</p>
                  </div>
                  <div className="d-flex align-items-center border mb-1 rounded  p-1">
                    <h5 className="mb-0">Warrenty Period :</h5>
                    <p className="mb-0">{details?.warrantyPeriod}</p>
                  </div>
                  <div className="d-flex align-items-center border mb-1 rounded p-1">
                    <h5 className="mb-0">Guarantee Period :</h5>
                    <p className="mb-0">{details?.guaranteePeriod}</p>
                  </div>
                  <div className="border rounded p-2 mb-2">
                    <div className="d-flex">
                      {/* Left label column */}
                      <div
                        className="pe-3"
                        style={{
                          minWidth: 220,
                          flex: "0 0 auto",
                          alignSelf: "flex-start",
                        }}
                      >
                        <h5 className="mb-0">Deliverable Zipcodes :</h5>
                      </div>

                      {/* Right chips column */}
                      <div
                        className="d-flex flex-wrap align-items-start"
                        style={{ gap: 8, rowGap: 8, flex: "1 1 auto" }}
                      >
                        {details?.zipcodeId?.map((v) => (
                          <span
                            key={v?._id || v?.zipcode}
                            className="border rounded text-nowrap"
                            style={{
                              background: "#f8f9fa",
                              fontWeight: 600,
                              fontSize: 14,
                              lineHeight: 1.2,
                            }}
                          >
                            {v?.zipcode}
                          </span>
                        ))}
                        {!details?.zipcodeId?.length && (
                          <span className="text-muted" style={{ fontSize: 14 }}>
                            None
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center border mb-1 rounded p-1">
                    <h5 className="mb-0">Product Returnable :</h5>
                    <p className="mb-0">
                      {details?.isProductReturnable ? "Yes" : "No"}
                    </p>
                  </div>
                  {details?.isProductReturnable && (
                    <div className="d-flex align-items-center border mb-1 rounded  p-1">
                      <h5 className="mb-0">Return Period :</h5>
                      <p className="mb-0">{details?.productReturnPeriod}</p>
                    </div>
                  )}

                  <div className="d-flex align-items-center border mb-1 rounded p-1">
                    <h5 className="mb-0">COD Allowed :</h5>
                    <p className="mb-0">
                      {details?.isCodAllowed ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="d-flex align-items-center border mb-1 rounded p-1">
                    <h5 className="mb-0">Product Cancellable :</h5>
                    <p className="mb-0">
                      {details?.isProductCancelable ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {selectedTab == "Reviews" && (
              <div className="productDetailsDiv mt-3 row">
                <div className="col-12 border">
                  <div className="  p-2">
                    <h3 className="mb-0">Peopls Thought's</h3>

                    <div className="row">
                      {ratingList?.map((v, i) => {
                        return (
                          <div className="col-6">
                            <div className="reviewBox p-2 py-3 shadow-sm mb-3 mt-2">
                              <div className="d-flex align-items-center">
                                <div>
                                  <img
                                    src={
                                      v?.userId?.profilePic
                                        ? v?.userId?.profilePic
                                        : "https://cdn-icons-png.flaticon.com/128/1077/1077114.png"
                                    }
                                  />
                                </div>
                                <div className="ms-3">
                                  <h5>
                                    {v?.userId?.firstName +
                                      " " +
                                      v?.userId?.lastName}
                                  </h5>
                                  <div className="d-flex starGroup">
                                    {[
                                      ...Array(
                                        Math.round(Number(v?.rating) || 0)
                                      ),
                                    ].map((_, i) => (
                                      <img
                                        key={i}
                                        src="https://cdn-icons-png.flaticon.com/128/1828/1828884.png"
                                        style={{
                                          height: "20px",
                                          marginRight: "4px",
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <p className="mb-0">{v?.review}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedTab === "FAQ" && (
              <div className="productDetailsDiv mt-4 row">
                <div className="col-12 bg-white border rounded-3 shadow-sm p-4">
                  <h3 className="mb-4 fw-semibold text-primary border-bottom pb-2">
                    💬 Frequently Asked Questions
                  </h3>

                  {faqLoading && (
                    <p className="text-secondary fst-italic">Loading FAQs...</p>
                  )}

                  {!faqLoading && (!faqList || faqList.length === 0) && (
                    <p className="text-muted">
                      No FAQs available for this product.
                    </p>
                  )}

                  {!faqLoading && faqList?.length > 0 && (
                    <div className="list-group list-group-flush">
                      {faqList.map((faq, i) => (
                        <div
                          key={i}
                          className="list-group-item py-3 px-2 border-0 border-bottom"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <h5 className="mb-2 fw-bold text-dark">
                            {i + 1}. {faq.question}
                          </h5>
                          <p className="mb-0 text-secondary lh-lg">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "Vendor Details" && (
              <div className="productDetailsDiv mt-3">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="mb-4 font-semibold text-lg text-gray-800 border-b pb-2">
                    Vendor Information
                  </h3>

                  {/* Loading state */}
                  {vendorLoading && <p>Loading vendor details...</p>}

                  {/* Empty state */}
                  {!vendorLoading && !vendorDetails && (
                    <p className="text-muted">No vendor details available.</p>
                  )}

                  {/* Render only when data exists */}
                  {!vendorLoading && vendorDetails && (
                    <div className="row">
                      {/* Left: Avatar + Name */}
                      <div className="col-md-3 text-center mb-4">
                        <img
                          src={
                            vendorDetails?.profilePic || "/placeholder-user.png"
                          }
                          alt="Vendor"
                          className="rounded-circle border shadow-sm mb-3"
                          style={{
                            width: "160px",
                            height: "160px",
                            objectFit: "cover",
                          }}
                        />
                        <h4 className="fw-bold mb-0">
                          {vendorDetails?.firstName} {vendorDetails?.lastName}
                        </h4>
                        <p className="text-muted small">
                          {vendorDetails?.storeName}
                        </p>
                      </div>

                      {/* Right: Details */}
                      <div className="col-md-9">
                        {/* Contact Info */}
                        <div className="mb-4">
                          <h5 className="text-success border-bottom pb-1">
                            Contact Details
                          </h5>
                          <p className="mb-1">
                            📧 <b>Email:</b> {vendorDetails?.email}
                          </p>
                          <p className="mb-1">
                            📱 <b>Phone:</b> +{vendorDetails?.countryCode}-
                            {vendorDetails?.phone}
                          </p>
                          <p className="mb-1">
                            📍 <b>Address:</b> {vendorDetails?.address},{" "}
                            {vendorDetails?.district}, {vendorDetails?.state} -{" "}
                            {vendorDetails?.pincode}
                          </p>
                        </div>

                        {/* Bank Info */}
                        <div className="mb-4">
                          <h5 className="text-success border-bottom pb-1">
                            Bank Information
                          </h5>
                          <p className="mb-1">
                            <b>Bank:</b> {vendorDetails?.bankName}
                          </p>
                          <p className="mb-1">
                            <b>Account No:</b> {vendorDetails?.accountNumber}
                          </p>
                          <p className="mb-1">
                            <b>IFSC:</b> {vendorDetails?.ifscCode}
                          </p>
                          <p className="mb-1">
                            <b>UPI ID:</b> {vendorDetails?.upiId}
                          </p>
                        </div>

                        {/* Store Info */}
                        <div className="mb-4">
                          <h5 className="text-success border-bottom pb-1">
                            Store Description
                          </h5>
                          <p className="mb-0 text-muted">
                            {vendorDetails?.storeDescription}
                          </p>
                        </div>

                        {/* Documents */}
                        <div>
                          <h5 className="text-success border-bottom pb-1">
                            Documents
                          </h5>
                          <div className="row g-2">
                            {[
                              {
                                label: "Business License",
                                url: vendorDetails?.bussinessLicense,
                              },
                              {
                                label: "Store Logo",
                                url: vendorDetails?.storeLogo,
                              },
                              {
                                label: "Adhar Card",
                                url: vendorDetails?.adharCard,
                              },
                              {
                                label: "PassBook",
                                url: vendorDetails?.passBook,
                              },
                              {
                                label: "Signature",
                                url: vendorDetails?.signature,
                              },
                            ].map((doc, i) => (
                              <div key={i} className="col-sm-6 col-lg-4">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="d-block p-2 border rounded text-decoration-none text-center hover-shadow"
                                  style={{ transition: "0.2s" }}
                                >
                                  📄 {doc.label}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
