// src/pages/Driver/DriverAdd.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useNavigate } from "react-router-dom";
import { addDriverServ } from "../../services/driver.service";
import { toast } from "react-toastify";
import { getOperationalCityServ } from "../../services/OperationalCity.service";

function DriverAdd() {
  const navigate = useNavigate();

  // Text fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // required by schema
    address: "", // required by schema
    pincode: "", // required by schema
    ifscCode: "",
    upiId: "",
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    bankBranchCode: "",
    panNumber: "",
    vehicleType: "",
    vehicleNo: "", // UI field; will be mapped to vehicleNumber
    operationalCity: "", // optional, present in schema
  });

  // File fields
  const [files, setFiles] = useState({
    profilePic: null, // controller uploads this
    dlFrontImage: null, // required in schema
    dlBackImage: null, // optional in schema
    vehicleImage: null, // controller uploads this
    signature: null, // controller uploads this
    adharCard: null, // controller uploads this
  });

  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files: fl } = e.target;
    if (type === "file") {
      setFiles((prev) => ({
        ...prev,
        [name]: fl && fl.length > 0 ? fl[0] : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Required sets based on schema + controller usage
  const requiredText = [
    "phone",
    "address",
    "pincode",
    "vehicleType",
    "vehicleNo",
  ];
  const requiredFiles = [
    "profilePic",
    "dlFrontImage",
    "vehicleImage",
    "signature",
    "adharCard",
  ];

  const isValid = useMemo(() => {
    const textOk = requiredText.every(
      (k) => String(formData[k] || "").trim().length > 0
    );
    const fileOk = requiredFiles.every((k) => files[k] instanceof File);
    return textOk && fileOk && !loader;
  }, [formData, files, loader]);

  const buildFormData = () => {
    const fd = new FormData();

    // Text fields (include optional ones if provided)
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "pincode",
      "ifscCode",
      "upiId",
      "accountNumber",
      "accountHolderName",
      "bankName",
      "bankBranchCode",
      "panNumber",
      "vehicleType",
      "operationalCity",
    ].forEach((k) => {
      const v = formData[k];
      if (v !== undefined && v !== null && String(v).length) {
        fd.append(k, v);
      }
    });

    // UI vehicleNo -> API vehicleNumber
    if (formData.vehicleNo) {
      fd.append("vehicleNumber", formData.vehicleNo);
    }

    // Files: use exact field names expected by Multer/controller
    [
      "profilePic",
      "dlFrontImage",
      "dlBackImage",
      "vehicleImage",
      "signature",
      "adharCard",
    ].forEach((k) => {
      const f = files[k];
      if (f instanceof File) {
        fd.append(k, f, f.name);
      }
    });

    return fd;
  };

  const handleAddDriver = async () => {
    if (!isValid) return;
    setLoader(true);
    try {
      const fd = buildFormData();
      const response = await addDriverServ(fd);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message || "Driver created successfully");
        navigate("/driver-list");
      } else {
        toast.error(response?.data?.message || "Failed to create driver");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getOperationalCityServ();
        if (response?.data?.statusCode === 200) {
          setCities(response.data.data || []);
        } else {
          toast.error("Failed to fetch cities");
        }
      } catch (err) {
        toast.error("Error fetching cities");
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Delivery Boys"
        selectedItem="Manage Delivery Boys"
      />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className=" mx-0 p-4 driverApprovalMain"
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
                  Add Driver
                </h4>
              </div>
            </div>
            <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-light shadow-sm border rounded-pill px-4 py-2"
                  onClick={() => navigate("/driver-list")}
                  style={{ fontSize: "0.9rem", fontWeight: "500" }}
                >
                  ← Back
                </button>
              </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDriver();
              }}
              encType="multipart/form-data"
            >
              <div className="row">
                {/* Profile Pic (required) */}
                <div className="col-4">
                  <div className="d-flex justify-content-center">
                    <div>
                      <input
                        type="file"
                        name="profilePic"
                        className="form-control"
                        onChange={handleChange}
                        accept="image/*"
                        required
                      />
                      <div className="d-flex mb-2">
                        <label>Profile Pic</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DL Front Image (required) */}
                <div className="col-4">
                  <div className="d-flex justify-content-center">
                    <div>
                      <input
                        type="file"
                        name="dlFrontImage"
                        className="form-control"
                        onChange={handleChange}
                        accept="image/*"
                        required
                      />
                      <div className="d-flex mb-2">
                        <label>DL Front Image</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DL Back Image (optional) */}
                <div className="col-4">
                  <div className="d-flex justify-content-center">
                    <div>
                      <input
                        type="file"
                        name="dlBackImage"
                        className="form-control"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <div className="d-flex mb-2">
                        <label>DL Back Image</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* First Name */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>First Name</label>
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleChange}
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
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email (optional per schema) */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Email</label>
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Phone (required) */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Phone</label>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Pincode (required) */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Pincode</label>
                    </div>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Address (required) */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Address</label>
                    </div>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Vehicle Type (required by UI) */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Vehicle Type</label>
                    </div>
                    <input
                      type="text"
                      name="vehicleType"
                      className="form-control"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Vehicle No. (maps to vehicleNumber) */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Vehicle No.</label>
                    </div>
                    <input
                      type="text"
                      name="vehicleNo"
                      className="form-control"
                      value={formData.vehicleNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Vehicle Image (required by controller expectation) */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Vehicle Image</label>
                    </div>
                    <input
                      type="file"
                      name="vehicleImage"
                      className="form-control"
                      onChange={handleChange}
                      accept="image/*"
                      required
                    />
                  </div>
                </div>

                {/* Operational City */}
                <div className="col-6">
                  <div className="shadow-sm p-3 mb-3">
                    <div className="d-flex mb-2">
                      <label>Operational City</label>
                    </div>
                    <select
                      name="operationalCity"
                      className="form-control"
                      value={formData.operationalCity}
                      onChange={handleChange}
                      required
                      disabled={cities.length === 0} // disable while loading
                    >
                      <option value="">
                        {cities.length === 0
                          ? "Loading cities..."
                          : "Select city"}
                      </option>
                      {cities.map((city, idx) => (
                        <option key={idx} value={city.name || city}>
                          {city.name || city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Account Details */}
                <div className="px-3 py-1 mb-3 shadow border rounded mx-3">
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
                    {/* Signature (required by controller expectation) */}
                    <div className="col-4">
                      <div className="d-flex justify-content-center">
                        <div>
                          <input
                            type="file"
                            name="signature"
                            className="form-control"
                            onChange={handleChange}
                            accept="image/*"
                            required
                          />
                          <div className="d-flex mb-2">
                            <label>Signature</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aadhar Card (required by controller expectation) */}
                    <div className="col-4">
                      <div className="d-flex justify-content-center">
                        <div>
                          <input
                            type="file"
                            name="adharCard"
                            className="form-control"
                            onChange={handleChange}
                            accept="image/*"
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
                            type="text"
                            name="accountNumber"
                            className="form-control"
                            value={formData.accountNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>IFSC Code</label>
                          </div>
                          <input
                            type="text"
                            name="ifscCode"
                            className="form-control"
                            value={formData.ifscCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>Account Holder Name</label>
                          </div>
                          <input
                            type="text"
                            name="accountHolderName"
                            className="form-control"
                            value={formData.accountHolderName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>Bank Name</label>
                          </div>
                          <input
                            type="text"
                            name="bankName"
                            className="form-control"
                            value={formData.bankName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>Bank Branch Code</label>
                          </div>
                          <input
                            type="text"
                            name="bankBranchCode"
                            className="form-control"
                            value={formData.bankBranchCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>UPI Id</label>
                          </div>
                          <input
                            type="text"
                            name="upiId"
                            className="form-control"
                            value={formData.upiId}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="shadow-sm p-3 mb-3">
                          <div className="d-flex mb-2">
                            <label>PAN Number</label>
                          </div>
                          <input
                            type="text"
                            name="panNumber"
                            className="form-control"
                            value={formData.panNumber}
                            onChange={handleChange}
                          />
                        </div>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverAdd;
