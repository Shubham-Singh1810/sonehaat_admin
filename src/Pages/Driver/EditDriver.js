import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDriverDetailsServ,
  updateDriverProfile,
} from "../../services/driver.service";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getOperationalCityServ } from "../../services/OperationalCity.service";

const initialState = {
  profilePic: "",
  dlFrontImage: "",
  dlBackImage: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  pincode: "",
  ifscCode: "",
  upiId: "",
  signature: "",
  adharCard: "",
  accountNumber: "",
  accountHolderName: "",
  bankName: "",
  bankBranchCode: "",
  panNumber: "",
  vehicleNumber: "",
  vehicleType: "",
  vehicleImage: "",
  operationalCity: "",
  lat: "",
  long: "",
  profileStatus: "",
};

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [files, setFiles] = useState({
    profilePic: null,
    dlFrontImage: null,
    dlBackImage: null,
    vehicleImage: null,
    signature: null,
    adharCard: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDriverDetailsServ(id);
        // Adjust path depending on your API: data.driverDetails or data.data.driverDetails
        const d =
          res?.data?.data?.driverDetails ||
          res?.data?.data ||
          res?.data?.driverDetails ||
          {};
        setFormData({
          profilePic: d.profilePic || "",
          dlFrontImage: d.dlFrontImage || "",
          dlBackImage: d.dlBackImage || "",
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          email: d.email || "",
          phone: d.phone?.toString?.() || "",
          address: d.address || "",
          pincode: d.pincode || "",
          ifscCode: d.ifscCode || "",
          upiId: d.upiId || "",
          signature: d.signature || "",
          adharCard: d.adharCard || "",
          accountNumber: d.accountNumber || "",
          accountHolderName: d.accountHolderName || "",
          bankName: d.bankName || "",
          bankBranchCode: d.bankBranchCode || "",
          panNumber: d.panNumber || "",
          vehicleNumber: d.vehicleNumber || "",
          vehicleType: d.vehicleType || "",
          vehicleImage: d.vehicleImage || "",
          operationalCity: d.operationalCity || "",
          lat: d.lat || "",
          long: d.long || "",
          profileStatus: d.profileStatus || "",
        });
      } catch (e) {
        toast.error("Failed to load driver");
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

  // Optional: require minimal fields to enable Save (align with schema’s required)
  const requiredText = ["phone", "address", "pincode"];
  const isValid = useMemo(() => {
    const textOk = requiredText.every(
      (k) => String(formData[k] || "").trim().length > 0
    );
    return textOk && !saving;
  }, [formData, saving]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("id", id);

      // Append text fields
      Object.entries(formData).forEach(([key, val]) => {
        // Skip file preview URL holders; real files appended below
        if (
          [
            "profilePic",
            "dlFrontImage",
            "dlBackImage",
            "vehicleImage",
            "signature",
            "adharCard",
          ].includes(key)
        )
          return;
        fd.append(key, val ?? "");
      });

      // Append only replaced files
      Object.entries(files).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      const res = await updateDriverProfile(fd);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Driver updated successfully");
        navigate("/driver-list");
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Failed to update driver");
    } finally {
      setSaving(false);
    }
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

  const Image = ({ src, alt }) =>
    src ? (
      <img
        src={src}
        alt={alt}
        style={{
          width: 120,
          height: 120,
          objectFit: "cover",
          borderRadius: 8,
          marginBottom: 8,
        }}
      />
    ) : null;

  const ImageSkeleton = () => (
    <Skeleton
      width={120}
      height={120}
      style={{ borderRadius: 8, marginBottom: 8 }}
    />
  );
  const InputSkeleton = () => (
    <div className="shadow-sm p-3 mb-3">
      <div className="d-flex mb-2">
        <Skeleton width={120} height={16} />
      </div>
      <Skeleton height={38} />
    </div>
  );

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getOperationalCityServ();
        if (res?.data?.statusCode === 200) {
          setCities(res.data.data || []);
        } else {
          toast.error("Failed to fetch operational cities");
        }
      } catch (err) {
        toast.error("Error fetching operational cities");
      }
    };
    fetchCities();
  }, []);

  if (loading) {
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
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <ImageSkeleton />
                        <Skeleton height={38} />
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
                    <Skeleton height={38} />
                  </div>
                  <div className="col-4">
                    <Skeleton height={38} />
                  </div>
                  <div className="col-4">
                    <Skeleton height={38} />
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
      <Sidebar
        selectedMenu="Delivery Boys"
        selectedItem="Manage Delivery Boys"
      />
      <div className="mainContainer">
        <TopNav />
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                    Edit Driver
                  </h4>
                </div>
              </div>

              {/* Identity & DL */}
              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title="Identity & License" />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Image src={formData.profilePic} alt="profile" />
                        <input
                          type="file"
                          name="profilePic"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div className="d-flex mb-2">
                          <label>Profile Pic</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Image src={formData.dlFrontImage} alt="dlFront" />
                        <input
                          type="file"
                          name="dlFrontImage"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div className="d-flex mb-2">
                          <label>DL Front Image</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Image src={formData.dlBackImage} alt="dlBack" />
                        <input
                          type="file"
                          name="dlBackImage"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div className="d-flex mb-2">
                          <label>DL Back Image</label>
                        </div>
                      </div>
                    </div>
                  </div>

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
                        type="text"
                        name="lastName"
                        className="form-control"
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
                        type="email"
                        name="email"
                        className="form-control"
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
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleTextChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address & City */}
              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title="Address" />
                <div className="row">
                  <div className="col-4">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <label>Pincode</label>
                      </div>
                      <input
                        type="text"
                        name="pincode"
                        className="form-control"
                        value={formData.pincode}
                        onChange={handleTextChange}
                      />
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <label>Address</label>
                      </div>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleTextChange}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <label>Operational City</label>
                      </div>
                      <select
                        name="operationalCity"
                        className="form-control"
                        value={formData.operationalCity}
                        onChange={handleTextChange}
                        disabled={cities.length === 0}
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
                </div>
              </div>

              {/* Vehicle */}
              <div className="px-3 py-1 mb-3 shadow border rounded">
                <SectionHeader title="Vehicle" />
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <Image src={formData.vehicleImage} alt="vehicle" />
                        <input
                          type="file"
                          name="vehicleImage"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div className="d-flex mb-2">
                          <label>Vehicle Image</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <label>Vehicle Type</label>
                      </div>
                      <input
                        type="text"
                        name="vehicleType"
                        className="form-control"
                        value={formData.vehicleType}
                        onChange={handleTextChange}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <label>Vehicle Number</label>
                      </div>
                      <input
                        type="text"
                        name="vehicleNumber"
                        className="form-control"
                        value={formData.vehicleNumber}
                        onChange={handleTextChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account */}
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
                          name="signature"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
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
                          name="adharCard"
                          className="form-control"
                          onChange={handleFileChange}
                          accept="image/*"
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
                          type="text"
                          name="accountNumber"
                          className="form-control"
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
                          type="text"
                          name="ifscCode"
                          className="form-control"
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
                          type="text"
                          name="accountHolderName"
                          className="form-control"
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
                          type="text"
                          name="bankName"
                          className="form-control"
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
                          type="text"
                          name="bankBranchCode"
                          className="form-control"
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
                          type="text"
                          name="upiId"
                          className="form-control"
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
                          type="text"
                          name="panNumber"
                          className="form-control"
                          value={formData.panNumber}
                          onChange={handleTextChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status (optional) */}
              {/* <div className="shadow-sm p-3 mb-3">
                <div className="d-flex mb-2"><label>Profile Status</label></div>
                <select
                  name="profileStatus"
                  className="form-control"
                  value={formData.profileStatus}
                  onChange={handleTextChange}
                >
                  <option value="">Select</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="reUploaded">Re-Uploaded</option>
                </select>
              </div> */}

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
                disabled={!isValid || saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
