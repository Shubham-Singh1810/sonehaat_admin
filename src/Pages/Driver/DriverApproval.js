import React, { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getDriverDetailsServ,
  updateDriverProfile,
} from "../../services/driver.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DEFAULT_REASON = "waiting for approval";

function DriverApproval() {
  const params = useParams();
  const navigate = useNavigate();
 const [showDialog, setShowDialog] = useState(false);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [formData, setFormData] = useState({
    // Images
    isProfilePicApproved: false,
    profilePicRejectReason: DEFAULT_REASON,
    isDlFrontImageApproved: false,
    dlFrontImageRejectReason: DEFAULT_REASON,
    isDlBackImageApproved: false,
    dlBackImageRejectReason: DEFAULT_REASON,

    // Personal info
    isFirstNameApproved: false,
    firstNameRejectReason: DEFAULT_REASON,
    isLastNameApproved: false,
    lastNameRejectReason: DEFAULT_REASON,
    isEmailApproved: false,
    emailRejectReason: DEFAULT_REASON,
    isPhoneApproved: false,
    phoneRejectReason: DEFAULT_REASON,
    isAddressApproved: false,
    addressRejectReason: DEFAULT_REASON,
    isPincodeApproved: false,
    pincodeRejectReason: DEFAULT_REASON,

    // Account/KYC
    isIfscCodeApproved: false,
    ifscCodeRejectReason: DEFAULT_REASON,
    isAccountNumberApproved: false,
    accountNumberRejectReason: DEFAULT_REASON,
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
    isSignatureApproved: false,
    signatureRejectReason: DEFAULT_REASON,
    isAdharCardApproved: false,
    adharCardRejectReason: DEFAULT_REASON,

    // Vehicle
    isVehicleNumberApproved: false,
    vehicleNumberRejectReason: DEFAULT_REASON,
    isVehicleTypeApproved: false,
    vehicleTypeRejectReason: DEFAULT_REASON,
    isVehicleImageApproved: false,
    vehicleImageRejectReason: DEFAULT_REASON,

    // Status
    profileStatus: "",
  });

  // Map isXApproved -> xRejectReason
  const reasonKeyOf = useCallback((approvedKey) => {
    const base = approvedKey.replace(/^is/, "").replace(/Approved$/, "RejectReason");
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
    () => approvalKeys.every((key) => formData[key] === true),
    [approvalKeys, formData]
  );

  // Normalization helpers
  const normalizePair = (obj, approvedKey) => {
    const rKey = reasonKeyOf(approvedKey);
    if (!(rKey in obj)) return obj;
    if (obj[approvedKey] === true) {
      // Approved => reason must be empty
      obj[rKey] = "";
    } else {
      // Rejected => ensure default if empty
      if (!obj[rKey]) obj[rKey] = DEFAULT_REASON;
    }
    return obj;
  };

  const normalizeAll = (state) => {
    const next = { ...state };
    approvalKeys.forEach((aKey) => normalizePair(next, aKey));
    return next;
  };

  // Load and normalize data from API
  const getDriverDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDriverDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        const data = response?.data?.data;
        setDetails(data);

        setFormData((prev) => {
          const next = { ...prev };
          // hydrate approvals
          approvalKeys.forEach((aKey) => {
            next[aKey] = data?.[aKey] ?? prev[aKey];
            const rKey = reasonKeyOf(aKey);
            if (rKey in next) {
              const apiReason = data?.[rKey];
              // use API value if string, else keep existing
              next[rKey] = typeof apiReason === "string" ? apiReason : prev[rKey];
            }
          });
          next.profileStatus = data?.profileStatus ?? prev.profileStatus;

          // FIX: normalize mismatches from backend
          return normalizeAll(next);
        });
      } else {
        toast.error(response?.data?.message || "Failed to load driver details.");
      }
    } catch (e) {
      toast.error("Failed to load driver details");
    } finally {
      setLoading(false);
    }
  }, [params?.id, approvalKeys, reasonKeyOf]);

  useEffect(() => {
    getDriverDetails();
  }, [getDriverDetails]);

  // Show warning if status=approved but not all fields approved
  useEffect(() => {
    if (formData.profileStatus === "approved" && !allApproved) setShowWarning(true);
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
          if (rKey in next) {
            next[rKey] = checked ? "" : next[rKey] || DEFAULT_REASON;
          }
        });
        return next;
      });
    },
    [approvalKeys, reasonKeyOf]
  );

  // Toggle single field
  const handleToggleApproved = useCallback(
    (approvedKey, checked) => {
      setFormData((prev) => {
        const next = { ...prev, [approvedKey]: checked };
        const rKey = reasonKeyOf(approvedKey);
        if (rKey in next) {
          next[rKey] = checked ? "" : prev[rKey] || DEFAULT_REASON;
        }
        return next;
      });
    },
    [reasonKeyOf]
  );

  // Reason change
  const handleReasonChange = useCallback((reasonKey, value) => {
    setFormData((prev) => (prev[reasonKey] === value ? prev : { ...prev, [reasonKey]: value }));
  }, []);

  // Submit with final normalization to guarantee consistency on backend
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = normalizeAll({ ...formData, id: params?.id });
      const response = await updateDriverProfile(payload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message || "Driver approval updated successfully!");
        navigate("/driver-list");
      } else {
        toast.error(response?.data?.message || "Failed to update driver approval.");
      }
    } catch (e) {
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

  const handleBackClick = () => {
    // Compare current formData with details from API
    const hasChanges =
      JSON.stringify(formData) !==
      JSON.stringify({
        // Only include the fields that are editable
        isProfilePicApproved: details?.isProfilePicApproved ?? false,
        profilePicRejectReason: details?.profilePicRejectReason ?? DEFAULT_REASON,
        isDlFrontImageApproved: details?.isDlFrontImageApproved ?? false,
        dlFrontImageRejectReason: details?.dlFrontImageRejectReason ?? DEFAULT_REASON,
        isDlBackImageApproved: details?.isDlBackImageApproved ?? false,
        dlBackImageRejectReason: details?.dlBackImageRejectReason ?? DEFAULT_REASON,
        isFirstNameApproved: details?.isFirstNameApproved ?? false,
        firstNameRejectReason: details?.firstNameRejectReason ?? DEFAULT_REASON,
        isLastNameApproved: details?.isLastNameApproved ?? false,
        lastNameRejectReason: details?.lastNameRejectReason ?? DEFAULT_REASON,
        isEmailApproved: details?.isEmailApproved ?? false,
        emailRejectReason: details?.emailRejectReason ?? DEFAULT_REASON,
        isPhoneApproved: details?.isPhoneApproved ?? false,
        phoneRejectReason: details?.phoneRejectReason ?? DEFAULT_REASON,
        isAddressApproved: details?.isAddressApproved ?? false,
        addressRejectReason: details?.addressRejectReason ?? DEFAULT_REASON,
        isPincodeApproved: details?.isPincodeApproved ?? false,
        pincodeRejectReason: details?.pincodeRejectReason ?? DEFAULT_REASON,
        isIfscCodeApproved: details?.isIfscCodeApproved ?? false,
        ifscCodeRejectReason: details?.ifscCodeRejectReason ?? DEFAULT_REASON,
        isAccountNumberApproved: details?.isAccountNumberApproved ?? false,
        accountNumberRejectReason: details?.accountNumberRejectReason ?? DEFAULT_REASON,
        isAccountHolderNameApproved: details?.isAccountHolderNameApproved ?? false,
        accountHolderNameRejectReason: details?.accountHolderNameRejectReason ?? DEFAULT_REASON,
        isBankNameApproved: details?.isBankNameApproved ?? false,
        bankNameRejectReason: details?.bankNameRejectReason ?? DEFAULT_REASON,
        isBankBranchCodeApproved: details?.isBankBranchCodeApproved ?? false,
        bankBranchCodeRejectReason: details?.bankBranchCodeRejectReason ?? DEFAULT_REASON,
        isUpiIdApproved: details?.isUpiIdApproved ?? false,
        upiIdRejectReason: details?.upiIdRejectReason ?? DEFAULT_REASON,
        isPanNumberApproved: details?.isPanNumberApproved ?? false,
        panNumberRejectReason: details?.panNumberRejectReason ?? DEFAULT_REASON,
        isSignatureApproved: details?.isSignatureApproved ?? false,
        signatureRejectReason: details?.signatureRejectReason ?? DEFAULT_REASON,
        isAdharCardApproved: details?.isAdharCardApproved ?? false,
        adharCardRejectReason: details?.adharCardRejectReason ?? DEFAULT_REASON,
        isVehicleNumberApproved: details?.isVehicleNumberApproved ?? false,
        vehicleNumberRejectReason: details?.vehicleNumberRejectReason ?? DEFAULT_REASON,
        isVehicleTypeApproved: details?.isVehicleTypeApproved ?? false,
        vehicleTypeRejectReason: details?.vehicleTypeRejectReason ?? DEFAULT_REASON,
        isVehicleImageApproved: details?.isVehicleImageApproved ?? false,
        vehicleImageRejectReason: details?.vehicleImageRejectReason ?? DEFAULT_REASON,
        profileStatus: details?.profileStatus ?? "",
      });
  
    if (!hasChanges) {
      navigate("/driver-list");
    } else {
      setShowDialog(true);
    }
  };
  

  const handleDialogAction = (action) => {
    if (action === "save") {
      setShowDialog(false);
      handleSubmit();
    } else if (action === "dontSave") {
      setShowDialog(false);
      navigate("/driver-list");
    } else if (action === "cancel") {
      setShowDialog(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Delivery Boys" selectedItem="Manage Delivery Boys" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row mx-0 p-0" style={{ position: "relative", top: "-75px", marginBottom: "-75px" }}>
            <div className="mt-3">
              <div className="card-body px-2">
                <div className="d-flex">
                  <h4 className="p-2 text-dark shadow rounded mb-4" style={{ background: "#05E2B5" }}>
                    Approve Driver
                  </h4>
                </div>

                <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-light shadow-sm border rounded-pill px-4 py-2"
                  onClick={handleBackClick}
                  style={{ fontSize: "0.9rem", fontWeight: "500" }}
                >
                  ← Back
                </button>
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

                {/* Images */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#F6F0D6" }}>
                  <h3><u>Driver Documents</u></h3>
                  <div className="row">
                    <div className="col-4 mb-3">
                      <div className="d-flex justify-content-center">
                        <div>
                          {details?.profilePic && (
                            <img src={details.profilePic} style={{ height: 120, width: 120, borderRadius: "50%" }} alt="profile" />
                          )}
                          <div className="d-flex mb-2 mt-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isProfilePicApproved === true}
                              onChange={(e) => handleToggleApproved("isProfilePicApproved", e.target.checked)}
                            />
                            <label>Profile Pic</label>
                          </div>
                          {!formData.isProfilePicApproved && (
                            <input
                              className="form-control"
                              placeholder="Profile Pic reject reason"
                              value={formData.profilePicRejectReason}
                              onChange={(e) => handleReasonChange("profilePicRejectReason", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-4 mb-3">
                      <div className="d-flex justify-content-center">
                        <div>
                          {details?.dlFrontImage && (
                            <img src={details.dlFrontImage} style={{ height: 120, width: 120, borderRadius: "50%" }} alt="dl front" />
                          )}
                          <div className="d-flex mb-2 mt-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isDlFrontImageApproved === true}
                              onChange={(e) => handleToggleApproved("isDlFrontImageApproved", e.target.checked)}
                            />
                            <label>DL Front Image</label>
                          </div>
                          {!formData.isDlFrontImageApproved && (
                            <input
                              className="form-control"
                              placeholder="DL Front reject reason"
                              value={formData.dlFrontImageRejectReason}
                              onChange={(e) => handleReasonChange("dlFrontImageRejectReason", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-4 mb-3">
                      <div className="d-flex justify-content-center">
                        <div>
                          {details?.dlBackImage && (
                            <img src={details.dlBackImage} style={{ height: 120, width: 120, borderRadius: "50%" }} alt="dl back" />
                          )}
                          <div className="d-flex mb-2 mt-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isDlBackImageApproved === true}
                              onChange={(e) => handleToggleApproved("isDlBackImageApproved", e.target.checked)}
                            />
                            <label>DL Back Image</label>
                          </div>
                          {!formData.isDlBackImageApproved && (
                            <input
                              className="form-control"
                              placeholder="DL Back reject reason"
                              value={formData.dlBackImageRejectReason}
                              onChange={(e) => handleReasonChange("dlBackImageRejectReason", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#E6DFCF" }}>
                  <h3><u>Personal Info</u></h3>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isFirstNameApproved === true}
                        onChange={(e) => handleToggleApproved("isFirstNameApproved", e.target.checked)}
                      />
                      <label>First Name</label>
                      <input className="form-control" value={details?.firstName || ""} readOnly />
                      {!formData.isFirstNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.firstNameRejectReason}
                          onChange={(e) => handleReasonChange("firstNameRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isLastNameApproved === true}
                        onChange={(e) => handleToggleApproved("isLastNameApproved", e.target.checked)}
                      />
                      <label>Last Name</label>
                      <input className="form-control" value={details?.lastName || ""} readOnly />
                      {!formData.isLastNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.lastNameRejectReason}
                          onChange={(e) => handleReasonChange("lastNameRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isEmailApproved === true}
                        onChange={(e) => handleToggleApproved("isEmailApproved", e.target.checked)}
                      />
                      <label>Email</label>
                      <input className="form-control" value={details?.email || ""} readOnly />
                      {!formData.isEmailApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.emailRejectReason}
                          onChange={(e) => handleReasonChange("emailRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isPhoneApproved === true}
                        onChange={(e) => handleToggleApproved("isPhoneApproved", e.target.checked)}
                      />
                      <label>Phone</label>
                      <input className="form-control" value={details?.phone || ""} readOnly />
                      {!formData.isPhoneApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.phoneRejectReason}
                          onChange={(e) => handleReasonChange("phoneRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isPincodeApproved === true}
                        onChange={(e) => handleToggleApproved("isPincodeApproved", e.target.checked)}
                      />
                      <label>Pincode</label>
                      <input className="form-control" value={details?.pincode || ""} readOnly />
                      {!formData.isPincodeApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.pincodeRejectReason}
                          onChange={(e) => handleReasonChange("pincodeRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isAddressApproved === true}
                        onChange={(e) => handleToggleApproved("isAddressApproved", e.target.checked)}
                      />
                      <label>Address</label>
                      <input className="form-control" value={details?.address || ""} readOnly />
                      {!formData.isAddressApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.addressRejectReason}
                          onChange={(e) => handleReasonChange("addressRejectReason", e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#D1DBD5" }}>
                  <h3><u>Vehicle Details</u></h3>
                  <div className="row">
                    <div className="col-4 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isVehicleNumberApproved === true}
                        onChange={(e) => handleToggleApproved("isVehicleNumberApproved", e.target.checked)}
                      />
                      <label>Vehicle Number</label>
                      <input className="form-control" value={details?.vehicleNumber || ""} readOnly />
                      {!formData.isVehicleNumberApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.vehicleNumberRejectReason}
                          onChange={(e) => handleReasonChange("vehicleNumberRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-4 mb-3">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isVehicleTypeApproved === true}
                        onChange={(e) => handleToggleApproved("isVehicleTypeApproved", e.target.checked)}
                      />
                      <label>Vehicle Type</label>
                      <input className="form-control" value={details?.vehicleType || ""} readOnly />
                      {!formData.isVehicleTypeApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.vehicleTypeRejectReason}
                          onChange={(e) => handleReasonChange("vehicleTypeRejectReason", e.target.value)}
                        />
                      )}
                    </div>

                    <div className="col-4 mb-3">
                      <div className="d-flex justify-content-center">
                        <div>
                          {details?.vehicleImage && (
                            <img src={details.vehicleImage} style={{ height: 120, width: 120, borderRadius: "50%" }} alt="vehicle" />
                          )}
                          <div className="d-flex mb-2 mt-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isVehicleImageApproved === true}
                              onChange={(e) => handleToggleApproved("isVehicleImageApproved", e.target.checked)}
                            />
                            <label>Vehicle Image</label>
                          </div>
                          {!formData.isVehicleImageApproved && (
                            <input
                              className="form-control"
                              placeholder="Vehicle Image reject reason"
                              value={formData.vehicleImageRejectReason}
                              onChange={(e) => handleReasonChange("vehicleImageRejectReason", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank & KYC */}
                <div className="p-3 shadow rounded mb-3" style={{ background: "#E9ECEF" }}>
                  <h3><u>Bank & KYC</u></h3>
                  <div className="row">
                    <div className="col-4 mb-3">
                      <div className="d-flex justify-content-center">
                        <div>
                          {details?.signature && (
                            <img src={details.signature} style={{ height: 120, width: 120, borderRadius: "50%" }} alt="signature" />
                          )}
                          <div className="d-flex mb-2 mt-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isSignatureApproved === true}
                              onChange={(e) => handleToggleApproved("isSignatureApproved", e.target.checked)}
                            />
                            <label>Signature</label>
                          </div>
                          {!formData.isSignatureApproved && (
                            <input
                              className="form-control"
                              value={formData.signatureRejectReason}
                              onChange={(e) => handleReasonChange("signatureRejectReason", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-4 mb-3">
                      <div className="d-flex justify-content-center">
                        <div>
                          {details?.adharCard && (
                            <img src={details.adharCard} style={{ height: 120, width: 120, borderRadius: "50%" }} alt="adhar" />
                          )}
                          <div className="d-flex mb-2 mt-2">
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={formData.isAdharCardApproved === true}
                              onChange={(e) => handleToggleApproved("isAdharCardApproved", e.target.checked)}
                            />
                            <label>Adhar Card</label>
                          </div>
                          {!formData.isAdharCardApproved && (
                            <input
                              className="form-control"
                              value={formData.adharCardRejectReason}
                              onChange={(e) => handleReasonChange("adharCardRejectReason", e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 row">
                      <div className="col-6 mb-3">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isAccountNumberApproved === true}
                          onChange={(e) => handleToggleApproved("isAccountNumberApproved", e.target.checked)}
                        />
                        <label>Account Number</label>
                        <input className="form-control" value={details?.accountNumber || ""} readOnly />
                        {!formData.isAccountNumberApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.accountNumberRejectReason}
                            onChange={(e) => handleReasonChange("accountNumberRejectReason", e.target.value)}
                          />
                        )}
                      </div>

                      <div className="col-6 mb-3">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isIfscCodeApproved === true}
                          onChange={(e) => handleToggleApproved("isIfscCodeApproved", e.target.checked)}
                        />
                        <label>IFSC Code</label>
                        <input className="form-control" value={details?.ifscCode || ""} readOnly />
                        {!formData.isIfscCodeApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.ifscCodeRejectReason}
                            onChange={(e) => handleReasonChange("ifscCodeRejectReason", e.target.value)}
                          />
                        )}
                      </div>

                      <div className="col-6 mb-3">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isAccountHolderNameApproved === true}
                          onChange={(e) => handleToggleApproved("isAccountHolderNameApproved", e.target.checked)}
                        />
                        <label>Account Holder Name</label>
                        <input className="form-control" value={details?.accountHolderName || ""} readOnly />
                        {!formData.isAccountHolderNameApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.accountHolderNameRejectReason}
                            onChange={(e) => handleReasonChange("accountHolderNameRejectReason", e.target.value)}
                          />
                        )}
                      </div>

                      <div className="col-6 mb-3">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isBankNameApproved === true}
                          onChange={(e) => handleToggleApproved("isBankNameApproved", e.target.checked)}
                        />
                        <label>Bank Name</label>
                        <input className="form-control" value={details?.bankName || ""} readOnly />
                        {!formData.isBankNameApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.bankNameRejectReason}
                            onChange={(e) => handleReasonChange("bankNameRejectReason", e.target.value)}
                          />
                        )}
                      </div>

                      <div className="col-6 mb-3">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isBankBranchCodeApproved === true}
                          onChange={(e) => handleToggleApproved("isBankBranchCodeApproved", e.target.checked)}
                        />
                        <label>Bank Branch Code</label>
                        <input className="form-control" value={details?.bankBranchCode || ""} readOnly />
                        {!formData.isBankBranchCodeApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.bankBranchCodeRejectReason}
                            onChange={(e) => handleReasonChange("bankBranchCodeRejectReason", e.target.value)}
                          />
                        )}
                      </div>

                      <div className="col-6 mb-3">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isUpiIdApproved === true}
                          onChange={(e) => handleToggleApproved("isUpiIdApproved", e.target.checked)}
                        />
                        <label>UPI Id</label>
                        <input className="form-control" value={details?.upiId || ""} readOnly />
                        {!formData.isUpiIdApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.upiIdRejectReason}
                            onChange={(e) => handleReasonChange("upiIdRejectReason", e.target.value)}
                          />
                        )}
                      </div>

                      <div className="col-6 mb-3">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isPanNumberApproved === true}
                          onChange={(e) => handleToggleApproved("isPanNumberApproved", e.target.checked)}
                        />
                        <label>PAN Number</label>
                        <input className="form-control" value={details?.panNumber || ""} readOnly />
                        {!formData.isPanNumberApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.panNumberRejectReason}
                            onChange={(e) => handleReasonChange("panNumberRejectReason", e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="col-12">
                  <div className="shadow-sm p-3 mb-3">
                    <label>Driver Status</label>
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
                        Please select all driver fields to approve before submitting.
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
                    onClick={handleSubmit}
                    disabled={saving || !formData.profileStatus || (formData.profileStatus === "approved" && !allApproved)}
                  >
                    {saving ? "Submitting..." : "Submit Approval"}
                  </button>
                </div>
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
}

export default DriverApproval;
