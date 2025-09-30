import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import socket from "../../utils/socket";
import { getUserListServ, deleteUserServ } from "../../services/user.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import Pagination from "../../Components/Pagination";
function UserList() {
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
  const handleGetUserFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getUserListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total User",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active User",
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
    handleGetUserFunc();
  }, [payload]);
  useEffect(() => {
    socket.on("new-user-registered", (data) => {
      handleGetUserFunc();
    });
    socket.on("user-updated", (data) => {
      handleGetUserFunc();
    });

    return () => {
      socket.off("new-user-registered");
      socket.off("user-updated");
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

    if (profileStatus == "completed") {
      return (
        <div className="badge py-2" style={{ background: "#63ED7A" }}>
          Profile Completed
        </div>
      );
    }
  };
  const handleDeleteUserFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this User?"
    );
    if (confirmed) {
      try {
        let response = await deleteUserServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          handleGetUserFunc();
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="User Management" selectedItem="Users" />
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
            <div className="col-lg-5 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Users</h3>
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
                      <th className="text-center py-3">Profile Picture</th>
                      <th className="text-center py-3">First Name</th>
                      <th className="text-center py-3">Last Name</th>
                      <th className="text-center py-3">Email</th>
                      <th className="text-center py-3">Phone</th>
                      <th className="text-center py-3">Status</th>
                      <th
                        className="text-center py-3 "
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Action
                      </th>
                    </tr>
                    <div className="py-2"></div>
                    {showSkelton
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                          return (
                            <>
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
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })
                      : list?.map((v, i) => {
                          return (
                            <>
                              <tr key={v._id}>
                                <td className="text-center">
      {(payload.pageNo - 1) * payload.pageCount + i + 1}
    </td>
                                <td className="text-center">
                                  <img
                                    src={
                                      v?.profilePic
                                        ? v?.profilePic
                                        : "https://cdn-icons-png.flaticon.com/128/1077/1077114.png"
                                    }
                                    style={{ height: "30px" }}
                                  />
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.firstName || "N/A"}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.lastName || "N/A"}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.email || "N/A"}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.phone}
                                </td>
                                <td className="text-center">
                                  {renderStatus(v?.profileStatus)}
                                </td>

                                <td className="text-center">
                                  <BsTrash
                                    size={16}
                                    className="mx-1 text-danger"
                                    style={{ cursor: "pointer" }}
                                    title="Delete"
                                    onClick={() => handleDeleteUserFunc(v?._id)}
                                  />
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })}
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

export default UserList;
