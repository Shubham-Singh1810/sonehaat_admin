import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import {
  getVendorDetailsServ,
  updateVendorProfile,
} from "../../services/vender.services";
import { toast } from "react-toastify";

const VendorApproval = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [formData, setFormData] = useState({
    isProfilePicApproved: "",
    profilePicRejectReason: "",
    isFirstNameApproved: "",
    firstNameRejectReason: "",
    isLastNameApproved: "",
    lastNameRejectReason: "",
    isEmailApproved: "",
    emailRejectReason: "",
    isPhoneApproved: "",
    phoneRejectReason: "",
    isStoreLogoApproved: "",
    storeLogoRejectReason: "",
    isBusinessLicenseApproved: "",
    businessLicenseRejectReason: "",
    isStoreNameApproved: "",
    storeNameRejectReason: "",
    isStoreUrlApproved: "",
    storeUrlRejectReason: "",
    isGstNumberApproved: "",
    gstNumberRejectReason: "",
    isStoreDescriptionApproved: "",
    storeDescriptionRejectReason: "",
    isPincodeApproved: "",
    pincodeRejectReason: "",
    isStoreAddressApproved: "",
    storeAddressRejectReason: "",

    isSignatureApproved: "",
    signatureRejectReason: "",
    isPassBookApproved: "",
    passBookRejectReason: "",
    isAdharCardApproved: "",
    adharCardRejectReason: "",
    isAccountNumberApproved: "",
    accountNumberRejectReason: "",
    isIfscCodeApproved: "",
    ifscCodeRejectReason: "",
    isAccountHolderNameApproved: "",
    accountHolderNameRejectReason: "",
    isBankNameApproved: "",
    bankNameRejectReason: "",
    isBankBranchCodeApproved: "",
    bankBranchCodeRejectReason: "",
    isUpiIdApproved: "",
    upiIdRejectReason: "",
    isPanNumberApproved: "",
    panNumberRejectReason: "",
    profileStatus: "",
  });

  const getVendorDetailsFunc = async () => {
    try {
      const response = await getVendorDetailsServ(params.id);
      if (response?.data?.statusCode == "200") {
        const data = response.data.data?.venderDetails;
        setDetails(data);
        setFormData({
          isProfilePicApproved: data.isProfilePicApproved,
          profilePicRejectReason: data.profilePicRejectReason,

          isFirstNameApproved: data.isFirstNameApproved,
          firstNameRejectReason: data.firstNameRejectReason,

          isLastNameApproved: data.isLastNameApproved,
          lastNameRejectReason: data.lastNameRejectReason,

          isEmailApproved: data.isEmailApproved,
          emailRejectReason: data.emailRejectReason,

          isPhoneApproved: data.isPhoneApproved,
          phoneRejectReason: data.phoneRejectReason,

          isStoreLogoApproved: data.isStoreLogoApproved,
          storeLogoRejectReason: data.storeLogoRejectReason,

          isBusinessLicenseApproved: data.isBusinessLicenseApproved,
          businessLicenseRejectReason: data.businessLicenseRejectReason,

          isStoreNameApproved: data.isStoreNameApproved,
          storeNameRejectReason: data.storeNameRejectReason,

          isStoreUrlApproved: data.isStoreUrlApproved,
          storeUrlRejectReason: data.storeUrlRejectReason,

          isGstNumberApproved: data.isGstNumberApproved,
          gstNumberRejectReason: data.gstNumberRejectReason,

          isStoreDescriptionApproved: data.isStoreDescriptionApproved,
          storeDescriptionRejectReason: data.storeDescriptionRejectReason,

          isPincodeApproved: data.isPincodeApproved,
          pincodeRejectReason: data.pincodeRejectReason,

          isStoreAddressApproved: data.isStoreAddressApproved,
          storeAddressRejectReason: data.storeAddressRejectReason,

          isSignatureApproved: data.isSignatureApproved,
          signatureRejectReason: data.signatureRejectReason,

          isPassBookApproved: data.isPassBookApproved,
          passBookRejectReason: data.passBookRejectReason,

          isAdharCardApproved: data.isAdharCardApproved,
          adharCardRejectReason: data.adharCardRejectReason,

          isAccountNumberApproved: data.isAccountNumberApproved,
          accountNumberRejectReason: data.accountNumberRejectReason,

          isIfscCodeApproved: data.isIfscCodeApproved,
          ifscCodeRejectReason: data.ifscCodeRejectReason,

          isAccountHolderNameApproved: data.isAccountHolderNameApproved,
          accountHolderNameRejectReason: data.accountHolderNameRejectReason,

          isBankNameApproved: data.isBankNameApproved,
          bankNameRejectReason: data.bankNameRejectReason,

          isBankBranchCodeApproved: data.isBankBranchCodeApproved,
          bankBranchCodeRejectReason: data.bankBranchCodeRejectReason,

          isUpiIdApproved: data.isUpiIdApproved,
          upiIdRejectReason: data.upiIdRejectReason,

          isPanNumberApproved: data.isPanNumberApproved,
          panNumberRejectReason: data.panNumberRejectReason,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVendorDetailsFunc();
  }, [params?.id]);

  

  
  const updateFormData = () => {
    if (formData?.profileStatus == "approved") {
      setFormData({
        isProfilePicApproved: true,
        profilePicRejectReason: "",
        isFirstNameApproved: true,
        firstNameRejectReason: "",
        isLastNameApproved: true,
        lastNameRejectReason: "",
        isEmailApproved: true,
        emailRejectReason: "",
        isPhoneApproved: true,
        phoneRejectReason: "",

        isStoreLogoApproved: true,
        storeLogoRejectReason: "",
        isBusinessLicenseApproved: true,
        businessLicenseRejectReason: "",
        isStoreNameApproved: true,
        storeNameRejectReason: "",
        isStoreUrlApproved: true,
        storeUrlRejectReason: "",
        isGstNumberApproved: true,
        gstNumberRejectReason: "",
        isStoreDescriptionApproved: true,
        storeDescriptionRejectReason: "",
        isPincodeApproved: true,
        pincodeRejectReason: "",
        isStoreAddressApproved: true,
        storeAddressRejectReason: "",
        isStoreAddressApproved: true,
        storeAddressRejectReason: "",

        isSignatureApproved: true,
        signatureRejectReason: "",
        isPassBookApproved: true,
        passBookRejectReason: "",
        isAdharCardApproved: true,
        adharCardRejectReason: "",
        isAccountNumberApproved: true,
        accountNumberRejectReason: "",
        isIfscCodeApproved: true,
        ifscCodeRejectReason: "",
        isAccountHolderNameApproved: true,
        accountHolderNameRejectReason: "",
        isBankNameApproved: true,
        bankNameRejectReason: "",
        isBankBranchCodeApproved: true,
        bankBranchCodeRejectReason: "",
        isUpiIdApproved: true,
        upiIdRejectReason: "",
        isPanNumberApproved: true,
        panNumberRejectReason: "",

        profileStatus: "approved",
      });
    }
  };
  useEffect(() => {
    updateFormData();
  }, [formData?.profileStatus]);
  const [loader, setLoader]=useState(false)
  const handleProfileUpdate = async () => {
    setLoader(true)
    try {
      let response = await updateVendorProfile({ ...formData, id: params?.id });
      console.log(response?.data?.statusCode);
      if (response?.data?.statusCode == 200) {
        toast.success(response?.data?.message);
        navigate("/vendor-list");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false)
  };
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
                      <img
                        src={details?.profilePic}
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
                          checked={formData.isProfilePicApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isProfilePicApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Profile Pic</label>
                      </div>
                      {!formData.isProfilePicApproved && (
                        <input
                          className="form-control mt-2"
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
                            setFormData({
                              ...formData,
                              isFirstNameApproved: e.target.checked,
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

                  {/* Last Name */}
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
                </div>
              </div>
            </div>
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
                      <img
                        src={details?.storeLogo}
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
                          checked={formData.isStoreLogoApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isStoreLogoApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Store Logo</label>
                      </div>
                      {!formData.isStoreLogoApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.storeLogoRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              storeLogoRejectReason: e.target.value,
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
                        src={details?.bussinessLicense}
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
                          checked={formData.isBusinessLicenseApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isBusinessLicenseApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Business Licences</label>
                      </div>
                      {!formData.isBusinessLicenseApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.businessLicenseRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessLicenseRejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 row">
                  <div className="col-4">
                    <div className="shadow-sm p-3 mb-3">
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={formData.isStoreNameApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isStoreNameApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Store Name</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.storeName}
                        readOnly
                      />
                      {!formData.isStoreNameApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.storeNameRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              storeNameRejectReason: e.target.value,
                            })
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
                            setFormData({
                              ...formData,
                              isStoreUrlApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Store Url</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.storeUrl}
                        readOnly
                      />
                      {!formData.isStoreUrlApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.storeUrlRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              storeUrlRejectReason: e.target.value,
                            })
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
                            setFormData({
                              ...formData,
                              isGstNumberApproved: e.target.checked,
                            })
                          }
                        />
                        <label>GST Number</label>
                      </div>
                      <input
                        className="form-control"
                        value={details?.gstNumber}
                        readOnly
                      />
                      {!formData.isGstNumberApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.gstNumberRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gstNumberRejectReason: e.target.value,
                            })
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
                          checked={formData.isStoreDescriptionApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isStoreDescriptionApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Store Description</label>
                      </div>
                      <textarea
                        className="form-control"
                        value={details?.storeDescription}
                        readOnly
                      />
                      {!formData.isStoreDescriptionApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.storeDescriptionRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              storeDescriptionRejectReason: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-12 row  ">
                    <div className="col-4">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <label>State</label>
                        </div>
                        <input
                          className="form-control"
                          value={details?.state}
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
                          value={details?.district}
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
                              setFormData({
                                ...formData,
                                isPincodeApproved: e.target.checked,
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
                    <div className="col-12">
                      <div className="shadow-sm p-3 mb-3">
                        <div className="d-flex mb-2">
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={formData.isStoreAddressApproved === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isStoreAddressApproved: e.target.checked,
                              })
                            }
                          />
                          <label>Address</label>
                        </div>
                        <textarea
                          className="form-control"
                          value={details?.address}
                          readOnly
                        />
                        {!formData.isStoreAddressApproved && (
                          <input
                            className="form-control mt-2"
                            value={formData.storeAddressRejectReason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                storeAddressRejectReason: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                        src={details?.passBook}
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
                          checked={formData.isPassBookApproved === true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isPassBookApproved: e.target.checked,
                            })
                          }
                        />
                        <label>Passbook</label>
                      </div>
                      {!formData.isPassBookApproved && (
                        <input
                          className="form-control mt-2"
                          value={formData.passBookRejectReason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              passBookRejectReason: e.target.value,
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
                          value={formData.accountHolderNameRejectReason}
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
            {loader ?  <button
              className="btn-success"
              style={{
                borderRadius: "20px",
                width: "100%",
                opacity: "0.6",
              }}
             
            >
              Updating ..
            </button>: <button
              className="btn-success"
              style={{
                borderRadius: "20px",
                width: "100%",
                opacity: "0.6",
              }}
              onClick={() => handleProfileUpdate()}
            >
              Submit
            </button>}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorApproval;
