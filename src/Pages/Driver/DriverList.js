import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getDriverListServ,
  deleteDriverServ,
} from "../../services/driver.service";
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
function DriverList() {
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
  const handleGetDriverFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getDriverListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Driver",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Driver",
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
    handleGetDriverFunc();
  }, [payload]);
  useEffect(() => {
    // Event listener jab new user register hoga
    socket.on("new-driver-registered", (data) => {
      handleGetDriverFunc(); // user list ko dubara fetch karo
    });
    socket.on("driver-updated", (data) => {
      handleGetDriverFunc(); // user list ko dubara fetch karo
    });

    // Clean up karna jaruri hai warna multiple listener lag jayenge
    return () => {
      socket.off("new-driver-registered");
      socket.off("driver-updated");
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);

  const renderStatus = (profileStatus) => {
    if (profileStatus == "incompleted") {
      return (
        <div className="badge py-2" style={{ background: "#FFCA2C" }}>
          Profile Incompleted
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
    if (profileStatus == "accountDetailsCompleted") {
      return (
        <div className="badge py-2" style={{ background: "#63ED7A" }}>
          Account Details Stored
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
  const deleteDriverFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this driver?"
    );
    if (confirmed) {
      try {
        let response = await deleteDriverServ(id);
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          handleGetDriverFunc();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
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
              <h3 className="mb-0 text-bold text-secondary">Drivers</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <div>
                <input
                  className="form-control "
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
                  className="form-control "
                  onChange={(e) =>
                    setPayload({ ...payload, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="approved">Active</option>
                  <option value="incompleted">Profile Incomplete</option>
                  <option value="completed">Profile Completed</option>
                  <option value="accountDetailsCompleted">
                    Account Details Uploaded
                  </option>
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
                  onClick={() => navigate("/add-driver")}
                >
                  Add Driver
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
                      <th className="text-center py-3">Profile</th>
                      <th className="text-center py-3">Email</th>
                      <th className="text-center py-3">Phone</th>
                      <th className="text-center py-3">Operational City</th>
                      <th className="text-center py-3">Status</th>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Action
                      </th>
                    </tr>

                    {showSkelton
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => (
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
                              <Skeleton
                                width={80}
                                height={15}
                                style={{ marginTop: 4 }}
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
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <tr key={v._id}>
                            <td className="text-center">
      {(payload.pageNo - 1) * payload.pageCount + i + 1}
    </td>
                            <td className="text-center">
                              <img
                                src={v?.profilePic}
                                alt="profile"
                                style={{
                                  height: "50px",
                                  width: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2px solid #eee",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                  display: "block",
                                  margin: "0 auto",
                                }}
                              />
                              <div
                                style={{
                                  fontSize: "0.8rem",
                                  color: "#6c757d",
                                  fontWeight: 500,
                                  marginTop: 4,
                                  lineHeight: 1.2,
                                }}
                              >
                                {v?.firstName} {v?.lastName}
                              </div>
                            </td>
                            <td className="text-center">{v?.email}</td>
                            <td className="text-center">
                              {v?.countryCode ? `+${v.countryCode} ` : ""}
                              {v?.phone}
                            </td>
                            <td className="text-center">
                              {v?.operationalCity || "N/A"}
                            </td>
                            <td className="text-center">
                              {renderStatus(v?.profileStatus)}
                            </td>
                            <td className="text-center">
                              <BsEye
                                size={16}
                                className="mx-1 text-info"
                                style={{ cursor: "pointer" }}
                                title="View"
                                onClick={() =>
                                  navigate(`/driver-approval/${v?._id}`)
                                }
                              />
                              <BsPencil
                                size={16}
                                className="mx-1 text-primary"
                                style={{ cursor: "pointer" }}
                                title="Edit"
                                onClick={() =>
                                  navigate(`/edit-driver/${v?._id}`)
                                }
                              />
                              <BsTrash
                                size={16}
                                className="mx-1 text-danger"
                                style={{ cursor: "pointer" }}
                                title="Delete"
                                onClick={() => deleteDriverFunc(v?._id)}
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

export default DriverList;
