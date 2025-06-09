import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getDriverListServ,
  deleteDriverServ,
} from "../../services/driver.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";
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
      "Are you sure you want to delete this category?"
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
                  className="form-control borderRadius24"
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
                  className="form-control borderRadius24"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="approved">Active</option>
                  <option value="incompleted">Profile Incomplete</option>
                  <option value="completed">Profile Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="reUploaded">Reuploaded</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <div>
                <button
                  className="btn btn-primary w-100 borderRadius24"
                  style={{ background: "#6777EF" }}
                  onClick={()=>alert("Work in progress")}
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
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">
                                  <img
                                    src={v?.profilePic}
                                    style={{
                                      height: "30px",
                                      width: "30px",
                                      borderRadius: "50%",
                                    }}
                                    className="border"
                                  />
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.firstName}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.lastName}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.email}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {"+" + v?.countryCode + " " + v?.phone}
                                </td>
                                <td className="text-center">
                                  {renderStatus(v?.profileStatus)}
                                </td>

                                <td className="text-center">
                                  <a
                                    onClick={() => {
                                      navigate(`/driver-approval/${v?._id}`);
                                    }}
                                    className="btn btn-info mx-2 text-light shadow-sm"
                                  >
                                    View
                                  </a>
                                  <a
                                    className="btn btn-warning mx-2 text-light shadow-sm"
                                    onClick={() => deleteDriverFunc(v?._id)}
                                  >
                                    Delete
                                  </a>
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })}
                  </tbody>
                </table>
                {list.length == 0 && !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverList;
