import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  getProductDetailsServ,
  updateProductServ,
} from "../../services/product.services";

function ProductApproval() {
  const params = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Approval booleans + reject reasons (initialize defaults; set from API)
  const [formData, setFormData] = useState({
    // Step 1 basics
    isNameApproved: false,
    nameRejectReason: "waiting for approval",
    isTagsApproved: false,
    tagsRejectReason: "waiting for approval",
    isProductTypeApproved: false,
    productTypeRejectReason: "waiting for approval",
    isTaxApproved: false,
    taxRejectReason: "waiting for approval",
    isMadeInApproved: false,
    madeInRejectReason: "waiting for approval",
    isHsnCodeApproved: false,
    hsnCodeRejectReason: "waiting for approval",
    isShortDescriptionApproved: false,
    shortDescriptionRejectReason: "waiting for approval",

    // Step 2 quantities and category tree
    isStatusApproved: false,
    statusRejectReason: "waiting for approval",
    isMinOrderQuantityApproved: false,
    minOrderQuantityRejectReason: "waiting for approval",
    isMaxOrderQuantityApproved: false,
    maxOrderQuantityRejectReason: "waiting for approval",
    isWarrantyPeriodApproved: false,
    warrantyPeriodRejectReason: "waiting for approval",
    isGuaranteePeriodApproved: false,
    guaranteePeriodRejectReason: "waiting for approval",
    isCategoryIdApproved: false,
    categoryIdRejectReason: "waiting for approval",
    isSubCategoryIdApproved: false,
    subCategoryIdRejectReason: "waiting for approval",
    // NEW: N-Level category approval fields
    isNLevelCategoryIdApproved: false,
    nLevelCategoryIdRejectReason: "waiting for approval",
    isStockQuantityApproved: false,
    stockQuantityRejectReason: "waiting for approval",
    isBrandIdApproved: false,
    brandIdRejectReason: "waiting for approval",
    isZipcodeIdApproved: false,
    zipcodeIdRejectReason: "waiting for approval",

    // Media and descriptions
    isProductVideoUrlApproved: false,
    productVideoUrlRejectReason: "waiting for approval",
    isDescriptionApproved: false,
    descriptionRejectReason: "waiting for approval",
    isPriceApproved: false,
    priceRejectReason: "waiting for approval",
    isDiscountedPriceApproved: false,
    discountedPriceRejectReason: "waiting for approval",
    isProductHeroImageApproved: false,
    productHeroImageRejectReason: "waiting for approval",
    isProductGalleryApproved: false,
    productGalleryRejectReason: "waiting for approval",
    isProductVideoApproved: false,
    productVideoRejectReason: "waiting for approval",
    variantsApproval: [],

    // Misc product flags often shown in approval panels
    // These may be displayed read-only with their own approval if desired
    // isProductReturnable, isCodAllowed, isProductTaxIncluded, isProductCancelable handled in UI only

    // Overall status
    profileStatus: "",
  });

  const getProductDetails = async () => {
    try {
      const response = await getProductDetailsServ(params?.id);
      if (response?.data?.statusCode === 200) {
        const data = response?.data?.data;
        setDetails(data);

        setFormData((prev) => ({
          ...prev,
          // Booleans from API (fallback to prev value if absent)
          isNameApproved: data?.isNameApproved ?? prev.isNameApproved,
          isTagsApproved: data?.isTagsApproved ?? prev.isTagsApproved,
          isProductTypeApproved:
            data?.isProductTypeApproved ?? prev.isProductTypeApproved,
          isTaxApproved: data?.isTaxApproved ?? prev.isTaxApproved,
          isMadeInApproved: data?.isMadeInApproved ?? prev.isMadeInApproved,
          isHsnCodeApproved: data?.isHsnCodeApproved ?? prev.isHsnCodeApproved,
          isShortDescriptionApproved:
            data?.isShortDescriptionApproved ?? prev.isShortDescriptionApproved,

          isStatusApproved: data?.isStatusApproved ?? prev.isStatusApproved,
          isMinOrderQuantityApproved:
            data?.isMinOrderQuantityApproved ?? prev.isMinOrderQuantityApproved,
          isMaxOrderQuantityApproved:
            data?.isMaxOrderQuantityApproved ?? prev.isMaxOrderQuantityApproved,
          isWarrantyPeriodApproved:
            data?.isWarrantyPeriodApproved ?? prev.isWarrantyPeriodApproved,
          isGuaranteePeriodApproved:
            data?.isGuaranteePeriodApproved ?? prev.isGuaranteePeriodApproved,
          isCategoryIdApproved:
            data?.isCategoryIdApproved ?? prev.isCategoryIdApproved,
          isSubCategoryIdApproved:
            data?.isSubCategoryIdApproved ?? prev.isSubCategoryIdApproved,
          // NEW fields from API
          isNLevelCategoryIdApproved:
            data?.isNLevelCategoryIdApproved ?? prev.isNLevelCategoryIdApproved,

          isStockQuantityApproved:
            data?.isStockQuantityApproved ?? prev.isStockQuantityApproved,
          isBrandIdApproved: data?.isBrandIdApproved ?? prev.isBrandIdApproved,
          isZipcodeIdApproved:
            data?.isZipcodeIdApproved ?? prev.isZipcodeIdApproved,

          isProductVideoUrlApproved:
            data?.isProductVideoUrlApproved ?? prev.isProductVideoUrlApproved,
          isDescriptionApproved:
            data?.isDescriptionApproved ?? prev.isDescriptionApproved,
          isPriceApproved: data?.isPriceApproved ?? prev.isPriceApproved,
          isDiscountedPriceApproved:
            data?.isDiscountedPriceApproved ?? prev.isDiscountedPriceApproved,
          isProductHeroImageApproved:
            data?.isProductHeroImageApproved ?? prev.isProductHeroImageApproved,
          isProductGalleryApproved:
            data?.isProductGalleryApproved ?? prev.isProductGalleryApproved,
          isProductVideoApproved:
            data?.isProductVideoApproved ?? prev.isProductVideoApproved,
          isProductVariantsApproved: data?.isProductVariantsApproved ?? false,

          // Reject reasons from API (fallback to previous state)
          nameRejectReason: data?.nameRejectReason ?? prev.nameRejectReason,
          tagsRejectReason: data?.tagsRejectReason ?? prev.tagsRejectReason,
          productTypeRejectReason:
            data?.productTypeRejectReason ?? prev.productTypeRejectReason,
          taxRejectReason: data?.taxRejectReason ?? prev.taxRejectReason,
          madeInRejectReason:
            data?.madeInRejectReason ?? prev.madeInRejectReason,
          hsnCodeRejectReason:
            data?.hsnCodeRejectReason ?? prev.hsnCodeRejectReason,
          shortDescriptionRejectReason:
            data?.shortDescriptionRejectReason ??
            prev.shortDescriptionRejectReason,

          statusRejectReason:
            data?.statusRejectReason ?? prev.statusRejectReason,
          minOrderQuantityRejectReason:
            data?.minOrderQuantityRejectReason ??
            prev.minOrderQuantityRejectReason,
          maxOrderQuantityRejectReason:
            data?.maxOrderQuantityRejectReason ??
            prev.maxOrderQuantityRejectReason,
          warrantyPeriodRejectReason:
            data?.warrantyPeriodRejectReason ?? prev.warrantyPeriodRejectReason,
          guaranteePeriodRejectReason:
            data?.guaranteePeriodRejectReason ??
            prev.guaranteePeriodRejectReason,
          categoryIdRejectReason:
            data?.categoryIdRejectReason ?? prev.categoryIdRejectReason,
          subCategoryIdRejectReason:
            data?.subCategoryIdRejectReason ?? prev.subCategoryIdRejectReason,
          // NEW: n-level reject reason
          nLevelCategoryIdRejectReason:
            data?.nLevelCategoryIdRejectReason ??
            prev.nLevelCategoryIdRejectReason,

          stockQuantityRejectReason:
            data?.stockQuantityRejectReason ?? prev.stockQuantityRejectReason,
          brandIdRejectReason:
            data?.brandIdRejectReason ?? prev.brandIdRejectReason,
          zipcodeIdRejectReason:
            data?.zipcodeIdRejectReason ?? prev.zipcodeIdRejectReason,

          productVideoUrlRejectReason:
            data?.productVideoUrlRejectReason ??
            prev.productVideoUrlRejectReason,
          descriptionRejectReason:
            data?.descriptionRejectReason ?? prev.descriptionRejectReason,
          priceRejectReason: data?.priceRejectReason ?? prev.priceRejectReason,
          discountedPriceRejectReason:
            data?.discountedPriceRejectReason ??
            prev.discountedPriceRejectReason,
          productHeroImageRejectReason:
            data?.productHeroImageRejectReason ??
            prev.productHeroImageRejectReason,
          productGalleryRejectReason:
            data?.productGalleryRejectReason ?? prev.productGalleryRejectReason,
          productVideoRejectReason:
            data?.productVideoRejectReason ?? prev.productVideoRejectReason,

          profileStatus: data?.profileStatus ?? prev.profileStatus,
          productVariantsRejectReason: data?.productVariantsRejectReason ?? "",
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(details?.productVariants)) {
      setFormData((prev) => ({
        ...prev,
        variantsApproval: details.productVariants.map((v) => ({
          isApproved: v?.isApproved ?? false,
          rejectReason: v?.rejectReason ?? "waiting for approval",
        })),
      }));
    }
  }, [details?.productVariants]);
  
  

  useEffect(() => {
    getProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  // Approve-all behavior when profileStatus is set to "approved"
  useEffect(() => {
    if (!Array.isArray(details?.productVariants)) return;
    if (formData?.profileStatus === "approved") {
      setFormData((prev) => ({
        ...prev,
        variantsApproval: details.productVariants.map(() => ({
          isApproved: true,
          rejectReason: "",
        })),
        // Set all approvals true and clear reasons
        isNameApproved: true,
        nameRejectReason: "",
        isTagsApproved: true,
        tagsRejectReason: "",
        isProductTypeApproved: true,
        productTypeRejectReason: "",
        isTaxApproved: true,
        taxRejectReason: "",
        isMadeInApproved: true,
        madeInRejectReason: "",
        isHsnCodeApproved: true,
        hsnCodeRejectReason: "",
        isShortDescriptionApproved: true,
        shortDescriptionRejectReason: "",

        isStatusApproved: true,
        statusRejectReason: "",
        isMinOrderQuantityApproved: true,
        minOrderQuantityRejectReason: "",
        isMaxOrderQuantityApproved: true,
        maxOrderQuantityRejectReason: "",
        isWarrantyPeriodApproved: true,
        warrantyPeriodRejectReason: "",
        isGuaranteePeriodApproved: true,
        guaranteePeriodRejectReason: "",
        isCategoryIdApproved: true,
        categoryIdRejectReason: "",
        isSubCategoryIdApproved: true,
        subCategoryIdRejectReason: "",
        // NEW fields included in approve-all
        isNLevelCategoryIdApproved: true,
        nLevelCategoryIdRejectReason: "",
        isStockQuantityApproved: true,
        stockQuantityRejectReason: "",
        isBrandIdApproved: true,
        brandIdRejectReason: "",
        isZipcodeIdApproved: true,
        zipcodeIdRejectReason: "",

        isProductVideoUrlApproved: true,
        productVideoUrlRejectReason: "",
        isDescriptionApproved: true,
        descriptionRejectReason: "",
        isPriceApproved: true,
        priceRejectReason: "",
        isDiscountedPriceApproved: true,
        discountedPriceRejectReason: "",
        isProductHeroImageApproved: true,
        productHeroImageRejectReason: "",
        isProductGalleryApproved: true,
        productGalleryRejectReason: "",
        isProductVideoApproved: true,
        productVideoRejectReason: "",
        isProductVariantsApproved: true,
        productVariantsRejectReason: "",
      }));
    }
  }, [formData?.profileStatus, details?.productVariants]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const mergedVariants = Array.isArray(details?.productVariants)
        ? details.productVariants.map((v, i) => ({
            ...v,
            isApproved: formData.variantsApproval?.[i]?.isApproved ?? false,
            rejectReason:
              formData.variantsApproval?.[i]?.rejectReason ??
              "waiting for approval",
          }))
        : [];

      const payload = {
        ...formData,
        _id: params?.id,
        productVariants: mergedVariants,
      };
      const response = await updateProductServ(payload);
      if (response?.data?.statusCode === 200) {
        toast.success("Product approval updated successfully!");
        navigate("/product-list");
      } else {
        toast.error(
          response?.data?.message || "Failed to update product approval."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const CheckRow = ({ approvedKey, reasonKey, label, value }) => (
    <div className="col-6 mb-3">
      <input
        type="checkbox"
        className="me-2"
        checked={formData[approvedKey] === true}
        onChange={(e) =>
          setFormData({
            ...formData,
            [approvedKey]: e.target.checked,
            [reasonKey]: e.target.checked ? "" : "waiting for approval",
          })
        }
      />
      <label>{label}</label>
      <input
        className="form-control"
        value={value ?? ""}
        readOnly
        style={{ height: "45px" }}
      />
      {!formData[approvedKey] && (
        <input
          className="form-control mt-2"
          value={formData[reasonKey] ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, [reasonKey]: e.target.value })
          }
        />
      )}
    </div>
  );

  const CheckTextArea = ({ approvedKey, reasonKey, label, value }) => (
    <div className="col-12 mb-3">
      <input
        type="checkbox"
        className="me-2"
        checked={formData[approvedKey] === true}
        onChange={(e) =>
          setFormData({
            ...formData,
            [approvedKey]: e.target.checked,
            [reasonKey]: e.target.checked ? "" : "waiting for approval",
          })
        }
      />
      <label>{label}</label>
      <textarea
        className="form-control"
        value={value ?? ""}
        readOnly
        rows={3}
      />
      {!formData[approvedKey] && (
        <input
          className="form-control mt-2"
          value={formData[reasonKey] ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, [reasonKey]: e.target.value })
          }
        />
      )}
    </div>
  );

  if (loading) {
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
            >
              <Skeleton height={40} width={220} />
              <div className="mt-3">
                <Skeleton count={8} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          >
            <div className="mt-3">
              <div className="card-body px-2">
                <div className="table-responsive table-invoice">
                  <div className="d-flex">
                    <h4
                      className="p-2 text-dark shadow rounded mb-4"
                      style={{ background: "#05E2B5" }}
                    >
                      Approve Product
                    </h4>
                  </div>
                </div>

                {/* Step 1 */}
                <div
                  className="p-3 shadow rounded mb-3"
                  style={{ background: "#E6DFCF" }}
                >
                  <h3>
                    <u>Step 1</u>
                  </h3>
                  <div className="row">
                    <CheckRow
                      approvedKey="isNameApproved"
                      reasonKey="nameRejectReason"
                      label="Product Name"
                      value={details?.name}
                    />
                    <CheckRow
                      approvedKey="isTagsApproved"
                      reasonKey="tagsRejectReason"
                      label="Tags"
                      value={
                        Array.isArray(details?.tags)
                          ? details?.tags?.join(", ")
                          : details?.tags
                      }
                    />
                    <CheckRow
                      approvedKey="isProductTypeApproved"
                      reasonKey="productTypeRejectReason"
                      label="Product Type"
                      value={details?.productType}
                    />
                    <CheckRow
                      approvedKey="isTaxApproved"
                      reasonKey="taxRejectReason"
                      label="Tax"
                      value={details?.tax}
                    />
                    <CheckRow
                      approvedKey="isMadeInApproved"
                      reasonKey="madeInRejectReason"
                      label="Made In"
                      value={details?.madeIn}
                    />
                    <CheckRow
                      approvedKey="isHsnCodeApproved"
                      reasonKey="hsnCodeRejectReason"
                      label="HSN Code"
                      value={details?.hsnCode}
                    />
                    <CheckTextArea
                      approvedKey="isShortDescriptionApproved"
                      reasonKey="shortDescriptionRejectReason"
                      label="Short Description"
                      value={details?.shortDescription}
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className="p-3 shadow rounded mb-3"
                  style={{ background: "#DAF0D5" }}
                >
                  <h3>
                    <u>Step 2</u>
                  </h3>
                  <div className="row">
                    <CheckRow
                      approvedKey="isMinOrderQuantityApproved"
                      reasonKey="minOrderQuantityRejectReason"
                      label="Min Order Quantity"
                      value={details?.minOrderQuantity}
                    />
                    <CheckRow
                      approvedKey="isMaxOrderQuantityApproved"
                      reasonKey="maxOrderQuantityRejectReason"
                      label="Max Order Quantity"
                      value={details?.maxOrderQuantity}
                    />
                    <CheckRow
                      approvedKey="isWarrantyPeriodApproved"
                      reasonKey="warrantyPeriodRejectReason"
                      label="Warranty Period"
                      value={details?.warrantyPeriod}
                    />
                    <CheckRow
                      approvedKey="isGuaranteePeriodApproved"
                      reasonKey="guaranteePeriodRejectReason"
                      label="Guarantee Period"
                      value={details?.guaranteePeriod}
                    />
                    <CheckRow
                      approvedKey="isStockQuantityApproved"
                      reasonKey="stockQuantityRejectReason"
                      label="Stock Quantity"
                      value={details?.stockQuantity}
                    />

                    <CheckRow
                      approvedKey="isBrandIdApproved"
                      reasonKey="brandIdRejectReason"
                      label="Brand"
                      value={details?.brandId?.name}
                    />
                    <CheckRow
                      approvedKey="isCategoryIdApproved"
                      reasonKey="categoryIdRejectReason"
                      label="Category"
                      value={details?.categoryId?.name}
                    />
                    <CheckRow
                      approvedKey="isSubCategoryIdApproved"
                      reasonKey="subCategoryIdRejectReason"
                      label="Sub Category"
                      value={details?.subCategoryId?.name}
                    />

                    {/* NEW: N-Level Category approval */}
                    <CheckRow
                      approvedKey="isNLevelCategoryIdApproved"
                      reasonKey="nLevelCategoryIdRejectReason"
                      label="N-Level Category"
                      value={
                        details?.nLevelCategoryId?.name ||
                        details?.nLevelCategoryName
                      }
                    />

                    <CheckRow
                      approvedKey="isZipcodeIdApproved"
                      reasonKey="zipcodeIdRejectReason"
                      label="Deliverable Zipcodes"
                      value={
                        Array.isArray(details?.zipcodeId)
                          ? details?.zipcodeId
                              ?.map((z) => z?.zipcode)
                              ?.join(", ")
                          : details?.zipcodeId
                      }
                    />

                    <CheckRow
                      approvedKey="isPriceApproved"
                      reasonKey="priceRejectReason"
                      label="Product Price"
                      value={details?.price}
                    />
                    <CheckRow
                      approvedKey="isDiscountedPriceApproved"
                      reasonKey="discountedPriceRejectReason"
                      label="Discounted Price"
                      value={details?.discountedPrice}
                    />

                    {/* Some commonly toggled product policy flags (read-only display) */}
                    <div className="col-6 mb-3">
                      <label>Product Returnable</label>
                      <input
                        className="form-control"
                        value={details?.isProductReturnable ? "Yes" : "No"}
                        readOnly
                        style={{ height: "45px" }}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label>COD Allowed</label>
                      <input
                        className="form-control"
                        value={details?.isCodAllowed ? "Yes" : "No"}
                        readOnly
                        style={{ height: "45px" }}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label>Tax Included</label>
                      <input
                        className="form-control"
                        value={details?.isProductTaxIncluded ? "Yes" : "No"}
                        readOnly
                        style={{ height: "45px" }}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label>Cancelable</label>
                      <input
                        className="form-control"
                        value={details?.isProductCancelable ? "Yes" : "No"}
                        readOnly
                        style={{ height: "45px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description & Video URL */}
                <div className="col-12 mb-3 row">
                  <div className="col-6">
                    <CheckTextArea
                      approvedKey="isDescriptionApproved"
                      reasonKey="descriptionRejectReason"
                      label="Product Description"
                      value={details?.description}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isProductVideoUrlApproved === true}
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
                    <div>
                      {details?.productVideoUrl ? (
                        <iframe
                          width="100%"
                          height="315"
                          src={
                            details.productVideoUrl.includes("youtu.be")
                              ? `https://www.youtube.com/embed/${details.productVideoUrl
                                  .split("/")
                                  .pop()}`
                              : details.productVideoUrl
                          }
                          title="Product Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <input className="form-control" value="" readOnly />
                      )}
                    </div>
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
                  </div>
                </div>

                {/* Gallery */}
                <div
                  className="p-3 shadow rounded mb-3"
                  style={{ background: "#F6F0D6" }}
                >
                  <h3>
                    <u>Product Gallery</u>
                  </h3>
                  <div className="row">
                    {/* Hero image */}
                    <div className="col-4 mb-3">
                      <div className="border p-2">
                        <div className="d-flex justify-content-center">
                          {details?.productHeroImage && (
                            <img
                              src={details.productHeroImage}
                              className="img-fluid mb-2"
                              style={{ height: "150px" }}
                              alt="hero"
                            />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isProductHeroImageApproved === true}
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

                    {/* Product video file (if present) */}
                    <div className="col-4 mb-3">
                      <div className="border p-2">
                        <div className="d-flex justify-content-center">
                          {details?.productVideo && (
                            <video
                              className="mb-2"
                              style={{ height: "150px" }}
                              src={details.productVideo}
                              controls
                            />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isProductVideoApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isProductVideoApproved: e.target.checked,
                              productVideoRejectReason: e.target.checked
                                ? ""
                                : "waiting for approval",
                            })
                          }
                        />
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

                    {/* Gallery list */}
                    <div className="col-12 mb-3">
                      <label>Product Gallery</label>
                      <div className="p-2 border d-flex flex-wrap">
                        {Array.isArray(details?.productGallery) &&
                          details.productGallery.map((g, i) => (
                            <div key={i} className="p-2 border mx-2">
                              <img
                                className="img-fluid"
                                style={{ height: "150px" }}
                                src={g}
                                alt={`gallery-${i}`}
                              />
                            </div>
                          ))}
                      </div>
                      <div className="mt-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isProductGalleryApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isProductGalleryApproved: e.target.checked,
                              productGalleryRejectReason: e.target.checked
                                ? ""
                                : "waiting for approval",
                            })
                          }
                        />
                        <label>Product Gallery</label>
                        {!formData.isProductGalleryApproved && (
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
                </div>

                {/* Attributes */}
                <div
                  className="p-3 shadow rounded mb-3"
                  style={{ background: "#D1DBD5" }}
                >
                  <h3>
                    <u>Product Attributes</u>
                  </h3>
                  <div className="row">
                    {Array.isArray(details?.productOtherDetails) &&
                      details.productOtherDetails.map((att, i) => (
                        <div className="col-4 mb-3" key={i}>
                          <div className="border p-2">
                            <label>{att?.key}</label>
                            <input
                              className="form-control"
                              value={
                                Array.isArray(att?.value)
                                  ? att.value.join(", ")
                                  : att?.value ?? ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Variants */}
                <div className="row">
                  {Array.isArray(details?.productVariants) &&
                    details.productVariants.map((v, i) => (
                      <div className="col-4 mb-3" key={i}>
                        <div className="border p-2">
                          {/* Per-variant approval */}
                          <div className="mb-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={
                                formData.variantsApproval?.[i]?.isApproved ===
                                true
                              }
                              onChange={(e) => {
                                const next = [
                                  ...(formData.variantsApproval || []),
                                ];
                                next[i] = {
                                  ...(next[i] || {}),
                                  isApproved: e.target.checked,
                                  rejectReason: e.target.checked
                                    ? ""
                                    : next[i]?.rejectReason ||
                                      "waiting for approval",
                                };
                                setFormData({
                                  ...formData,
                                  variantsApproval: next,
                                });
                              }}
                            />
                            <label>Approve this variant</label>
                            {!formData.variantsApproval?.[i]?.isApproved && (
                              <input
                                className="form-control mt-2"
                                placeholder="Reject reason"
                                value={
                                  formData.variantsApproval?.[i]
                                    ?.rejectReason || ""
                                }
                                onChange={(e) => {
                                  const next = [
                                    ...(formData.variantsApproval || []),
                                  ];
                                  next[i] = {
                                    ...(next[i] || {}),
                                    isApproved: next[i]?.isApproved || false,
                                    rejectReason: e.target.value,
                                  };
                                  setFormData({
                                    ...formData,
                                    variantsApproval: next,
                                  });
                                }}
                              />
                            )}
                          </div>

                          {Array.isArray(v?.variantImage) &&
                          v.variantImage.length > 0 ? (
                            <img
                              className="img-fluid mb-2"
                              src={v.variantImage[0]}
                              alt="variant"
                            />
                          ) : null}
                          <label>Key</label>
                          <input
                            className="form-control"
                            value={v?.variantKey ?? ""}
                            readOnly
                          />
                          <label>Value</label>
                          <input
                            className="form-control"
                            value={v?.variantValue ?? ""}
                            readOnly
                          />
                          {v?.variantSecondaryKey ? (
                            <>
                              <label>Secondary Key</label>
                              <input
                                className="form-control"
                                value={v?.variantSecondaryKey ?? ""}
                                readOnly
                              />
                            </>
                          ) : null}
                          {v?.variantSecondaryValue ? (
                            <>
                              <label>Secondary Value</label>
                              <input
                                className="form-control"
                                value={v?.variantSecondaryValue ?? ""}
                                readOnly
                              />
                            </>
                          ) : null}
                          <label>Price</label>
                          <input
                            className="form-control"
                            value={v?.variantPrice ?? ""}
                            readOnly
                          />
                          <label>Discounted Price</label>
                          <input
                            className="form-control"
                            value={v?.variantDiscountedPrice ?? ""}
                            readOnly
                          />
                          <label>Stock Quantity</label>
                          <input
                            className="form-control"
                            value={v?.stockQuantity ?? ""}
                            readOnly
                          />
                        </div>
                      </div>
                    ))}
                </div>

                {/* Footer actions */}
                <div className="col-12">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Profile Status</label>
                    </div>
                    <select
                      className="form-control"
                      value={formData.profileStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profileStatus: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="text-end mt-3">
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={saving}
                  >
                    {saving ? "Submitting..." : "Submit Approval"}
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

export default ProductApproval;
