import React, { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import {
  getVendorDetailsServ,
  updateVendorProfile,
} from "../../services/vender.services";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DEFAULT_REASON = "waiting for approval";

const VendorApproval = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // State mirrors existing vendor fields, default reasons set
  const [formData, setFormData] = useState({
    // Personal
    isProfilePicApproved: false,
    profilePicRejectReason: DEFAULT_REASON,
    isFirstNameApproved: false,
    firstNameRejectReason: DEFAULT_REASON,
    isLastNameApproved: false,
    lastNameRejectReason: DEFAULT_REASON,
    isEmailApproved: false,
    emailRejectReason: DEFAULT_REASON,
    isPhoneApproved: false,
    phoneRejectReason: DEFAULT_REASON,

    // Store
    isStoreLogoApproved: false,
    storeLogoRejectReason: DEFAULT_REASON,
    isBusinessLicenseApproved: false,
    businessLicenseRejectReason: DEFAULT_REASON,
    isStoreNameApproved: false,
    storeNameRejectReason: DEFAULT_REASON,
    isStoreUrlApproved: false,
    storeUrlRejectReason: DEFAULT_REASON,
    isGstNumberApproved: false,
    gstNumberRejectReason: DEFAULT_REASON,
    isStoreDescriptionApproved: false,
    storeDescriptionRejectReason: DEFAULT_REASON,
    isPincodeApproved: false,
    pincodeRejectReason: DEFAULT_REASON,
    isStoreAddressApproved: false,
    storeAddressRejectReason: DEFAULT_REASON,

    // Account / KYC
    isSignatureApproved: false,
    signatureRejectReason: DEFAULT_REASON,
    isPassBookApproved: false,
    passBookRejectReason: DEFAULT_REASON,
    isAdharCardApproved: false,
    adharCardRejectReason: DEFAULT_REASON,
    isAccountNumberApproved: false,
    accountNumberRejectReason: DEFAULT_REASON,
    isIfscCodeApproved: false,
    ifscCodeRejectReason: DEFAULT_REASON,
    isAccountHolderNameApproved: false,
    accountHolderNameRejectReason: DEFAULT_REASON,
    isBankNameApproved: false,
    bankNameRejectReason: DEFAULT_REASON,
    isBankBranchCodeApproved: false,
    bankBranchCodeRejectReason: DEFAULT_REASON,
    isUpiIdApproved: false,
    upiIdRejectReason: DEFAULT_REASON,
    isPanNumberApproved: false,
    panNumberRejectReason: DEFAULT_REASON,

    // Status
    profileStatus: "",
  });

  // Map isXApproved -> xRejectReason
  const reasonKeyOf = useCallback((approvedKey) => {
    const base = approvedKey
      .replace(/^is/, "")
      .replace(/Approved$/, "RejectReason");
    return base.charAt(0).toLowerCase() + base.slice(1);
  }, []);

  // All approved keys
  const approvalKeys = useMemo(
    () =>
      Object.keys(formData).filter(
        (k) => k.startsWith("is") && k.endsWith("Approved")
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(Object.keys(formData))]
  );

  const allApproved = useMemo(
    () => approvalKeys.every((k) => formData[k] === true),
    [approvalKeys, formData]
  );

  // Normalize one approve/reason pair
  const normalizePair = (obj, approvedKey) => {
    const rKey = reasonKeyOf(approvedKey);
    if (!(rKey in obj)) return obj;
    if (obj[approvedKey] === true) {
      obj[rKey] = "";
    } else {
      if (!obj[rKey]) obj[rKey] = DEFAULT_REASON;
    }
    return obj;
  };

  // Normalize all pairs
  const normalizeAll = (state) => {
    const next = { ...state };
    approvalKeys.forEach((aKey) => normalizePair(next, aKey));
    return next;
  };

  // Fetch and hydrate with normalization
  const getVendorDetailsFunc = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVendorDetailsServ(params.id);
      if (response?.data?.statusCode == "200") {
        const data = response.data.data?.venderDetails;
        setDetails(data);

        setFormData((prev) => {
          const next = { ...prev };
          // approvals
          approvalKeys.forEach((aKey) => {
            next[aKey] = data?.[aKey] ?? prev[aKey];
            const rKey = reasonKeyOf(aKey);
            if (rKey in next) {
              const apiReason = data?.[rKey];
              next[rKey] =
                typeof apiReason === "string" ? apiReason : prev[rKey];
            }
          });
          next.profileStatus = data?.profileStatus ?? prev.profileStatus;
          // fix mismatches from backend
          return normalizeAll(next);
        });
      } else {
        toast.error(response?.data?.message || "Failed to load vendor details");
      }
    } catch (err) {
      toast.error("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  }, [params.id, approvalKeys, reasonKeyOf]);

  useEffect(() => {
    getVendorDetailsFunc();
  }, [getVendorDetailsFunc]);

  // Status guard like ProductApproval
  useEffect(() => {
    if (formData.profileStatus === "approved" && !allApproved)
      setShowWarning(true);
    else setShowWarning(false);
  }, [formData.profileStatus, allApproved]);

  // Select All
  const handleSelectAll = useCallback(
    (checked) => {
      setFormData((prev) => {
        const next = { ...prev };
        approvalKeys.forEach((key) => {
          next[key] = checked;
          const rKey = reasonKeyOf(key);
          if (rKey in next)
            next[rKey] = checked ? "" : next[rKey] || DEFAULT_REASON;
        });
        return next;
      });
    },
    [approvalKeys, reasonKeyOf]
  );

  // Per-field toggle
  const handleToggleApproved = useCallback(
    (approvedKey, checked) => {
      setFormData((prev) => {
        const next = { ...prev, [approvedKey]: checked };
        const rKey = reasonKeyOf(approvedKey);
        if (rKey in next)
          next[rKey] = checked ? "" : prev[rKey] || DEFAULT_REASON;
        return next;
      });
    },
    [reasonKeyOf]
  );

  // Reason input change
  const handleReasonChange = useCallback((reasonKey, value) => {
    setFormData((prev) =>
      prev[reasonKey] === value ? prev : { ...prev, [reasonKey]: value }
    );
  }, []);

  // Submit with final normalization
  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      const payload = normalizeAll({ ...formData, id: params?.id });
      const response = await updateVendorProfile(payload);
      if (
        response?.data?.statusCode == 200 ||
        response?.data?.statusCode == "200"
      ) {
        toast.success(
          response?.data?.message || "Vendor approval updated successfully!"
        );
        navigate("/vendor-list");
      } else {
        toast.error(
          response?.data?.message || "Failed to update vendor approval."
        );
      }
    } catch (error) {
      toast.error("Internal Server Error");
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

  const [showDialog, setShowDialog] = useState(false);
const [pendingNavigation, setPendingNavigation] = useState(false);

const handleBack = () => {
  // Check if there are unsaved changes
  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(normalizeAll({ ...details }));

  if (!hasChanges) {
    navigate("/vendor-list");
  } else {
    setShowDialog(true); // show dialog
  }
};

// Handle dialog actions
const handleDialogAction = (action) => {
  if (action === "save") {
    setShowDialog(false);
    handleProfileUpdate(); // save changes, navigate happens inside handleProfileUpdate
  } else if (action === "dontSave") {
    setShowDialog(false);
    navigate("/vendor-list");
  } else if (action === "cancel") {
    setShowDialog(false);
  }
};


  if (loading) return <Loader />;

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Vendors" selectedItem="Manage Vendors" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="mx-0 p-4 driverApprovalMain"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
              background: "white",
              borderRadius: "24px",
            }}
          >
            <h3 className="text-secondary mb-4">Vendor Approval</h3>
            <div className="mb-3">
                <button
                  className="btn btn-light shadow-sm border rounded-pill px-4 py-2"
                  onClick={handleBack}
                  style={{ fontSize: "0.9rem", fontWeight: "500" }}
                >
                  ← Back
                </button>
              </div>
            {/* Select All */}
            <div className="mb-3">
              <input
                type="checkbox"
                className="me-2"
                checked={allApproved}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <label className="fw-bold">Select All Fields for Approval</label>
            </div>

            {/* Personal Details */}
            <div className="px-3 py-1 mb-3 shadow border rounded">
              <div className="d-flex align-items-center my-3">
                <i
                  className="fa fa-circle text-secondary me-2"
                  style={{
                    fontSize: "10px",
                    position: "relative",
                    top: "-3px",
                  }}
                ></i>
                <h5> Personal Details</h5>
              </div>
              <div className="row">
                {/* Profile Pic */}
                <div className="col-4">
                  <div className="d-flex justify-content-center">
                    <div>
                      {details?.profilePic && (
                        <img
                          src={details.profilePic}
                          style={{
                            height: "120px",
                            width: "120px",
                            borderRadius: "50%",
                          }}
                          alt="profile"
                        />
                      )}
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isProfilePicApproved === true}
                          onChange={(e) =>
                            handleToggleApproved(
                              "isProfilePicApproved",
                              e.target.checked
                            )
                          }
                        />
                        <label>Profile Pic</label>
                      </div>
                      {!formData.isProfilePicApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.profilePicRejectReason}
                          onChange={(e) =>
                            handleReasonChange(
                              "profilePicRejectReason",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 row">
                  {/* First Name */}
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isFirstNameApproved === true}
                          onChange={(e) =>
                            handleToggleApproved(
                              "isFirstNameApproved",
                              e.target.checked
                            )
                          }
                        />
                        <label>First Name</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.firstName || ""}
                        readOnly
                      />
                      {!formData.isFirstNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.firstNameRejectReason}
                          onChange={(e) =>
                            handleReasonChange(
                              "firstNameRejectReason",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isLastNameApproved === true}
                          onChange={(e) =>
                            handleToggleApproved(
                              "isLastNameApproved",
                              e.target.checked
                            )
                          }
                        />
                        <label>Last Name</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.lastName || ""}
                        readOnly
                      />
                      {!formData.isLastNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.lastNameRejectReason}
                          onChange={(e) =>
                            handleReasonChange(
                              "lastNameRejectReason",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isEmailApproved === true}
                          onChange={(e) =>
                            handleToggleApproved(
                              "isEmailApproved",
                              e.target.checked
                            )
                          }
                        />
                        <label>Email</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.email || ""}
                        readOnly
                      />
                      {!formData.isEmailApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.emailRejectReason}
                          onChange={(e) =>
                            handleReasonChange(
                              "emailRejectReason",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isPhoneApproved === true}
                          onChange={(e) =>
                            handleToggleApproved(
                              "isPhoneApproved",
                              e.target.checked
                            )
                          }
                        />
                        <label>Phone</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.phone || ""}
                        readOnly
                      />
                      {!formData.isPhoneApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.phoneRejectReason}
                          onChange={(e) =>
                            handleReasonChange(
                              "phoneRejectReason",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Details */}
              <div className="px-3 py-1 mb-3 shadow border rounded">
                <div className="d-flex align-items-center my-3">
                  <i
                    className="fa fa-circle text-secondary me-2"
                    style={{
                      fontSize: "10px",
                      position: "relative",
                      top: "-3px",
                    }}
                  ></i>
                  <h5> Store Details</h5>
                </div>

                <div className="row">
                  {/* Store Logo */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {details?.storeLogo && (
                          <img
                            src={details.storeLogo}
                            style={{
                              height: "120px",
                              width: "120px",
                              borderRadius: "50%",
                            }}
                            alt="store-logo"
                          />
                        )}
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isStoreLogoApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isStoreLogoApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Store Logo</label>
                        </div>
                        {!formData.isStoreLogoApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.storeLogoRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "storeLogoRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Business License */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {details?.bussinessLicense && (
                          <img
                            src={details.bussinessLicense}
                            style={{
                              height: "120px",
                              width: "120px",
                              borderRadius: "50%",
                            }}
                            alt="business-license"
                          />
                        )}
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={
                              formData.isBusinessLicenseApproved === true
                            }
                            onChange={(e) =>
                              handleToggleApproved(
                                "isBusinessLicenseApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Business Licences</label>
                        </div>
                        {!formData.isBusinessLicenseApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.businessLicenseRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "businessLicenseRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Store fields */}
                  <div className="col-12 row">
                    <div className="col-4">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isStoreNameApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isStoreNameApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Store Name</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.storeName || ""}
                          readOnly
                        />
                        {!formData.isStoreNameApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.storeNameRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "storeNameRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isStoreUrlApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isStoreUrlApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Store Url</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.storeUrl || ""}
                          readOnly
                        />
                        {!formData.isStoreUrlApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.storeUrlRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "storeUrlRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isGstNumberApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isGstNumberApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>GST Number</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.gstNumber || ""}
                          readOnly
                        />
                        {!formData.isGstNumberApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.gstNumberRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "gstNumberRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={
                              formData.isStoreDescriptionApproved === true
                            }
                            onChange={(e) =>
                              handleToggleApproved(
                                "isStoreDescriptionApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Store Description</label>
                        </div>
                        <textarea
                          className="form-control"
                          value={details?.storeDescription || ""}
                          readOnly
                        />
                        {!formData.isStoreDescriptionApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.storeDescriptionRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "storeDescriptionRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-12 row">
                      <div className="col-4">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>State</label>
                          </div>
                          <input
                            className="form-control"
                            value={details?.state || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>District</label>
                          </div>
                          <input
                            className="form-control"
                            value={details?.district || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isPincodeApproved === true}
                              onChange={(e) =>
                                handleToggleApproved(
                                  "isPincodeApproved",
                                  e.target.checked
                                )
                              }
                            />
                            <label>Pincode</label>
                          </div>
                          <input
                            className="form-control"
                            value={details?.pincode || ""}
                            readOnly
                          />
                          {!formData.isPincodeApproved && (
                            <input
                              className="form-control mt-2"
                              value={formData.pincodeRejectReason}
                              onChange={(e) =>
                                handleReasonChange(
                                  "pincodeRejectReason",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isStoreAddressApproved === true}
                              onChange={(e) =>
                                handleToggleApproved(
                                  "isStoreAddressApproved",
                                  e.target.checked
                                )
                              }
                            />
                            <label>Address</label>
                          </div>
                          <textarea
                            className="form-control"
                            value={details?.address || ""}
                            readOnly
                          />
                          {!formData.isStoreAddressApproved && (
                            <input
                              className="form-control mt-2"
                              value={formData.storeAddressRejectReason}
                              onChange={(e) =>
                                handleReasonChange(
                                  "storeAddressRejectReason",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="px-3 py-1 mb-3 shadow border rounded">
                <div className="d-flex align-items-center my-3">
                  <i
                    className="fa fa-circle text-secondary me-2"
                    style={{
                      fontSize: "10px",
                      position: "relative",
                      top: "-3px",
                    }}
                  ></i>
                  <h5>Account Details</h5>
                </div>

                <div className="row">
                  {/* Signature */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {details?.signature && (
                          <img
                            src={details.signature}
                            style={{
                              height: "120px",
                              width: "120px",
                              borderRadius: "50%",
                            }}
                            alt="signature"
                          />
                        )}
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isSignatureApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isSignatureApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Signature</label>
                        </div>
                        {!formData.isSignatureApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.signatureRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "signatureRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Passbook */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {details?.passBook && (
                          <img
                            src={details.passBook}
                            style={{
                              height: "120px",
                              width: "120px",
                              borderRadius: "50%",
                            }}
                            alt="passbook"
                          />
                        )}
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isPassBookApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isPassBookApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Passbook</label>
                        </div>
                        {!formData.isPassBookApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.passBookRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "passBookRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Adhar */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {details?.adharCard && (
                          <img
                            src={details.adharCard}
                            style={{
                              height: "120px",
                              width: "120px",
                              borderRadius: "50%",
                            }}
                            alt="adhar"
                          />
                        )}
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isAdharCardApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isAdharCardApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Adhar Card</label>
                        </div>
                        {!formData.isAdharCardApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.adharCardRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "adharCardRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Banking rows */}
                  <div className="col-12 row">
                    {/* Account Number */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isAccountNumberApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isAccountNumberApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Account Number</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.accountNumber || ""}
                          readOnly
                        />
                        {!formData.isAccountNumberApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.accountNumberRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "accountNumberRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* IFSC */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isIfscCodeApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isIfscCodeApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>IFSC Code</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.ifscCode || ""}
                          readOnly
                        />
                        {!formData.isIfscCodeApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.ifscCodeRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "ifscCodeRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* Account Holder Name */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={
                              formData.isAccountHolderNameApproved === true
                            }
                            onChange={(e) =>
                              handleToggleApproved(
                                "isAccountHolderNameApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Account Holder Name</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.accountHolderName || ""}
                          readOnly
                        />
                        {!formData.isAccountHolderNameApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.accountHolderNameRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "accountHolderNameRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* Bank Name */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isBankNameApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isBankNameApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Bank Name</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.bankName || ""}
                          readOnly
                        />
                        {!formData.isBankNameApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.bankNameRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "bankNameRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* Bank Branch Code */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isBankBranchCodeApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isBankBranchCodeApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Bank Branch Code</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.bankBranchCode || ""}
                          readOnly
                        />
                        {!formData.isBankBranchCodeApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.bankBranchCodeRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "bankBranchCodeRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* UPI Id */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isUpiIdApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isUpiIdApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>UPI Id</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.upiId || ""}
                          readOnly
                        />
                        {!formData.isUpiIdApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.upiIdRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "upiIdRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* PAN Number */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isPanNumberApproved === true}
                            onChange={(e) =>
                              handleToggleApproved(
                                "isPanNumberApproved",
                                e.target.checked
                              )
                            }
                          />
                          <label>Pan Number</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.panNumber || ""}
                          readOnly
                        />
                        {!formData.isPanNumberApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.panNumberRejectReason}
                            onChange={(e) =>
                              handleReasonChange(
                                "panNumberRejectReason",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({ ...prev, profileStatus: val }));
                      if (val === "approved" && !allApproved)
                        setShowWarning(true);
                      else setShowWarning(false);
                    }}
                  >
                    <option value="">Select</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {showWarning && formData.profileStatus === "approved" && (
                    <small className="text-danger">
                      Please select all vendor fields to approve before
                      submitting.
                    </small>
                  )}
                </div>
              </div>

              <div className="text-end mt-3">
                <button
                  className="btn"
                  style={{
                    color: "#fff",
                    border: "none",
                    // borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                    boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                  }}
                  onClick={handleProfileUpdate}
                  disabled={
                    saving ||
                    !formData.profileStatus ||
                    (formData.profileStatus === "approved" && !allApproved)
                  }
                >
                  {saving ? "Submitting..." : "Submit Approval"}
                </button>
              </div>
            </div>
          </div>
          {showDialog && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                backdropFilter: "blur(3px)",
                zIndex: 1050,
              }}
            >
              <div
                className="bg-white shadow-lg rounded-4 p-4 text-center animate__animated animate__fadeIn"
                style={{
                  width: "420px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
                }}
              >
                <h5
                  className="fw-semibold mb-3"
                  style={{
                    color: "#1d1d1f",
                    fontSize: "1.1rem",
                    letterSpacing: "0.3px",
                  }}
                >
                  Do you want to save the entered information?
                </h5>
                <p
                  className="text-muted mb-4"
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  Choose “Save” to keep your changes, or “Don’t Save” to discard
                  them.
                </p>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn px-4 py-2 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, rgb(52, 152, 219), rgb(41, 128, 185))",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 500,
                      transition: "0.2s",
                    }}
                    onClick={() => handleDialogAction("save")}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn px-4 py-2 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, rgb(231, 76, 60), rgb(192, 57, 43))",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 500,
                      transition: "0.2s",
                    }}
                    onClick={() => handleDialogAction("dontSave")}
                  >
                   Don’t Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-light px-4 py-2"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontWeight: 500,
                    }}
                    onClick={() => handleDialogAction("cancel")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorApproval;
