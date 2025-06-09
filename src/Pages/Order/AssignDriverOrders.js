import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

import { getDriverListServ } from "../../services/driver.service";
import {
  getOrderListServ,
  assignDriverServ,
} from "../../services/order.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
function AssignDriverOrders() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    deliveryStatus: "orderPacked",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
    // sortByOrder:"asc"
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetCategoryFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getOrderListServ({ ...payload });
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Today's Order",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "This Week",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "This Month",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleGetCategoryFunc();
  }, [payload]);
  const [isLoading, setIsLoading] = useState(false);

  const [editFormData, setEditFormData] = useState({
    driverId: "",
    id: "",
    deliveryStatus: "driverAssigned",
    productIds: [],
  });
  const assignDriverFunc = async () => {
    setIsLoading(true);
    try {
      let response = await assignDriverServ({...editFormData, expectedDeliveryDate:"31-05-2025"});
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          driverId: "",
          id: "",
          deliveryStatus: "driverAssigned",
          productIds: [],
        });
        handleGetCategoryFunc();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Internal Server Error"
      );
    }
    setIsLoading(false);
  };
  const deliveryStatusOptions = [
    { label: "Select Delivery Status", value: "" },
    { label: "Order Placed", value: "orderPlaced" },
    { label: "Order Packed", value: "orderPacked" },
    { label: "Driver Assigned", value: "driverAssigned" },
    { label: "Driver Accepted", value: "driverAccepted" },
    { label: "Picked Order", value: "pickedOrder" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];
  const renderStatusFunction = (status) => {
    if (status == "orderPlaced") {
      return "New Request";
    }
    if (status == "orderPacked") {
      return "Order Packed";
    }
    if (status == "driverAssigned") {
      return "Driver Assigned";
    }
    if (status == "driverAccepted") {
      return "Driver Accepted";
    }
    if (status == "pickedOrder") {
      return "Out for delivery";
    }
    if (status == "completed") {
      return "Completed";
    }
    if (status == "cancelled") {
      return "Cancelled";
    }
  };
  const [driverList, setDriverList] = useState([]);
  const getDriverListFunc = async () => {
    try {
      let response = await getDriverListServ({ status: "approved" });
      if (response?.data?.statusCode == "200") {
        setDriverList(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getDriverListFunc();
  }, []);
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="Assign Driver" />
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

          <div className="mt-3">
            <div className="card-body px-2">
              {showSkelton
                ? [1, 2, 3, 4]?.map((v, i) => {
                    return (
                      <div className="row px-2 pe-3 py-3 orderMainCard m-0 mb-4 shadow">
                        <div className="row col-5 m-0 p-0">
                          <div className="col-6 m-0">
                            <Skeleton height={200} />
                          </div>
                          <div className="col-6 m-0">
                            <Skeleton height={200} />
                          </div>
                        </div>
                        <div className="col-7 ">
                          <Skeleton height={200} />
                        </div>
                      </div>
                    );
                  })
                : list?.map((v, i) => {
                    return (
                      <div className="row px-2 pe-3 py-3 orderMainCard m-0 mb-4 shadow">
                        <div className="row col-5 m-0 p-0">
                          <div className="col-6 m-0">
                            <div className=" p-2 bg-light mb-2 boxCart">
                              <p>
                                <b>User Details</b>
                              </p>
                              <div className="d-flex align-items-center">
                                <div>
                                  <img
                                    src={
                                      v?.userId?.profilePic
                                        ? v?.userId?.profilePic
                                        : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                                    }
                                    style={{
                                      height: "50px",
                                      width: "50px",
                                      borderRadius: "50px",
                                    }}
                                  />
                                </div>
                                <div className="ms-2">
                                  <p
                                    className="mb-0"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {v?.userId?.firstName +
                                      " " +
                                      v?.userId?.lastName}
                                  </p>
                                  <p
                                    className="mb-0"
                                    style={{ fontSize: "14px" }}
                                  >
                                    Phone : {v?.userId?.phone}
                                  </p>
                                </div>
                              </div>
                              <hr className="my-1" />
                              <p>
                                <b>Address</b>
                              </p>
                              <p>
                                {v?.addressId?.area}, {v?.addressId?.landmark},{" "}
                                {v?.addressId?.city}, {v?.addressId?.pincode},{" "}
                                {v?.addressId?.state}
                              </p>
                            </div>
                          </div>
                          <div className="col-6 m-0">
                            <div className=" p-2 bg-light boxCart">
                              <p>
                                <b>Order</b> : {v?._id?.substring(0, 10)}
                              </p>
                              <p>
                                <b>Total Amount</b>: {v?.totalAmount}
                              </p>
                              <hr className="my-1" />
                              <p>
                                <b>Mode Of Payment</b> : {v?.modeOfPayment}
                              </p>
                              {v?.modeOfPayment == "Online" && (
                                <>
                                  <p>
                                    <b>Signature</b>: {v?.signature}
                                  </p>
                                  <p>
                                    <b>Payment ID</b>: {v?.paymentId}
                                  </p>
                                  <p>
                                    <b>Order ID</b>: {v?.orderId}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-7 ">
                          {v?.product?.map((value, i) => {
                            return (
                              <div className=" ">
                                <div
                                  className={
                                    "flatCart d-flex row justify-content-between align-items-center  py-3 pb-4 " +
                                    (i % 2 == 0
                                      ? " bg-light text-dark "
                                      : " text-light bg-primary ")
                                  }
                                  style={{
                                    marginTop: i * -10 + "px",
                                    borderRadius:
                                      i + 1 == v?.product?.length
                                        ? "20px"
                                        : "20px 20px 0px 0px",
                                  }}
                                >
                                  <p className="col-1">{i + 1}.</p>

                                  <p className="col-2">
                                    {value?.productId?.name}
                                  </p>
                                  <p className="col-3">
                                    Quantity : {value?.quantity}
                                  </p>
                                  <p className="col-4">
                                    Total Price : {value?.totalPrice}
                                  </p>
                                  <p className="col-2">
                                    <span className="">
                                      {renderStatusFunction(
                                        value?.deliveryStatus
                                      )}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div
                          onClick={() =>
                            setEditFormData({
                              id: v?._id,
                              deliveryStatus: "driverAssigned",
                              productIds: v?.product?.map((p) => p?.productId?._id),
                              driverId: "",
                            })
                          }
                          className="p-2 mt-2 shadow bg-dark text-light text-center ms-3 col-3 d-flex assignDriverBtn justify-content-center align-items-center"
                        >
                          <img src="https://cdn-icons-png.flaticon.com/128/3988/3988365.png" />
                          <span>Assign Driver</span>
                        </div>
                      </div>
                    );
                  })}
              {list.length == 0 && !showSkelton && <NoRecordFound />}
            </div>
          </div>
        </div>
      </div>

      {editFormData?.id && (
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
                  onClick={() =>
                    setEditFormData({
                      driverId: "",
                      id: "",
                      deliveryStatus: "driverAssigned",
                      productIds: [],
                    })
                  }
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
                    <h6 className="mb-2">
                      Please assign a driver for this order
                    </h6>

                    <label className="mt-1">Select Driver</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          driverId: e.target.value,
                        })
                      }
                    >
                      <option>Select</option>
                      {driverList?.map((v, i) => {
                        return (
                          <option value={v?._id}>
                            {v?.firstName + " " + v?.lastName}
                          </option>
                        );
                      })}
                    </select>
                    {editFormData?.driverId ? (
                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={!isLoading && assignDriverFunc}
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
      {editFormData?.id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default AssignDriverOrders;
