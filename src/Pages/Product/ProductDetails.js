import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

import { updateProductServ } from "../../services/product.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetailsServ } from "../../services/product.services";
function ProductDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const [details, setDetails] = useState(null);
  const productGallery = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc2ZYz-Ex6-uW56DspVg-pPdU4-C95Y7wF4w&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw1qc37vUQZ3yUBIcoQh86OKVfGqhGhkvJgg&s",

    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaK2vLdSpxI607xNAQaGYe0qF8T8uquagZYA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx9lZUG3HbgkHqyZWQeQUdN0yExbEI9-IQAA&s",
    // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNZYBrAjCMWz1jxnOGYEcSH1CthVy1XMEg_Q&s"
  ];

  const getProductDetails = async () => {
    try {
      let response = await getProductDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        const data = response?.data?.data;
      }
    } catch (error) {}
  };
  useEffect(() => {
    getProductDetails();
  }, []);
  const [selectedTab, setSelectedTab] = useState("Product Details");
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

                  <div className="d-flex justify-content-between mt-md-3 mt-1 align-items-center productDetailsBtn">
                    <button
                      className="bg-primary"
                      onClick={() =>
                        navigate("/product-approval/" + details?._id)
                      }
                    >
                      Edit
                    </button>
                    <button className="bg-danger">Delete</button>
                  </div>
                  <hr />
                  <div>
                    <h5>
                      {details?.shortDescription} <u>read more</u>
                    </h5>
                  </div>
                  <div>
                    <h5>
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
                      <div className=" ">
                        <h4>Description : </h4>
                        <p>{details?.description}</p>
                      </div>
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
                  <div className="d-flex align-items-center border mb-1 rounded p-1">
                    <h5 className="mb-0">Deliverable Zipcodes :</h5>
                    <p className="mb-0">
                      {details?.zipcodeId?.map((v, i) => {
                        return (
                          <span className="border px-1 me-2 rounded">
                            {v?.zipcode}
                          </span>
                        );
                      })}
                    </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
