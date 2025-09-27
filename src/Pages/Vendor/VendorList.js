import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getVenderListServ,
  deleteVendorServ,
} from "../../services/vender.services";
import Skeleton from "react-loading-skeleton";
import socket from "../../utils/socket";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";
import { BsEye, BsTrash, BsPencil } from "react-icons/bs";
import Pagination from "../../Components/Pagination";
function VendorList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetVenderFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getVenderListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Vendor",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Vendor",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Pending Profiles",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleGetVenderFunc();
  }, [payload]);
  useEffect(() => {
    // Event listener jab new user register hoga
    socket.on("new-vendor-registered", (data) => {
      handleGetVenderFunc(); // user list ko dubara fetch karo
    });
    socket.on("vendor-updated", (data) => {
      handleGetVenderFunc(); // user list ko dubara fetch karo
    });

    // Clean up karna jaruri hai warna multiple listener lag jayenge
    return () => {
      socket.off("new-vendor-registered");
      socket.off("vendor-updated");
    };
  }, []);
  const renderStatus = (profileStatus) => {
    if (profileStatus == "incompleted") {
      return (
        <div className="badge py-2" style={{ background: "#FFCA2C" }}>
          Profile Incompleted
        </div>
      );
    }
    if (profileStatus == "otpVerified") {
      return (
        <div className="badge py-2" style={{ background: "#365B3A" }}>
          OTP Verified
        </div>
      );
    }
    if (profileStatus == "storeDetailsCompleted") {
      return (
        <div className="badge py-2" style={{ background: "#23532A" }}>
          Store Details Added
        </div>
      );
    }
    if (profileStatus == "completed") {
      return (
        <div className="badge py-2" style={{ background: "#63ED7A" }}>
          Profile Completed
        </div>
      );
    }
    if (profileStatus == "approved") {
      return (
        <div className="badge py-2" style={{ background: "#157347" }}>
          Active
        </div>
      );
    }
    if (profileStatus == "rejected") {
      return (
        <div className="badge py-2" style={{ background: "#FF0000" }}>
          Rejected
        </div>
      );
    }
    if (profileStatus == "reUploaded") {
      return (
        <div className="badge py-2" style={{ background: "#6777EF" }}>
          Re Uploaded
        </div>
      );
    }
  };
  const handleDeleteVenderFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Vendor?"
    );
    if (confirmed) {
      try {
        let response = await deleteVendorServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          handleGetVenderFunc();
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Vendors" selectedItem="Manage Vendors" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          >
            {staticsArr?.map((v, i) => {
              return (
                <div className="col-md-4 col-12 ">
                  <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                    <div className="d-flex align-items-center ">
                      <div
                        className="p-2 shadow rounded"
                        style={{ background: v?.bgColor }}
                      >
                        <img src="https://cdn-icons-png.flaticon.com/128/666/666120.png" />
                      </div>
                      <div className="ms-3">
                        <h6>{v?.title}</h6>
                        <h2 className="text-secondary">{v?.count}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-2 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Vendors</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <div>
                <input
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) =>
                    setPayload({ ...payload, searchKey: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-lg-3 mb-2  col-md-6 col-12">
              <div>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="incompleted">Profile Incomplete</option>
                  <option value="otpVerified">OTP Verified</option>
                  <option value="storeDetailsCompleted">
                    Store Details Completed
                  </option>
                  <option value="completed">Profile Completed</option>
                  <option value="approved">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="reUploaded">Reuploaded</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <div>
                <button
                  className="btn btn-primary w-100"
                  style={{
                    color: "#fff",
                    border: "none",
                    // borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                    boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                  }}
                  onClick={() => navigate("/add-vendor")}
                >
                  Add Vendor
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <tbody>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "30px 0px 0px 30px" }}
                      >
                        Sr. No
                      </th>
                      <th className="text-center py-3">Vendor</th>
                      <th className="text-center py-3">Email</th>
                      <th className="text-center py-3">Phone</th>
                      <th className="text-center py-3">Status</th>
                      <th className="text-center py-3">Commission</th>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Action
                      </th>
                    </tr>

                    {showSkelton
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <Skeleton width={50} height={50} />
                            </td>
                            <td className="text-center">
                              <Skeleton
                                width={50}
                                height={50}
                                borderRadius={25}
                              />
                              <div className="mt-1">
                                <Skeleton width={80} height={20} />
                              </div>
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={25} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={25} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={25} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={25} />
                            </td>
                            <td className="text-center">
                              <Skeleton width={100} height={25} />
                            </td>
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <tr key={v?._id}>
                            <td className="text-center">{i + 1}</td>
                            <td className="text-center">
                              <img
                                src={v?.profilePic}
                                alt="profile"
                                style={{
                                  height: "50px",
                                  width: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2px solid #eee", // subtle border for better look
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)", // soft shadow
                                }}
                              />
                              <div
                                className="mt-1"
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#6c757d", // gray color
                                  fontWeight: "500",
                                  lineHeight: "1.2",
                                }}
                              >
                                {v?.firstName} {v?.lastName}
                              </div>
                            </td>

                            <td className="text-center">{v?.email}</td>
                            <td className="text-center">{v?.phone}</td>
                            <td className="text-center">
                              {renderStatus(v?.profileStatus)}
                            </td>
                            <td className="text-center">
                              {v?.venderCommision
                                ? `${v.venderCommision}%`
                                : "N/A"}
                            </td>

                            <td className="text-center">
                              <BsEye
                                size={16}
                                className="mx-1 text-info"
                                style={{ cursor: "pointer" }}
                                title="View"
                                onClick={() =>
                                  navigate(`/vendor-approval/${v?._id}`)
                                }
                              />
                              <BsPencil
                                size={14}
                                className="mx-1 text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate(`/edit-vendor/${v?._id}`)
                                }
                                title="Edit"
                              />
                              <BsTrash
                                size={16}
                                className="mx-1 text-danger"
                                style={{ cursor: "pointer" }}
                                title="Delete"
                                onClick={() => handleDeleteVenderFunc(v?._id)}
                              />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                {list.length == 0 && !showSkelton && <NoRecordFound />}
                {statics?.totalCount > 0 && (
                  <div className="d-flex justify-content-center my-3">
                    <Pagination
                      payload={payload}
                      setPayload={setPayload}
                      totalCount={statics?.totalCount || 0}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorList;
