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
    isIfscCodeApproved: "",
    profilePicRejectReason: "",
    dlFrontImageRejectReason: "",
    dlBackImageRejectReason: "",
    firstNameRejectReason: "",
    lastNameRejectReason: "",
    emailRejectReason: "",
    phoneRejectReason: "",
    addressRejectReason: "",
    pincodeRejectReason: "",
    ifscCodeRejectReason: "",
    upiIdRejectReason: "",
    isUpiIdApproved: "",
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
          ifscCodeRejectReason: response?.data?.data?.ifscCodeRejectReason,
          isIfscCodeApproved: response?.data?.data?.isIfscCodeApproved,
          accountNumberRejectReason:
            response?.data?.data?.accountNumberRejectReason,
          isAccountNumberApproved:
            response?.data?.data?.isAccountNumberApproved,
          isPanNumberApproved: response?.data?.data?.isPanNumberApproved,
          panNumberRejectReason: response?.data?.data?.panNumberRejectReason,
          isUpiIdApproved: response?.data?.data?.isUpiIdApproved,
          upiIdRejectReason: response?.data?.data?.upiIdRejectReason,
          isAccountHolderNameApproved:
            response?.data?.data?.isAccountHolderNameApproved,
          accountHolderNameRejectReason:
            response?.data?.data?.accountHolderNameRejectReason,
          isBankNameApproved: response?.data?.data?.isBankNameApproved,
          bankNameRejectReason: response?.data?.data?.bankNameRejectReason,
          isBankBranchCodeApproved:
            response?.data?.data?.isBankBranchCodeApproved,
          bankBranchCodeRejectReason:
            response?.data?.data?.bankBranchCodeRejectReason,
          isSignatureApproved: response?.data?.data?.isSignatureApproved,
          signatureRejectReason: response?.data?.data?.signatureRejectReason,
          isAdharCardApproved: response?.data?.data?.isAdharCardApproved,
          adharCardRejectReason: response?.data?.data?.adharCardRejectReason,
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
        signatureRejectReason: "",
        accountHolderNameRejectReason: "",
        ifscCodeRejectReason: "",
        accountNumberRejectReason: "",
        bankBranchCodeRejectReason: "",
        bankNameRejectReason: "",
        upiIdRejectReason: "",
        panNumberRejectReason: "",
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
                            profilePicRejectReason: e?.target.checked
                              ? ""
                              : "waiting for approval",
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
                            dlFrontImageRejectReason: e?.target.checked
                              ? ""
                              : "waiting for approval",
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
                            dlBackImageRejectReason: e?.target.checked
                              ? ""
                              : "waiting for approval",
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
                          firstNameRejectReason: e?.target.checked
                            ? ""
                            : "waiting for approval",
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
                          emailRejectReason: e?.target.checked
                            ? ""
                            : "waiting for approval",
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
                          phoneRejectReason: e?.target.checked
                            ? ""
                            : "waiting for approval",
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
                          pincodeRejectReason: e?.target.checked
                            ? ""
                            : "waiting for approval",
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
                          addressRejectReason: e?.target.checked
                            ? ""
                            : "waiting for approval",
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
                  {/* Profile Pic */}
                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <img
                          src={details?.signature}
                          style={{
                            height: "120px",
                            width: "120px",
                            borderRadius: "50%",
                          }}
                          alt="profile"
                        />
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isSignatureApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isSignatureApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Signature</label>
                        </div>
                        {!formData.isSignatureApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.signatureRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                signatureRejectReason: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="d-flex justify-content-center">
                      <div>
                        <img
                          src={details?.adharCard}
                          style={{
                            height: "120px",
                            width: "120px",
                            borderRadius: "50%",
                          }}
                          alt="profile"
                        />
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isAdharCardApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isAdharCardApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Adhar Card</label>
                        </div>
                        {!formData.isAdharCardApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.adharCardRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                adharCardRejectReason: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 row">
                    <div className="col-6">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isAccountNumberApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isAccountNumberApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Account Number</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.accountNumber}
                          readOnly
                        />
                        {!formData.isAccountNumberApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.accountNumberRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountNumberRejectReason: e.target.value,
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
                            checked={formData.isIfscCodeApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isIfscCodeApproved: e.target.checked,
                              })
                            }
                          />
                          <label>IFCS Code</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.ifscCode}
                          readOnly
                        />
                        {!formData.isIfscCodeApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.ifscCodeRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ifscCodeRejectReason: e.target.value,
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
                            checked={
                              formData.isAccountHolderNameApproved === true
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isAccountHolderNameApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Account Holder Name</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.accountHolderName}
                          readOnly
                        />
                        {!formData.isAccountHolderNameApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.accountNumberRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountHolderNameRejectReason: e.target.value,
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
                            checked={formData.isBankNameApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isBankNameApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Bank Name</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.bankName}
                          readOnly
                        />
                        {!formData.isBankNameApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.bankNameRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bankNameRejectReason: e.target.value,
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
                            checked={formData.isBankBranchCodeApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isBankBranchCodeApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Bank Branch Code</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.bankBranchCode}
                          readOnly
                        />
                        {!formData.isBankBranchCodeApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.bankBranchCodeRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bankBranchCodeRejectReason: e.target.value,
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
                            checked={formData.isUpiIdApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isUpiIdApproved: e.target.checked,
                              })
                            }
                          />
                          <label>UPI Id</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.upiId}
                          readOnly
                        />
                        {!formData.isUpiIdApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.upiIdRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                upiIdRejectReason: e.target.value,
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
                            checked={formData.isPanNumberApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isPanNumberApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Pan Number</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.panNumber}
                          readOnly
                        />
                        {!formData.isPanNumberApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.panNumberRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                panNumberRejectReason: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
  );
}

export default DriverApproval;
