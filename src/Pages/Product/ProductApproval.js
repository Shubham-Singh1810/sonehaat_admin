import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  const [showWarning, setShowWarning] = useState(false);

  // Single state object like VendorApproval
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
    isMinOrderQuantityApproved: false,
    minOrderQuantityRejectReason: "waiting for approval",
    isMaxOrderQuantityApproved: false,
    maxOrderQuantityRejectReason: "waiting for approval",
    isWarrantyPeriodApproved: false,
    warrantyPeriodRejectReason: "waiting for approval",
    isGuaranteePeriodApproved: false,
    guaranteePeriodRejectReason: "waiting for approval",
    isStockQuantityApproved: false,
    stockQuantityRejectReason: "waiting for approval",
    isBrandIdApproved: false,
    brandIdRejectReason: "waiting for approval",
    isCategoryIdApproved: false,
    categoryIdRejectReason: "waiting for approval",
    isSubCategoryIdApproved: false,
    subCategoryIdRejectReason: "waiting for approval",
    isNLevelCategoryIdApproved: false,
    nLevelCategoryIdRejectReason: "waiting for approval",
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
    isProductVariantsApproved: false,
    productVariantsRejectReason: "waiting for approval",

    profileStatus: "",
  });

  const approvalKeys = useMemo(
    () =>
      Object.keys(formData).filter(
        (k) => k.startsWith("is") && k.endsWith("Approved")
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(Object.keys(formData))]
  );

  const allApproved = useMemo(
    () =>
      approvalKeys.every((key) => formData[key] === true),
    [approvalKeys, formData]
  );

  const reasonKeyOf = useCallback((approvedKey) => {
    // isNameApproved => nameRejectReason
    const base = approvedKey.replace(/^is/, "").replace(/Approved$/, "RejectReason");
    return base.charAt(0).toLowerCase() + base.slice(1);
  }, []);

  const getProductDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProductDetailsServ(params?.id);
      if (response?.data?.statusCode === 200) {
        const data = response?.data?.data;
        setDetails(data);
        // hydrate approvals and reasons from API once like VendorApproval
        setFormData((prev) => {
          const next = { ...prev };
          Object.keys(prev).forEach((key) => {
            if (key.startsWith("is") && key.endsWith("Approved")) {
              next[key] = data?.[key] ?? prev[key];
            } else if (key.endsWith("RejectReason")) {
              next[key] = data?.[key] ?? prev[key];
            }
          });
          next.profileStatus = data?.profileStatus ?? prev.profileStatus;
          return next;
        });
      }
    } catch (error) {
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

  useEffect(() => {
    if (formData.profileStatus === "approved" && !allApproved) setShowWarning(true);
    else setShowWarning(false);
  }, [formData.profileStatus, allApproved]);

  const handleSelectAll = useCallback((checked) => {
    setFormData((prev) => {
      const next = { ...prev };
      approvalKeys.forEach((key) => {
        next[key] = checked;
        const rKey = reasonKeyOf(key);
        if (rKey in next) {
          next[rKey] = checked ? "" : (next[rKey] || "waiting for approval");
        }
      });
      return next;
    });
  }, [approvalKeys, reasonKeyOf]);

  const handleToggleApproved = useCallback((approvedKey, checked) => {
    const rKey = reasonKeyOf(approvedKey);
    setFormData((prev) => {
      const next = { ...prev, [approvedKey]: checked };
      if (checked) {
        next[rKey] = "";
      } else {
        next[rKey] = prev[rKey] || "waiting for approval";
      }
      return next;
    });
  }, [reasonKeyOf]);

  const handleReasonChange = useCallback((reasonKey, value) => {
    setFormData((prev) => {
      if (prev[reasonKey] === value) return prev;
      return { ...prev, [reasonKey]: value };
    });
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        status: formData.profileStatus,
        _id: params?.id,
      };
      const response = await updateProductServ(payload);
      if (response?.data?.statusCode === 200) {
        toast.success("Product approval updated successfully!");
        navigate("/product-list");
      } else {
        toast.error(response?.data?.message || "Failed to update product approval.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const Loader = () => (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row mx-0 p-0">
            <h4 className="mb-4">
              <Skeleton height={40} width={200} />
            </h4>
            <div className="p-3 shadow rounded mb-3" style={{ background: "#E6DFCF" }}>
              <Skeleton height={30} width={120} className="mb-3" />
              <div className="row">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="col-6 mb-3">
                    <Skeleton height={20} width={100} className="mb-1" />
                    <Skeleton height={45} />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 shadow rounded mb-3" style={{ background: "#DAF0D5" }}>
              <Skeleton height={30} width={120} className="mb-3" />
              <div className="row">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="col-6 mb-3">
                    <Skeleton height={20} width={100} className="mb-1" />
                    <Skeleton height={45} />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 shadow rounded mb-3" style={{ background: "#F6F0D6" }}>
              <Skeleton height={30} width={160} className="mb-3" />
              <div className="row">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="col-4 mb-3">
                    <Skeleton height={150} />
                    <Skeleton height={20} width={140} className="mt-2" />
                  </div>
                ))}
              </div>
            </div>
            <Skeleton height={50} width={180} className="mt-3" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loader />;

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{ position: "relative", top: "-75px", marginBottom: "-75px" }}
          >
            <div className="mt-3">
              <div className="card-body px-2">
                <div className="table-responsive table-invoice">
                  <div className="d-flex">
                    <h4 className="p-2 text-dark shadow rounded mb-4" style={{ background: "#05E2B5" }}>
                      Approve Product
                    </h4>
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="checkbox"
                    className="me-2"
                    checked={allApproved}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <label className="fw-bold">Select All Fields for Approval</label>
                </div>

                {/* Step 1 */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#E6DFCF" }}>
                  <h3>
                    <u>Step 1</u>
                  </h3>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isNameApproved === true}
                        onChange={(e) => handleToggleApproved("isNameApproved", e.target.checked)}
                      />
                      <label>Product Name</label>
                      <input className="form-control" value={details?.name ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.nameRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("nameRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isTagsApproved === true}
                        onChange={(e) => handleToggleApproved("isTagsApproved", e.target.checked)}
                      />
                      <label>Tags</label>
                      <input
                        className="form-control"
                        value={Array.isArray(details?.tags) ? details?.tags?.join(", ") : (details?.tags ?? "")}
                        readOnly
                        style={{ height: "45px" }}
                      />
                      {!formData.isTagsApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.tagsRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("tagsRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isProductTypeApproved === true}
                        onChange={(e) => handleToggleApproved("isProductTypeApproved", e.target.checked)}
                      />
                      <label>Product Type</label>
                      <input className="form-control" value={details?.productType ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isProductTypeApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.productTypeRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("productTypeRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isTaxApproved === true}
                        onChange={(e) => handleToggleApproved("isTaxApproved", e.target.checked)}
                      />
                      <label>Tax</label>
                      <input className="form-control" value={details?.tax ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isTaxApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.taxRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("taxRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isMadeInApproved === true}
                        onChange={(e) => handleToggleApproved("isMadeInApproved", e.target.checked)}
                      />
                      <label>Made In</label>
                      <input className="form-control" value={details?.madeIn ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isMadeInApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.madeInRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("madeInRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isHsnCodeApproved === true}
                        onChange={(e) => handleToggleApproved("isHsnCodeApproved", e.target.checked)}
                      />
                      <label>HSN Code</label>
                      <input className="form-control" value={details?.hsnCode ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isHsnCodeApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.hsnCodeRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("hsnCodeRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-12 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isShortDescriptionApproved === true}
                        onChange={(e) => handleToggleApproved("isShortDescriptionApproved", e.target.checked)}
                      />
                      <label>Short Description</label>
                      <textarea className="form-control" value={details?.shortDescription ?? ""} readOnly rows={3} />
                      {!formData.isShortDescriptionApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.shortDescriptionRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("shortDescriptionRejectReason", e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#DAF0D5" }}>
                  <h3>
                    <u>Step 2</u>
                  </h3>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isMinOrderQuantityApproved === true}
                        onChange={(e) => handleToggleApproved("isMinOrderQuantityApproved", e.target.checked)}
                      />
                      <label>Min Order Quantity</label>
                      <input className="form-control" value={details?.minOrderQuantity ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isMinOrderQuantityApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.minOrderQuantityRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("minOrderQuantityRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isMaxOrderQuantityApproved === true}
                        onChange={(e) => handleToggleApproved("isMaxOrderQuantityApproved", e.target.checked)}
                      />
                      <label>Max Order Quantity</label>
                      <input className="form-control" value={details?.maxOrderQuantity ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isMaxOrderQuantityApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.maxOrderQuantityRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("maxOrderQuantityRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isWarrantyPeriodApproved === true}
                        onChange={(e) => handleToggleApproved("isWarrantyPeriodApproved", e.target.checked)}
                      />
                      <label>Warranty Period</label>
                      <input className="form-control" value={details?.warrantyPeriod ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isWarrantyPeriodApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.warrantyPeriodRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("warrantyPeriodRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isGuaranteePeriodApproved === true}
                        onChange={(e) => handleToggleApproved("isGuaranteePeriodApproved", e.target.checked)}
                      />
                      <label>Guarantee Period</label>
                      <input className="form-control" value={details?.guaranteePeriod ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isGuaranteePeriodApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.guaranteePeriodRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("guaranteePeriodRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isStockQuantityApproved === true}
                        onChange={(e) => handleToggleApproved("isStockQuantityApproved", e.target.checked)}
                      />
                      <label>Stock Quantity</label>
                      <input className="form-control" value={details?.stockQuantity ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isStockQuantityApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.stockQuantityRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("stockQuantityRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isBrandIdApproved === true}
                        onChange={(e) => handleToggleApproved("isBrandIdApproved", e.target.checked)}
                      />
                      <label>Brand</label>
                      <input className="form-control" value={details?.brandId?.name ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isBrandIdApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.brandIdRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("brandIdRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isCategoryIdApproved === true}
                        onChange={(e) => handleToggleApproved("isCategoryIdApproved", e.target.checked)}
                      />
                      <label>Category</label>
                      <input className="form-control" value={details?.categoryId?.name ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isCategoryIdApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.categoryIdRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("categoryIdRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isSubCategoryIdApproved === true}
                        onChange={(e) => handleToggleApproved("isSubCategoryIdApproved", e.target.checked)}
                      />
                      <label>Sub Category</label>
                      <input className="form-control" value={details?.subCategoryId?.name ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isSubCategoryIdApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.subCategoryIdRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("subCategoryIdRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isNLevelCategoryIdApproved === true}
                        onChange={(e) => handleToggleApproved("isNLevelCategoryIdApproved", e.target.checked)}
                      />
                      <label>N-Level Category</label>
                      <input
                        className="form-control"
                        value={details?.nLevelCategoryId?.name || details?.nLevelCategoryName || ""}
                        readOnly
                        style={{ height: "45px" }}
                      />
                      {!formData.isNLevelCategoryIdApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.nLevelCategoryIdRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("nLevelCategoryIdRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isZipcodeIdApproved === true}
                        onChange={(e) => handleToggleApproved("isZipcodeIdApproved", e.target.checked)}
                      />
                      <label>Deliverable Zipcodes</label>
                      <input
                        className="form-control"
                        value={
                          Array.isArray(details?.zipcodeId)
                            ? details?.zipcodeId?.map((z) => z?.zipcode)?.join(", ")
                            : (details?.zipcodeId ?? "")
                        }
                        readOnly
                        style={{ height: "45px" }}
                      />
                      {!formData.isZipcodeIdApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.zipcodeIdRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("zipcodeIdRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isPriceApproved === true}
                        onChange={(e) => handleToggleApproved("isPriceApproved", e.target.checked)}
                      />
                      <label>Product Price</label>
                      <input className="form-control" value={details?.price ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isPriceApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.priceRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("priceRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isDiscountedPriceApproved === true}
                        onChange={(e) => handleToggleApproved("isDiscountedPriceApproved", e.target.checked)}
                      />
                      <label>Discounted Price</label>
                      <input className="form-control" value={details?.discountedPrice ?? ""} readOnly style={{ height: "45px" }} />
                      {!formData.isDiscountedPriceApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.discountedPriceRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("discountedPriceRejectReason", e.target.value)}
                        />
                      )}
                    </div>

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
                    <div className="col-12 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isDescriptionApproved === true}
                        onChange={(e) => handleToggleApproved("isDescriptionApproved", e.target.checked)}
                      />
                      <label>Product Description</label>
                      <textarea className="form-control" value={details?.description ?? ""} readOnly rows={3} />
                      {!formData.isDescriptionApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.descriptionRejectReason ?? ""}
                          onChange={(e) => handleReasonChange("descriptionRejectReason", e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isProductVideoUrlApproved === true}
                      onChange={(e) => handleToggleApproved("isProductVideoUrlApproved", e.target.checked)}
                    />
                    <label>Video URL</label>
                    <div>
                      {details?.productVideoUrl ? (
                        <iframe
                          width="100%"
                          height="315"
                          src={
                            details.productVideoUrl.includes("youtu.be")
                              ? `https://www.youtube.com/embed/${details.productVideoUrl.split("/").pop()}`
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
                        value={formData.productVideoUrlRejectReason ?? ""}
                        onChange={(e) => handleReasonChange("productVideoUrlRejectReason", e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* Gallery */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#F6F0D6" }}>
                  <h3>
                    <u>Product Gallery</u>
                  </h3>
                  <div className="row">
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
                          onChange={(e) => handleToggleApproved("isProductHeroImageApproved", e.target.checked)}
                        />
                        <label>Product Hero Image</label>
                        {!formData.isProductHeroImageApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.productHeroImageRejectReason ?? ""}
                            onChange={(e) => handleReasonChange("productHeroImageRejectReason", e.target.value)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-4 mb-3">
                      <div className="border p-2">
                        <div className="d-flex justify-content-center">
                          {details?.productVideo && (
                            <video className="mb-2" style={{ height: "150px" }} src={details.productVideo} controls />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isProductVideoApproved === true}
                          onChange={(e) => handleToggleApproved("isProductVideoApproved", e.target.checked)}
                        />
                        <label>Product Video</label>
                        {!formData.isProductVideoApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.productVideoRejectReason ?? ""}
                            onChange={(e) => handleReasonChange("productVideoRejectReason", e.target.value)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-12 mb-3">
                      <label>Product Gallery</label>
                      <div className="p-2 border d-flex flex-wrap">
                        {Array.isArray(details?.productGallery) &&
                          details.productGallery.map((g, i) => (
                            <div key={i} className="p-2 border mx-2">
                              <img className="img-fluid" style={{ height: "150px" }} src={g} alt={`gallery-${i}`} />
                            </div>
                          ))}
                      </div>
                      <div className="mt-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isProductGalleryApproved === true}
                          onChange={(e) => handleToggleApproved("isProductGalleryApproved", e.target.checked)}
                        />
                        <label>Product Gallery</label>
                        {!formData.isProductGalleryApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.productGalleryRejectReason ?? ""}
                            onChange={(e) => handleReasonChange("productGalleryRejectReason", e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attributes */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#D1DBD5" }}>
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
                <div className="p-3 shadow rounded mb-3" style={{ background: "#E9ECEF" }}>
                  <h3>
                    <u>Product Variants</u>
                  </h3>

                  <div className="mb-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={formData.isProductVariantsApproved === true}
                      onChange={(e) => handleToggleApproved("isProductVariantsApproved", e.target.checked)}
                    />
                    <label>Approve Variants</label>
                    {!formData.isProductVariantsApproved && (
                      <input
                        className="form-control mt-2"
                        value={formData.productVariantsRejectReason ?? ""}
                        onChange={(e) => handleReasonChange("productVariantsRejectReason", e.target.value)}
                      />
                    )}
                  </div>

                  <div className="row">
                    {Array.isArray(details?.productVariants) &&
                      details.productVariants.map((v, i) => (
                        <div className="col-12 col-md-6 col-lg-4 mb-3" key={i}>
                          <div className="border p-2 rounded bg-white h-100 d-flex flex-column">
                            {Array.isArray(v?.variantImage) && v.variantImage.length > 0 ? (
                              <div
                                className="mb-2 rounded"
                                style={{
                                  width: "100%",
                                  height: 220,
                                  overflow: "hidden",
                                  background: "#f8f9fa",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={v.variantImage[0]}
                                  alt="variant"
                                  loading="lazy"
                                  className="w-100 h-100"
                                  style={{
                                    objectFit: "contain",
                                    objectPosition: "center",
                                    display: "block",
                                  }}
                                />
                              </div>
                            ) : null}

                            <label className="form-label mb-0">Key</label>
                            <input className="form-control mb-2" value={v?.variantKey ?? ""} readOnly />

                            <label className="form-label mb-0">Value</label>
                            <input className="form-control mb-2" value={v?.variantValue ?? ""} readOnly />

                            {v?.variantSecondaryKey ? (
                              <>
                                <label className="form-label mb-0">Secondary Key</label>
                                <input className="form-control mb-2" value={v?.variantSecondaryKey ?? ""} readOnly />
                              </>
                            ) : null}

                            {v?.variantSecondaryValue ? (
                              <>
                                <label className="form-label mb-0">Secondary Value</label>
                                <input className="form-control mb-2" value={v?.variantSecondaryValue ?? ""} readOnly />
                              </>
                            ) : null}

                            <label className="form-label mb-0">Price</label>
                            <input className="form-control mb-2" value={v?.variantPrice ?? ""} readOnly />

                            <label className="form-label mb-0">Discounted Price</label>
                            <input className="form-control mb-2" value={v?.variantDiscountedPrice ?? ""} readOnly />

                            <label className="form-label mb-0">Stock Quantity</label>
                            <input className="form-control" value={v?.stockQuantity ?? ""} readOnly />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="col-12">
                  <div className="shadow-sm p-3 mb-3">
                    <label>Product Status</label>
                    <select
                      className="form-control"
                      value={formData.profileStatus}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({ ...prev, profileStatus: val }));
                        if (val === "approved" && !allApproved) setShowWarning(true);
                        else setShowWarning(false);
                      }}
                    >
                      <option value="">Select</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {showWarning && formData.profileStatus === "approved" && (
                      <small className="text-danger">
                        Please select all product fields to approve before submitting.
                      </small>
                    )}
                  </div>
                </div>

                <div className="text-end mt-3">
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={
                      saving ||
                      (formData.profileStatus === "approved" && !allApproved) ||
                      !formData.profileStatus
                    }
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
