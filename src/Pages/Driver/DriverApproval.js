import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDriverDetailsServ,
  updateDriverProfile,
} from "../../services/driver.service";
import { toast } from "react-toastify";

function DriverApproval() {
  const [details, setDetails] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    isProfilePicApproved: "",
    isDlFrontImageApproved: "",
    isDlBackImageApproved: "",
    isFirstNameApproved: "",
    isLastNameApproved: "",
    isEmailApproved: "",
    isPhoneApproved: "",
    isAddressApproved: "",
    isPincodeApproved: "",
    profileStatus: "",
    profilePicRejectReason: "",
    dlFrontImageRejectReason: "",
    dlBackImageRejectReason: "",
    firstNameRejectReason: "",
    lastNameRejectReason: "",
    emailRejectReason: "",
    phoneRejectReason: "",
    addressRejectReason: "",
    pincodeRejectReason: "",
  });

  const getDriverDetailsFunc = async () => {
    try {
      let response = await getDriverDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        setFormData({
          isProfilePicApproved: response?.data?.data?.isProfilePicApproved,
          isDlFrontImageApproved: response?.data?.data?.isDlFrontImageApproved,
          isDlBackImageApproved: response?.data?.data?.isDlBackImageApproved,
          isFirstNameApproved: response?.data?.data?.isFirstNameApproved,
          isLastNameApproved: response?.data?.data?.isLastNameApproved,
          isEmailApproved: response?.data?.data?.isEmailApproved,
          isPhoneApproved: response?.data?.data?.isPhoneApproved,
          isAddressApproved: response?.data?.data?.isAddressApproved,
          isPincodeApproved: response?.data?.data?.isPincodeApproved,
          profileStatus: response?.data?.data?.profileStatus,
          profilePicRejectReason: response?.data?.data?.profilePicRejectReason,
          dlFrontImageRejectReason:
            response?.data?.data?.dlFrontImageRejectReason,
            dlBackImageRejectReason:
            response?.data?.data?.dlBackImageRejectReason,
          firstNameRejectReason: response?.data?.data?.firstNameRejectReason,
          lastNameRejectReason: response?.data?.data?.lastNameRejectReason,
          emailRejectReason: response?.data?.data?.emailRejectReason,
          phoneRejectReason: response?.data?.data?.phoneRejectReason,
          addressRejectReason: response?.data?.data?.addressRejectReason,
          pincodeRejectReason: response?.data?.data?.pincodeRejectReason,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDriverDetailsFunc();
  }, [params?.id]);
  const [loader, setLoader] = useState(false);
  const handleProfileUpdate = async () => {
    setLoader(true);
    try {
      let response = await updateDriverProfile({ ...formData, id: params?.id });
      console.log(response?.data?.statusCode);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/driver-list");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false);
  };
  const updateFormData = () => {
    if (formData?.profileStatus == "approved") {
      setFormData({
        isProfilePicApproved: true,
        isDlFrontImageApproved: true,
        isDlBackImageApproved: true,
        isFirstNameApproved: true,
        isLastNameApproved: true,
        isEmailApproved: true,
        isPhoneApproved: true,
        isAddressApproved: true,
        isPincodeApproved: true,
        profilePicRejectReason: "",
        dlFrontImageRejectReason: "",
        dlBackImageRejectReason: "",
        firstNameRejectReason: "",
        lastNameRejectReason: "",
        emailRejectReason: "",
        phoneRejectReason: "",
        addressRejectReason: "",
        pincodeRejectReason: "",
        profileStatus: "approved",
      });
    }
  };
  useEffect(() => {
    updateFormData();
  }, [formData?.profileStatus]);
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
              background: "white",
              borderRadius: "24px",
            }}
          >
            <h3 className="text-secondary mb-4">Driver Approval</h3>
            <div className="row">
              {/* Profile Pic */}
              <div className="col-4">
                <div className="d-flex justify-content-center">
                  <div>
                    <img
                      src={details?.profilePic}
                      style={{
                        height: "120px",
                        width: "120px",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="d-flex mb-2">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isProfilePicApproved === true}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isProfilePicApproved: e.target.checked,
                            profilePicRejectReason : e?.target.checked ? "" : "waiting for approval"
                          })
                        }
                      />
                      <label>Profile Pic</label>
                    </div>
                    {!formData?.isProfilePicApproved && (
                      <input
                        className="form-control mt-2"
                        placeholder="Profile Pic reject reason"
                        value={formData.profilePicRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profilePicRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* DL Front Image */}
              <div className="col-4">
                <div className="d-flex justify-content-center">
                  <div>
                    <img
                      src={details?.dlFrontImage}
                      style={{
                        height: "120px",
                        width: "120px",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="d-flex mb-2">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isDlFrontImageApproved === true}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isDlFrontImageApproved: e.target.checked,
                            dlFrontImageRejectReason : e?.target.checked ? "" : "waiting for approval"
                          })
                        }
                      />
                      <label>DL Front Image</label>
                    </div>
                    {!formData?.isDlFrontImageApproved && (
                      <input
                        className="form-control mt-2"
                        placeholder="DL Front reject reason"
                        value={formData.dlFrontImageRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dlFrontImageRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* DL Back Image */}
              <div className="col-4">
                <div className="d-flex justify-content-center">
                  <div>
                    <img
                      src={details?.dlBackImage}
                      style={{
                        height: "120px",
                        width: "120px",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="d-flex mb-2">
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={formData.isDlBackImageApproved === true}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isDlBackImageApproved: e.target.checked,
                            dlBackImageRejectReason : e?.target.checked ? "" : "waiting for approval"
                          })
                        }
                      />
                      <label>DL Back Image</label>
                    </div>
                    {!formData?.isDlBackImageApproved && (
                      <input
                        className="form-control mt-2"
                        placeholder="DL Back reject reason"
                        value={formData.dlBackImageRejectReason}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dlBackImageRejectReason: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isFirstNameApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isFirstNameApproved: e.target.checked,
                              firstNameRejectReason : e?.target.checked ? "" : "waiting for approval"
                            })
                          }
                        />
                        <label>First Name</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.firstName}
                        readOnly
                      />
                      {!formData.isFirstNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.firstNameRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstNameRejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isLastNameApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isLastNameApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Last Name</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.lastName}
                        readOnly
                      />
                      {!formData.isLastNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.lastNameRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastNameRejectReason: e.target.value,
                            })
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
                            setFormData({
                              ...formData,
                              isEmailApproved: e.target.checked,
                              emailRejectReason : e?.target.checked ? "" : "waiting for approval"
                            })
                          }
                        />
                        <label>Email</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.email}
                        readOnly
                      />
                      {!formData.isEmailApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.emailRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emailRejectReason: e.target.value,
                            })
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
                            setFormData({
                              ...formData,
                              isPhoneApproved: e.target.checked,
                              phoneRejectReason : e?.target.checked ? "" : "waiting for approval"
                            })
                          }
                        />
                        <label>Phone</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.phone}
                        readOnly
                      />
                      {!formData.isPhoneApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.phoneRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneRejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isPincodeApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isPincodeApproved: e.target.checked,
                              pincodeRejectReason : e?.target.checked ? "" : "waiting for approval"
                            })
                          }
                        />
                        <label>Pincode</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.pincode}
                        readOnly
                      />
                      {!formData.isPincodeApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.pincodeRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pincodeRejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isAddressApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isAddressApproved: e.target.checked,
                              addressRejectReason : e?.target.checked ? "" : "waiting for approval"
                            })
                          }
                        />
                        <label>Address</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.address}
                        readOnly
                      />
                      {!formData.isAddressApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.addressRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              addressRejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>

              {/* Profile Status Dropdown */}
              <div className="col-12">
                <div className="shadow-sm p-3 mb-3">
                  <div className="d-flex mb-2">
                    <label>Profile Staus</label>
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

              <div className="d-flex justify-content-center mx-3 my-2">
                {loader ? (
                  <button
                    className="btn-success"
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      opacity: "0.6",
                    }}
                  >
                    Updating ..
                  </button>
                ) : (
                  <button
                    className="btn-success"
                    style={{
                      borderRadius: "20px",
                      width: "100%",
                      opacity: "0.6",
                    }}
                    onClick={() => handleProfileUpdate()}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverApproval;
