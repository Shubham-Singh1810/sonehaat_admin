import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getAdminDetailsServ,
  getWithdrawListServ,
  updateWithdrawRequestServ,
} from "../../services/adminFund.services";
import { getDriverDetailsServ } from "../../services/driver.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination";
function DriverWithdrawList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 100,
    userType: "Driver",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const [details, setDetails] = useState(null);
  const handleAdminFundDetails = async () => {
    try {
      let response = await getAdminDetailsServ(payload);
      setDetails(response?.data?.data);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Requests",
      count: statics?.totalDriverRequestCount,
      bgColor: "#6777EF",
    },
    {
      title: "Completed Requests",
      count: statics?.completedDriverRequestCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Cancelled Requests",
      count: statics?.cancelledDriverRequestCount,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleAdminFundDetails();
  }, []);
  const getWithdrawListFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getWithdrawListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setStatics(response?.data?.documentCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getWithdrawListFunc();
  }, [payload]);
  const [editFormData, setEditFormData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const handleWithdrawFunc = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
    formData.append("status", editFormData.status);
    formData.append("rejectReason", editFormData.rejectReason || "");
    if (editFormData.image) {
      formData.append("image", editFormData.image);
    }
    formData.append("_id", editFormData._id);
      let response = await updateWithdrawRequestServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };
  const [venderDetails, setVenderDetails] = useState();
  const driverDetailsFunc = async (id) => {
    try {
      let response = await getDriverDetailsServ(id);
      if (response?.data?.statusCode == "200") {
        setVenderDetails(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Fund Management"
        selectedItem="Driver Withdraw Request"
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
            <div className="col-lg-4 mb-2 col-md-12 col-12 d-flex">
              <div>
                {" "}
                <h3
                  className="mb-0 text-bold  text-light bg-secondary p-2 px-3"
                  style={{ borderRadius: "30px" }}
                >
                  Admin Wallet :{" "}
                  <b>{details?.details?.wallet.toFixed(2)} &#8377;</b>
                </h3>
              </div>
            </div>
            <div className="col-lg-4 mb-2  col-md-6 col-12">
              <div>
                <input
                  placeholder="Search"
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, searchKey: e?.target?.value })
                  }
                />
              </div>
            </div>
            <div className="col-lg-4 mb-2  col-md-6 col-12">
              <div>
                <select
                  className="form-control"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
                      <th className="text-center py-3">Vendor Details</th>
                      <th className="text-center py-3">Message</th>
                      <th className="text-center py-3">Amount</th>
                      <th className="text-center py-3">Date</th>

                      <th
                        className="text-center py-3 "
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Update Status
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
                                <td className="d-flex justify-content-center">
                                  <div
                                    className="border p-2 px-4 d-flex align-items-center bg-light rounded"
                                    style={{ width: "220px" }}
                                  >
                                    <img
                                      src={
                                        v?.userDetails?.profilePic
                                          ? v?.userDetails?.profilePic
                                          : "https://cdn-icons-png.flaticon.com/128/456/456212.png"
                                      }
                                      style={{
                                        height: "35px",
                                        width: "35px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                    <div className="ms-2">
                                      <p className="mb-0">
                                        {v?.userDetails?.firstName +
                                          " " +
                                          v?.userDetails?.lastName}
                                      </p>
                                      <p className="mb-0">
                                        <i className="fa fa-phone" />{" "}
                                        {v?.userDetails?.phone}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className="text-center"
                                  style={{ width: "220px" }}
                                >
                                  {v?.message}
                                </td>
                                <td className="text-center text-bold text-danger">
                                  {v?.amount.toFixed(2)} &#8377;
                                </td>
                                <td className="text-center">
                                  {moment(
                                    v?.createdAt,
                                    "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD MMM YYYY, hh:mm A")}
                                </td>

                                <td
                                  className="text-center"
                                  style={{ verticalAlign: "center" }}
                                >
                                  <select
                                    className="form-control"
                                    value={v?.status}
                                    onChange={(e) => {
                                      setEditFormData({
                                        _id: v?._id,
                                        status: e?.target?.value,
                                        message: v?.message,
                                        imgPrev: v?.image,
                                        rejectReason: v?.rejectReason,
                                      });
                                      driverDetailsFunc(v?.userId);
                                    }}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Done</option>
                                    <option value="cancelled">Rejected</option>
                                  </select>
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })}
                  </tbody>
                </table>
                {details?.details?.transactionHistory?.length == 0 &&
                  !showSkelton && <NoRecordFound />}
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
      {editFormData?._id && (
        <div
          className="modal fade show d-flex align-items-center  justify-content-center "
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "364px",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px" }}
                  onClick={() => {
                    setEditFormData(null);
                  }}
                />
              </div>

              <div className="modal-body">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <h5 className="mb-4">Withdraw Request Update</h5>
                    <div className="border p-2 rounded mb-2">
                      <div className="border p-2 px-4 mb-2 d-flex align-items-center bg-light rounded">
                        <img
                          src={
                            venderDetails?.profilePic
                              ? venderDetails?.profilePic
                              : "https://cdn-icons-png.flaticon.com/128/456/456212.png"
                          }
                          style={{
                            height: "45px",
                            width: "45px",
                            borderRadius: "50%",
                          }}
                        />
                        <div className="ms-2">
                          <p className="mb-0">
                            {venderDetails?.firstName +
                              " " +
                              venderDetails?.lastName}
                          </p>
                          <p className="mb-0">
                            <i className="fa fa-phone" /> {venderDetails?.phone}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h6>Account Details</h6>
                        <p className="mb-0">
                          Account Number:{" "}
                          <i className="text-secondary">
                            {venderDetails?.accountNumber}
                          </i>
                        </p>
                        <p className="mb-0">
                          IFSE:{" "}
                          <i className="text-secondary">
                            {venderDetails?.ifscCode}
                          </i>
                        </p>
                        <p className="mb-0">
                          Account Holder Name:{" "}
                          <i className="text-secondary">
                            {venderDetails?.accountHolderName}
                          </i>
                        </p>
                        <p className="mb-0">
                          UPI ID:{" "}
                          <i className="text-secondary">
                            {venderDetails?.upiId}
                          </i>
                        </p>
                      </div>
                      <p className="mb-0">
                        Message:{" "}
                        <i className="text-secondary">
                          {editFormData?.rejectReason}
                        </i>
                      </p>
                    </div>
                    <label>Update Status</label>
                    <select
                      value={editFormData?.status}
                      className="form-control mb-3"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Mark Done</option>
                      <option value="cancelled">Reject</option>
                    </select>
                    {editFormData?.status == "completed" && (
                      <>
                        {editFormData?.imgPrev && (
                          <div className="p-3 border rounded mb-2">
                            <img
                              src={editFormData?.imgPrev}
                              className="img-fluid w-100 shadow rounded"
                            />
                          </div>
                        )}

                        <label className="">Upload Image</label>
                        <input
                          className="form-control"
                          type="file"
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              image: e.target.files[0],
                              imgPrev: URL.createObjectURL(e.target.files[0]),
                            })
                          }
                        />
                      </>
                    )}
                    {editFormData?.status == "cancelled" && (
                      <>
                        <label className="mt-3">Reject Reason</label>
                        <textarea
                          className="form-control"
                          type="type"
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              rejectReason: e?.target?.value,
                            })
                          }
                        />
                      </>
                    )}

                    {editFormData?.status ? (
                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={!isLoading && handleWithdrawFunc}
                      >
                        {isLoading ? "Saving..." : "Submit"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100 mt-4"
                        style={{ opacity: "0.5" }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData?._id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default DriverWithdrawList;
