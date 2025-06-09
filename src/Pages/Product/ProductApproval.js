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
function ProductApproval() {
  const params = useParams();
  const [details, setDetails] = useState(null);
  const [formData, setFormData] = useState({
    isNameApproved: "",
    isTagsApproved: false,
    isProductTypeApproved: false,
    isTaxApproved: false,
    isMadeInApproved: false,
    isHsnCodeApproved: false,
    isShortDescriptionApproved: false,
    isStatusApproved: false,
    isMinOrderQuantityApproved: false,
    isMaxOrderQuantityApproved: false,
    isWarrantyPeriodApproved: false,
    isGuaranteePeriodApproved: false,
    isCategoryIdApproved: false,
    isSubCategoryIdApproved: false,
    isStockQuantityApproved: false,
    isBrandIdApproved: false,
    isZipcodeIdApproved: false,
    isProductVideoUrlApproved: false,
    isDescriptionApproved: false,
    isPriceApproved: false,
    isDiscountedPriceApproved: false,
    isProductHeroImageApproved: false,
    isProductGalleryApproved: false,
    isProductVideoApproved: false,

    // reject reasons
    nameRejectReason: "waiting for approval",
    tagsRejectReason: "waiting for approval",
    productTypeRejectReason: "waiting for approval",
    taxRejectReason: "waiting for approval",
    madeInRejectReason: "waiting for approval",
    hsnCodeRejectReason: "waiting for approval",
    shortDescriptionRejectReason: "waiting for approval",
    statusRejectReason: "waiting for approval",
    minOrderQuantityRejectReason: "waiting for approval",
    maxOrderQuantityRejectReason: "waiting for approval",
    warrantyPeriodRejectReason: "waiting for approval",
    guaranteePeriodRejectReason: "waiting for approval",
    categoryIdRejectReason: "waiting for approval",
    subCategoryIdRejectReason: "waiting for approval",
    stockQuantityRejectReason: "waiting for approval",
    brandIdRejectReason: "waiting for approval",
    zipcodeIdRejectReason: "waiting for approval",
    productVideoUrlRejectReason: "waiting for approval",
    descriptionRejectReason: "waiting for approval",
    priceRejectReason: "waiting for approval",
    discountedPriceRejectReason: "waiting for approval",
    productHeroImageRejectReason: "waiting for approval",
    productGalleryRejectReason: "waiting for approval",
    productVideoRejectReason: "waiting for approval",
  });

  const getProductDetails = async () => {
    try {
      let response = await getProductDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        const data = response?.data?.data;
        setFormData({
          isNameApproved: data?.isNameApproved,
          isTagsApproved: data?.isTagsApproved,
          isProductTypeApproved: data?.isProductTypeApproved,
          isTaxApproved: data?.isTaxApproved,
          isMadeInApproved: data?.isMadeInApproved,
          isHsnCodeApproved: data?.isHsnCodeApproved,
          isShortDescriptionApproved: data?.isShortDescriptionApproved,
          isStatusApproved: data?.isStatusApproved,
          isMinOrderQuantityApproved: data?.isMinOrderQuantityApproved,
          isMaxOrderQuantityApproved: data?.isMaxOrderQuantityApproved,
          isWarrantyPeriodApproved: data?.isWarrantyPeriodApproved,
          isGuaranteePeriodApproved: data?.isGuaranteePeriodApproved,
          isCategoryIdApproved: data?.isCategoryIdApproved,
          isSubCategoryIdApproved: data?.isSubCategoryIdApproved,
          isStockQuantityApproved: data?.isStockQuantityApproved,
          isBrandIdApproved: data?.isBrandIdApproved,
          isZipcodeIdApproved: data?.isZipcodeIdApproved,
          isProductVideoUrlApproved: data?.isProductVideoUrlApproved,
          isDescriptionApproved: data?.isDescriptionApproved,
          isPriceApproved: data?.isPriceApproved,
          isDiscountedPriceApproved: data?.isDiscountedPriceApproved,
          isProductHeroImageApproved: data?.isProductHeroImageApproved,
          isProductGalleryApproved: data?.isProductGalleryApproved,
          isProductVideoApproved: data?.isProductVideoApproved,
          nameRejectReason: data?.nameRejectReason,
          tagsRejectReason: data?.tagsRejectReason,
          productTypeRejectReason: data?.productTypeRejectReason,
          taxRejectReason: data?.taxRejectReason,
          madeInRejectReason: data?.madeInRejectReason,
          hsnCodeRejectReason: data?.hsnCodeRejectReason,
          shortDescriptionRejectReason: data?.shortDescriptionRejectReason,
          statusRejectReason: data?.statusRejectReason,
          minOrderQuantityRejectReason: data?.minOrderQuantityRejectReason,
          maxOrderQuantityRejectReason: data?.maxOrderQuantityRejectReason,
          warrantyPeriodRejectReason: data?.warrantyPeriodRejectReason,
          guaranteePeriodRejectReason: data?.guaranteePeriodRejectReason,
          categoryIdRejectReason: data?.categoryIdRejectReason,
          subCategoryIdRejectReason: data?.subCategoryIdRejectReason,
          stockQuantityRejectReason: data?.stockQuantityRejectReason,
          brandIdRejectReason: data?.brandIdRejectReason,
          zipcodeIdRejectReason: data?.zipcodeIdRejectReason,
          productVideoUrlRejectReason: data?.productVideoUrlRejectReason,
          descriptionRejectReason: data?.descriptionRejectReason,
          priceRejectReason: data?.priceRejectReason,
          discountedPriceRejectReason: data?.discountedPriceRejectReason,
          productHeroImageRejectReason: data?.productHeroImageRejectReason,
          productGalleryRejectReason: data?.productGalleryRejectReason,
          productVideoRejectReason: data?.productVideoRejectReason,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    getProductDetails();
  }, []);

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
                    Approve Product
                  </h4>
                </div>
              </div>
              <div
                className="p-3 shadow rounded mb-3"
                style={{ background: "#E6DFCF" }}
              >
                <h3>
                  <u>Step 1</u>
                </h3>
                <div className="row">
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isNameApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isNameApproved: e.target.checked,
                          nameRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product Name*</label>
                    <input
                      className="form-control"
                      readOnly
                      value={details?.name}
                      style={{ height: "45px" }}
                    />
                    {!formData.isNameApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.nameRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nameRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  {/* Tags */}
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isTagsApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isTagsApproved: e.target.checked,
                          tagsRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Tags*</label>
                    <input
                      className="form-control"
                      readOnly
                      value={details?.tags}
                      style={{ height: "45px" }}
                    />
                    {!formData.isTagsApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.tagsRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tagsRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  {/* Product Type */}
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isProductTypeApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isProductTypeApproved: e.target.checked,
                          productTypeRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product Type*</label>
                    <input
                      className="form-control"
                      readOnly
                      value={details?.productType}
                      style={{ height: "45px" }}
                    />
                    {!formData.isProductTypeApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.productTypeRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productTypeRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  {/* Tax */}
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isTaxApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isTaxApproved: e.target.checked,
                          taxRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Tax*</label>
                    <input
                      className="form-control"
                      readOnly
                      value={details?.tax}
                      style={{ height: "45px" }}
                    />
                    {!formData.isTaxApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.taxRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            taxRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  {/* Made In */}
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isMadeInApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isMadeInApproved: e.target.checked,
                          madeInRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Made In*</label>
                    <input
                      className="form-control"
                      readOnly
                      value={details?.madeIn}
                      style={{ height: "45px" }}
                    />
                    {!formData.isMadeInApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.madeInRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            madeInRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  {/* HSN Code */}
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isHsnCodeApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isHsnCodeApproved: e.target.checked,
                          hsnCodeRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>HSN Code*</label>
                    <input
                      className="form-control"
                      readOnly
                      value={details?.hsnCode}
                      style={{ height: "45px" }}
                    />
                    {!formData.isHsnCodeApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.hsnCodeRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hsnCodeRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="col-12 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isShortDescriptionApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isShortDescriptionApproved: e.target.checked,
                          shortDescriptionRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Short Description*</label>
                    <textarea
                      className="form-control"
                      readOnly
                      value={details?.shortDescription}
                      rows={3}
                    />
                    {!formData.isShortDescriptionApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.shortDescriptionRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shortDescriptionRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              <div
                className="p-3 shadow rounded mb-3"
                style={{ background: "#DAF0D5" }}
              >
                <h3>
                  <u>Step 2</u>
                </h3>
                <div className="row">
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isMinOrderQuantityApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isMinOrderQuantityApproved: e.target.checked,
                          minOrderQuantityRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Min Order Quantity</label>
                    <input
                      value={details?.minOrderQuantity}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isMinOrderQuantityApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.minOrderQuantityRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minOrderQuantityRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isMaxOrderQuantityApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isMaxOrderQuantityApproved: e.target.checked,
                          maxOrderQuantityRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Max Order Quantity</label>
                    <input
                      value={details?.maxOrderQuantity}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isMaxOrderQuantityApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.maxOrderQuantityRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxOrderQuantityRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isWarrantyPeriodApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isWarrantyPeriodApproved: e.target.checked,
                          warrantyPeriodRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Warranty Period</label>
                    <input
                      value={details?.warrantyPeriod}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isWarrantyPeriodApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.warrantyPeriodRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            warrantyPeriodRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isGuaranteePeriodApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isGuaranteePeriodApproved: e.target.checked,
                          guaranteePeriodRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Guarantee Period</label>
                    <input
                      value={details?.guaranteePeriod}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isGuaranteePeriodApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.guaranteePeriodRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            guaranteePeriodRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isStockQuantityApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isStockQuantityApproved: e.target.checked,
                          stockQuantityRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Stock Quantity</label>
                    <input
                      value={details?.stockQuantity}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isStockQuantityApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.stockQuantityRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stockQuantityRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isBrandIdApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isBrandIdApproved: e.target.checked,
                          brandIdRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Brand</label>
                    <input
                      className="form-control"
                      value={details?.brandId?.name}
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isBrandIdApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.brandIdRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brandIdRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isCategoryIdApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isCategoryIdApproved: e.target.checked,
                          categoryIdRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Category</label>
                    <input
                      className="form-control"
                      value={details?.categoryId?.name}
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isCategoryIdApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.categoryIdRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoryIdRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isSubCategoryIdApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isSubCategoryIdApproved: e.target.checked,
                          subCategoryIdRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Sub Category</label>
                    <input
                      className="form-control"
                      value={details?.subCategoryId?.name}
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isSubCategoryIdApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.subCategoryIdRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subCategoryIdRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isZipcodeIdApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isZipcodeIdApproved: e.target.checked,
                          zipcodeIdRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Select Deliverable Zipcodes</label>
                    <input
                      className="form-control"
                      value={details?.zipcodeId?.map((v, i) => {
                        return v?.zipcode;
                      })}
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isZipcodeIdApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.zipcodeIdRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            zipcodeIdRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isPriceApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPriceApproved: e.target.checked,
                          priceRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product Price</label>
                    <input
                      value={details?.price}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isPriceApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.priceRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priceRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isDiscountedPriceApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isDiscountedPriceApproved: e.target.checked,
                          descriptionRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product Discounted Price</label>
                    <input
                      value={details?.discountedPrice}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isDiscountedPriceApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.discountedPriceRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountedPriceRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>

                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isWarrantyPeriodApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isWarrantyPeriodApproved: e.target.checked,
                          warrantyPeriodRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product Returnable</label>
                    <input
                      className="form-control"
                      value={details?.isProductReturnable ? "Yes" : "No"}
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isProductReturnable && (
                      <input
                        className="form-control mt-2"
                        value={formData.subCategoryIdRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subCategoryIdRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isWarrantyPeriodApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isWarrantyPeriodApproved: e.target.checked,
                          warrantyPeriodRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product COD Allowed</label>
                    <input
                      value={details?.isCodAllowed ? "Yes" : "No"}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    {!formData.isCodAllowed && (
                      <input
                        className="form-control mt-2"
                        value={formData.discountedPriceRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountedPriceRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isWarrantyPeriodApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isWarrantyPeriodApproved: e.target.checked,
                          warrantyPeriodRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product Tax Included</label>
                    <input
                      value={details?.isProductTaxIncluded ? "Yes" : "No"}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    <input className="form-control mt-2" />
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isWarrantyPeriodApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isWarrantyPeriodApproved: e.target.checked,
                          warrantyPeriodRejectReason: e.target.checked
                            ? ""
                            : "waiting for approval",
                        })
                      }
                    />
                    <label>Product Cancelable</label>
                    <input
                      value={details?.isProductCancelable ? "Yes" : "No"}
                      className="form-control"
                      style={{ height: "45px" }}
                      readOnly
                    />
                    <input className="form-control mt-2" />
                  </div>
                  <div className="col-12 mb-3 row">
                    <div className="col-6">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isDescriptionApproved}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isDescriptionApproved: e.target.checked,
                            descriptionRejectReason: e.target.checked
                              ? ""
                              : "waiting for approval",
                          })
                        }
                      />
                      <label>Product Description</label>
                      <textarea
                        value={details?.description}
                        className="form-control"
                        readOnly
                        style={{ height: "315px" }}
                      />
                      {!formData.isDescriptionApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.descriptionRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              descriptionRejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isProductVideoUrlApproved}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isProductVideoUrlApproved: e.target.checked,
                            productVideoUrlRejectReason: e.target.checked
                              ? ""
                              : "waiting for approval",
                          })
                        }
                      />
                      <label>Video URL</label>
                      {details?.productVideoUrl && (
                        <>
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${
                              details.productVideoUrl
                                .split("youtu.be/")[1]
                                ?.split("?")[0]
                            }`}
                            title="Product Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          {!formData.isProductVideoUrlApproved && (
                            <input
                              className="form-control mt-2"
                              value={formData.productVideoUrlRejectReason}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  productVideoUrlRejectReason: e.target.value,
                                })
                              }
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-3 shadow rounded mb-3"
                style={{ background: "#F6F0D6" }}
              >
                <h3>
                  <u>Product Gallery</u>
                </h3>
                <div className="row">
                  <div className="col-4 mb-3">
                    <div className="border p-2">
                      <div className="d-flex justify-content-center">
                        <img
                          src={details?.productHeroImage}
                          className="img-fluid mb-2"
                          style={{ height: "150px" }}
                        />
                      </div>
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isProductHeroImageApproved}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isProductHeroImageApproved: e.target.checked,
                            productHeroImageRejectReason: e.target.checked
                              ? ""
                              : "waiting for approval",
                          })
                        }
                      />
                      <label>Product Hero Image</label>
                      {!formData.isProductHeroImageApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.productHeroImageRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                productHeroImageRejectReason: e.target.value,
                              })
                            }
                          />
                        )}
                    </div>
                  </div>
                  {details?.productVideo && (
                    <div className="col-4 mb-3">
                      <div className="border p-2">
                        <div className="d-flex justify-content-center">
                          <video
                            className="mb-2"
                            style={{ height: "150px" }}
                            src={details.productVideo}
                            controls
                          />
                        </div>
                        <input type="checkbox" className="me-2" />
                        <label>Product Video</label>
                        {!formData.isProductVideoApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.productVideoRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                productVideoRejectReason: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="col-12 mb-3">
                    <label>Product Gallery</label>
                    <div className="p-2 border d-flex">
                      {details?.productGallery?.map((v, i) => {
                        return (
                          <div className="p-2 border mx-2">
                            <img
                              className="img-fluid"
                              style={{ height: "150px" }}
                              src={v}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <input type="checkbox" className="me-2" />
                    <label>Product Gallery</label>
                    {!formData.isCodAllowed && (
                      <input
                        className="form-control mt-2"
                        value={formData.productGalleryRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productGalleryRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div
                className="p-3 shadow rounded mb-3"
                style={{ background: "#D1DBD5" }}
              >
                <h3>
                  <u>Product Attributes</u>
                </h3>
                <div className="row">
                  {details?.productOtherDetails?.map((v, i) => {
                    return (
                      <div className="col-4 mb-3">
                        <div className="border p-2">
                          <label>{v?.key}</label>
                          <input
                            className="form-control"
                            value={v?.value?.map((v, i) => {
                              return v;
                            })}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="ms-2">
                    <input type="checkbox" className="me-2" />
                    <label>Product Attribute</label>
                    <input className="form-control mt-2" />
                  </div>
                </div>
              </div>
              <div
                className="p-3 shadow rounded mb-3"
                style={{ background: "#E9ECEF" }}
              >
                <h3>
                  <u>Product Variants</u>
                </h3>
                <div className="row">
                  {details?.productVariants?.map((v, i) => {
                    return (
                      <div className="col-4 mb-3">
                        <div className="border p-2">
                          <img className="img-fluid" src={v?.variantImage} />
                          <label>{v?.variantKey}</label>
                          <label>{v?.variantValue}</label>
                          <label>{v?.variantPrice}</label>
                          <label>{v?.variantDiscountedPrice}</label>
                        </div>
                      </div>
                    );
                  })}
                  <div className="ms-2">
                    <input type="checkbox" className="me-2" />
                    <label>Product Variant</label>
                    <input className="form-control mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductApproval;
