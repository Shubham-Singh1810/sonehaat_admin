import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useNavigate } from "react-router-dom";
import { addVenderServ } from "../../services/vender.services";
import { toast } from "react-toastify";

const VendorAdd = () => {
  const navigate = useNavigate();

  // Text fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    storeName: "",
    storeUrl: "",
    gstNumber: "",
    storeDescription: "",
    state: "",
    district: "",
    pincode: "",
    storeAddress: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: "",
    bankBranchCode: "",
    upiId: "",
    panNumber: "",
    venderCommision: "",
  });

  // File fields: keep actual File objects
  const [files, setFiles] = useState({
    profilePic: null,
    storeLogo: null,
    // Note: backend uses 'bussinessLicense' spelling; keep input name aligned
    businessLicense: null,
    signature: null,
    passBook: null,
    adharCard: null,
  });

  // Optional image previews for UX
  const [previews, setPreviews] = useState({
    profilePic: "",
    storeLogo: "",
    businessLicense: "",
    signature: "",
    passBook: "",
    adharCard: "",
  });

  const [loader, setLoader] = useState(false);

  // Handle text changes
  const handleChange = (e) => {
    const { name, value, type, files: fl } = e.target;
    if (type === "file") {
      const file = fl && fl[0] ? fl[0] : null;
      setFiles((p) => ({ ...p, [name]: file }));
      setPreviews((p) => ({
        ...p,
        [name]: file ? URL.createObjectURL(file) : "",
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  // Compute validity for required fields and files
  const isValid = useMemo(() => {
    // Required text fields
    const requiredText = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "storeName",
      "storeUrl",
      "gstNumber",
      "state",
      "district",
      "accountNumber",
      "ifscCode",
      "accountHolderName",
      "bankName",
      "bankBranchCode",
      "upiId",
      "panNumber",
      "venderCommision",
    ];

    // All required text fields must be non-empty after trim
    const textOk = requiredText.every(
      (k) => String(formData[k] || "").trim().length > 0
    );

    // Required files: adjust naming to match backend multer fields
    // If backend expects 'bussinessLicense', send that key when appending
    const fileOk =
      !!files.profilePic &&
      !!files.storeLogo &&
      !!files.businessLicense && // maps to 'bussinessLicense' on backend
      !!files.signature &&
      !!files.passBook &&
      !!files.adharCard;

    // Optional pincode and storeDescription are not enforced here
    return textOk && fileOk && !loader;
  }, [formData, files, loader]);

  const handleVendorAdd = async () => {
    if (!isValid) return;
    setLoader(true);
    try {
      const fd = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([k, v]) => {
        fd.append(k, v ?? "");
      });

      // Append files; ensure backend field names match Multer fields
      if (files.profilePic) fd.append("profilePic", files.profilePic);
      if (files.storeLogo) fd.append("storeLogo", files.storeLogo);

      // Backend’s multer config uses { name: "bussinessLicense" }
      if (files.businessLicense)
        fd.append("bussinessLicense", files.businessLicense);

      if (files.signature) fd.append("signature", files.signature);
      if (files.passBook) fd.append("passBook", files.passBook);
      if (files.adharCard) fd.append("adharCard", files.adharCard);

      const response = await addVenderServ(fd);

      if (response?.data?.statusCode === 200) {
        toast.success("Vendor Added Successfully");
        navigate("/vendor-list");
      } else {
        toast.error(response?.data?.message || "Failed to add vendor");
      }
    } catch (error) {
      toast.error("Failed to add vendor");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Vendors" selectedItem="Manage Vendors" />
      <div className="mainContainer">
        <TopNav />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVendorAdd();
          }}
          encType="multipart/form-data"
        >
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
                    Add Vendor
                  </h4>
                </div>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-light shadow-sm border rounded-pill px-4 py-2"
                  onClick={() => navigate("/vendor-list")}
                  style={{ fontSize: "0.9rem", fontWeight: "500" }}
                >
                  ← Back
                </button>
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
                        {previews.profilePic && (
                          <img
                            src={previews.profilePic}
                            alt="preview"
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
                          onChange={handleChange}
                          required
                        />
                        <div className="d-flex mb-2">
                          <label>Profile Pic</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 row">
                    {/* First Name */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>First Name</label>
                        </div>
                        <input
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Last Name</label>
                        </div>
                        <input
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Email</label>
                        </div>
                        <input
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Phone</label>
                        </div>
                        <input
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
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
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {previews.storeLogo && (
                          <img
                            src={previews.storeLogo}
                            alt="preview"
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
                          onChange={handleChange}
                          required
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
                        {previews.businessLicense && (
                          <img
                            src={previews.businessLicense}
                            alt="preview"
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
                          name="businessLicense"
                          onChange={handleChange}
                          required
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
                          onChange={handleChange}
                          placeholder="Store Name"
                          required
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
                          onChange={handleChange}
                          placeholder="Store URL"
                          required
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
                          onChange={handleChange}
                          placeholder="GST Number"
                          required
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
                          onChange={handleChange}
                          placeholder="Store Description"
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
                            onChange={handleChange}
                            placeholder="State"
                            required
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
                            onChange={handleChange}
                            placeholder="District"
                            required
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
                            onChange={handleChange}
                            placeholder="Pincode"
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
                            onChange={handleChange}
                            placeholder="Store Address"
                          />
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
                        {previews.signature && (
                          <img
                            src={previews.signature}
                            alt="preview"
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
                          name="signature"
                          onChange={handleChange}
                          required
                        />
                        <div className="d-flex mb-2">
                          <label>Signature</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Passbook */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {previews.passBook && (
                          <img
                            src={previews.passBook}
                            alt="preview"
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
                          name="passBook"
                          onChange={handleChange}
                          required
                        />
                        <div className="d-flex mb-2">
                          <label>Passbook</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Aadhar */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        {previews.adharCard && (
                          <img
                            src={previews.adharCard}
                            alt="preview"
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
                          name="adharCard"
                          onChange={handleChange}
                          required
                        />
                        <div className="d-flex mb-2">
                          <label>Adhar Card</label>
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
                          onChange={handleChange}
                          placeholder="Account Number"
                          required
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
                          onChange={handleChange}
                          placeholder="IFSC Code"
                          required
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
                          onChange={handleChange}
                          placeholder="Account Holder Name"
                          required
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
                          onChange={handleChange}
                          placeholder="Bank Name"
                          required
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
                          onChange={handleChange}
                          placeholder="Bank Branch Code"
                          required
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
                          onChange={handleChange}
                          placeholder="UPI ID"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>Pan Number</label>
                        </div>
                        <input
                          className="form-control"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleChange}
                          placeholder="PAN Number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Details */}
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
                  <h5>Commission Details</h5>
                </div>

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
                        onChange={handleChange}
                        placeholder="Enter Commission"
                        min={0}
                        max={100}
                        step={0.01}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn-success"
                type="submit"
                style={{
                  color: "#fff",
                  border: "none",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                  boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                  width: "100%",
                  opacity: isValid ? 1 : 0.6,
                  cursor: isValid ? "pointer" : "not-allowed",
                }}
                disabled={!isValid || loader}
              >
                {loader ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorAdd;
