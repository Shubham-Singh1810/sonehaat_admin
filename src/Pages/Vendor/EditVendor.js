import React, { useEffect, useState } from "react";
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

const initialState = {
  profilePic: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  storeLogo: "",
  businessLicense: "",
  storeName: "",
  storeUrl: "",
  gstNumber: "",
  storeDescription: "",
  state: "",
  district: "",
  pincode: "",
  storeAddress: "",
  signature: "",
  passBook: "",
  adharCard: "",
  accountNumber: "",
  ifscCode: "",
  accountHolderName: "",
  bankName: "",
  bankBranchCode: "",
  upiId: "",
  panNumber: "",
  venderCommision: "",
};

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);

  const [formData, setFormData] = useState(initialState);

  const [files, setFiles] = useState({
    profilePic: null,
    storeLogo: null,
    businessLicense: null,
    signature: null,
    passBook: null,
    adharCard: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getVendorDetailsServ(id);
        const v = res?.data?.data?.venderDetails || {};
        setFormData({
          profilePic: v.profilePic || "",
          firstName: v.firstName || "",
          lastName: v.lastName || "",
          email: v.email || "",
          phone: v.phone?.toString?.() || "",
          storeLogo: v.storeLogo || "",
          businessLicense: v.bussinessLicense || "",
          storeName: v.storeName || "",
          storeUrl: v.storeUrl || "",
          gstNumber: v.gstNumber || "",
          storeDescription: v.storeDescription || "",
          state: v.state || "",
          district: v.district || "",
          pincode: v.pincode || "",
          storeAddress: v.address || "",
          signature: v.signature || "",
          passBook: v.passBook || "",
          adharCard: v.adharCard || "",
          accountNumber: v.accountNumber || "",
          ifscCode: v.ifscCode || "",
          accountHolderName: v.accountHolderName || "",
          bankName: v.bankName || "",
          bankBranchCode: v.bankBranchCode || "",
          upiId: v.upiId || "",
          panNumber: v.panNumber || "",
          venderCommision: v.venderCommision || "",
        });
      } catch (e) {
        toast.error("Failed to load vendor");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: fl } = e.target;
    const file = fl && fl[0] ? fl[0] : null;
    setFiles((p) => ({ ...p, [name]: file }));
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setFormData((p) => ({ ...p, [name]: localUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveVendor();
    navigate("/vendor-list");
  };

  const SectionHeader = ({ title }) => (
    <div className="d-flex align-items-center my-3">
      <i
        className="fa fa-circle text-secondary me-2"
        style={{ fontSize: "10px", position: "relative", top: "-3px" }}
      ></i>
      <h5>{title}</h5>
    </div>
  );

  const ImageSkeleton = ({ width = 120, height = 120 }) => (
    <Skeleton
      width={width}
      height={height}
      style={{ borderRadius: 8, marginBottom: 8 }}
    />
  );

  const InputSkeleton = () => (
    <div className="shadow-sm p-3 mb-3">
      <div className="d-flex mb-2">
        <Skeleton width={100} height={16} />
      </div>
      <Skeleton height={38} />
    </div>
  );

  const TextAreaSkeleton = () => (
    <div className="shadow-sm p-3 mb-3">
      <div className="d-flex mb-2">
        <Skeleton width={140} height={16} />
      </div>
      <Skeleton height={90} />
    </div>
  );

  const saveVendor = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("id", id);

      Object.entries(formData).forEach(([key, val]) => {
        if (
          [
            "profilePic",
            "storeLogo",
            "businessLicense",
            "signature",
            "passBook",
            "adharCard",
          ].includes(key)
        )
          return;
        fd.append(key, val ?? "");
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      const res = await updateVendorProfile(fd);
      if (res?.data?.statusCode === 200) {
        toast.success("Vendor updated successfully");
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Failed to update vendor");
    } finally {
      setSaving(false);
    }
  };

  const handleBackClick = () => {
    const isFormDirty = Object.values(formData).some(
      (val) => val && val !== "" && !(Array.isArray(val) && val.length === 0)
    );

    // if user has entered some info but not all required fields
    if (isFormDirty) {
      setShowDialog(true);
    } else {
      navigate(`/vendor-list`);
    }
  };

  const handleDialogAction = async (action) => {
    if (action === "save") {
      await saveVendor();
      setShowDialog(false);
      navigate(`/vendor-list`);
    } else if (action === "dontSave") {
      setShowDialog(false);
      navigate(`/vendor-list`);
    } else {
      // Cancel
      setShowDialog(false);
    }
  };

  if (loading) {
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
                borderRadius: "24px",
              }}
            >
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4
                    className="p-2 text-dark shadow rounded mb-4"
                    style={{ background: "#e6f2ff" }}
                  >
                    <Skeleton width={160} height={24} />
                  </h4>
                </div>
              </div>

              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title={<Skeleton width={150} />} />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <ImageSkeleton />
                        <Skeleton height={38} />
                        <div className="d-flex mb-2">
                          <Skeleton width={80} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 row">
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title={<Skeleton width={150} />} />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <ImageSkeleton />
                        <Skeleton height={38} />
                        <div className="d-flex mb-2">
                          <Skeleton width={90} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Skeleton height={38} />
                        <div className="d-flex mb-2">
                          <Skeleton width={140} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 row">
                    <div className="col-4">
                      <InputSkeleton />
                    </div>
                    <div className="col-4">
                      <InputSkeleton />
                    </div>
                    <div className="col-4">
                      <InputSkeleton />
                    </div>
                    <div className="col-12">
                      <TextAreaSkeleton />
                    </div>
                    <div className="col-12 row">
                      <div className="col-4">
                        <InputSkeleton />
                      </div>
                      <div className="col-4">
                        <InputSkeleton />
                      </div>
                      <div className="col-4">
                        <InputSkeleton />
                      </div>
                      <div className="col-12">
                        <TextAreaSkeleton />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title={<Skeleton width={150} />} />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Skeleton height={38} />
                        <div className="d-flex mb-2">
                          <Skeleton width={80} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Skeleton height={38} />
                        <div className="d-flex mb-2">
                          <Skeleton width={80} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Skeleton height={38} />
                        <div className="d-flex mb-2">
                          <Skeleton width={100} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 row">
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                    <div className="col-6">
                      <InputSkeleton />
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn-success"
                type="button"
                style={{ borderRadius: "24px", width: "100%", opacity: 0.6 }}
                disabled
              >
                <Skeleton height={40} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Vendors" selectedItem="Manage Vendors" />
      <div className="mainContainer">
        <TopNav />
        <form onSubmit={handleSubmit}>
          <div className="p-lg-4 p-md-3 p-2">
            <div
              className="mx-0 p-4 driverApprovalMain"
              style={{
                position: "relative",
                top: "-75px",
                marginBottom: "-75px",
                borderRadius: "24px",
              }}
            >
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4
                    className="p-2 text-dark shadow rounded mb-4"
                    style={{ background: "#e6f2ff" }}
                  >
                    Edit Vendor
                  </h4>
                </div>
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
              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title="Personal Details" />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {formData.profilePic && (
                          <img
                            src={formData.profilePic}
                            alt="profile"
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          />
                        )}
                        <input
                          type="file"
                          className="form-control"
                          name="profilePic"
                          onChange={handleFileChange}
                        />
                        <div className="d-flex mb-2">
                          <label>Profile Pic</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 row">
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>First Name</label>
                        </div>
                        <input
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Last Name</label>
                        </div>
                        <input
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Email</label>
                        </div>
                        <input
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Phone</label>
                        </div>
                        <input
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title="Store Details" />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {formData.storeLogo && (
                          <img
                            src={formData.storeLogo}
                            alt="logo"
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          />
                        )}
                        <input
                          type="file"
                          className="form-control"
                          name="storeLogo"
                          onChange={handleFileChange}
                        />
                        <div className="d-flex mb-2">
                          <label>Store Logo</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {formData.businessLicense && (
                          <a
                            href={formData.businessLicense}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View current license
                          </a>
                        )}
                        <input
                          type="file"
                          className="form-control"
                          name="businessLicense"
                          onChange={handleFileChange}
                        />
                        <div className="d-flex mb-2">
                          <label>Business License</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 row">
                    <div className="col-4">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Store Name</label>
                        </div>
                        <input
                          className="form-control"
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Store Url</label>
                        </div>
                        <input
                          className="form-control"
                          name="storeUrl"
                          value={formData.storeUrl}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>GST Number</label>
                        </div>
                        <input
                          className="form-control"
                          name="gstNumber"
                          value={formData.gstNumber}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Store Description</label>
                        </div>
                        <textarea
                          className="form-control"
                          name="storeDescription"
                          value={formData.storeDescription}
                          onChange={handleTextChange}
                        />
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
                            name="state"
                            value={formData.state}
                            onChange={handleTextChange}
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
                            name="district"
                            value={formData.district}
                            onChange={handleTextChange}
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>Pincode</label>
                          </div>
                          <input
                            className="form-control"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleTextChange}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>Address</label>
                          </div>
                          <textarea
                            className="form-control"
                            name="storeAddress"
                            value={formData.storeAddress}
                            onChange={handleTextChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title="Account Details" />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {formData.signature && (
                          <a
                            href={formData.signature}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View current signature
                          </a>
                        )}
                        <input
                          type="file"
                          className="form-control"
                          name="signature"
                          onChange={handleFileChange}
                        />
                        <div className="d-flex mb-2">
                          <label>Signature</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {formData.passBook && (
                          <a
                            href={formData.passBook}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View current passbook
                          </a>
                        )}
                        <input
                          type="file"
                          className="form-control"
                          name="passBook"
                          onChange={handleFileChange}
                        />
                        <div className="d-flex mb-2">
                          <label>Passbook</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {formData.adharCard && (
                          <a
                            href={formData.adharCard}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View current Aadhar
                          </a>
                        )}
                        <input
                          type="file"
                          className="form-control"
                          name="adharCard"
                          onChange={handleFileChange}
                        />
                        <div className="d-flex mb-2">
                          <label>Aadhar Card</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 row">
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Account Number</label>
                        </div>
                        <input
                          className="form-control"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>IFSC Code</label>
                        </div>
                        <input
                          className="form-control"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Account Holder Name</label>
                        </div>
                        <input
                          className="form-control"
                          name="accountHolderName"
                          value={formData.accountHolderName}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Bank Name</label>
                        </div>
                        <input
                          className="form-control"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Bank Branch Code</label>
                        </div>
                        <input
                          className="form-control"
                          name="bankBranchCode"
                          value={formData.bankBranchCode}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>UPI Id</label>
                        </div>
                        <input
                          className="form-control"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>PAN Number</label>
                        </div>
                        <input
                          className="form-control"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title="Commission Details" />
                <div className="row">
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <label>Vendor Commission (%)</label>
                      </div>
                      <input
                        className="form-control"
                        type="number"
                        name="venderCommision"
                        value={formData.venderCommision}
                        onChange={handleTextChange}
                        placeholder="Enter commission"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {saving ? (
                <button
                  className=""
                  type="submit"
                  style={{ borderRadius: "24px", width: "100%", opacity: 0.6 }}
                >
                  Saving...
                </button>
              ) : (
                <button
                  className=""
                  type="submit"
                  style={{
                    color: "#fff",
                    border: "none",
                    borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                    boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                    width: "100%",
                  }}
                >
                  Save Changes
                </button>
              )}
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
        </form>
      </div>
    </div>
  );
};

export default EditVendor;
