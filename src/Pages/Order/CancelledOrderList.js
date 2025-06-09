import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getCategoryServ,
  addCategoryServ,
  deleteCategoryServ,
  updateCategoryServ,
} from "../../services/category.service";
import { getOrderListServ } from "../../services/order.services";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
function CancelledOrderList() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    deliveryStatus: "cancelled",
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
  const [addFormData, setAddFormData] = useState({
    name: "",
    image: "",
    status: "",
    show: false,
    imgPrev: "",
    specialApperence: "",
  });
  const handleAddCategoryFunc = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", addFormData?.name);
    formData.append("image", addFormData?.image);
    formData.append("status", addFormData?.status);
    formData.append("specialApperence", addFormData?.specialApperence);
    try {
      let response = await addCategoryServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setAddFormData({
          name: "",
          image: "",
          status: "",
          show: false,
          imgPrev: "",
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
  const handleDeleteCategoryFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmed) {
      try {
        let response = await deleteCategoryServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetCategoryFunc();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : "Internal Server Error"
        );
      }
    }
  };
  const [editFormData, setEditFormData] = useState({
    name: "",
    image: "",
    status: "",
    _id: "",
    imgPrev: "",
    specialApperence: "",
  });
  const handleUpdateCategoryFunc = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (editFormData?.image) {
      formData?.append("image", editFormData?.image);
    }
    formData?.append("name", editFormData?.name);
    formData?.append("status", editFormData?.status);
    formData?.append("_id", editFormData?._id);
    formData?.append("specialApperence", editFormData?.specialApperence);
    try {
      let response = await updateCategoryServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          name: "",
          image: "",
          status: "",
          _id: "",
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
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="Cancelled Orders" />
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
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">
                Cancelled Orders
              </h3>
            </div>
            {/* <div className="col-lg-4 mb-2 col-md-12 col-12">
              <div>
                <input
                  className="form-control borderRadius24"
                  placeholder="Search by order id"
                  onChange={(e) =>
                    setPayload({ ...payload, searchKey: e.target.value })
                  }
                />
              </div>
            </div> */}
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
                                      ? "bg-light text-dark"
                                      : "text-light bg-primary")
                                  }
                                  style={{
                                    marginTop: i * -15 + "px",
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
                      </div>
                    );
                  })}
              {list.length == 0 && !showSkelton && <NoRecordFound />}
            </div>
          </div>
        </div>
      </div>
      {addFormData?.show && (
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
                    setAddFormData({
                      name: "",
                      image: "",
                      status: "",
                      show: false,
                      specialApperence: "",
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
                    <h5 className="mb-4">Add Category</h5>
                    <div className="p-3 border rounded mb-2">
                      {addFormData?.imgPrev ? (
                        <img
                          src={addFormData?.imgPrev}
                          className="img-fluid w-100 shadow rounded"
                        />
                      ) : (
                        <p className="mb-0 text-center">No Item Selected !</p>
                      )}
                    </div>
                    <label className="">Upload Image</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          image: e.target.files[0],
                          imgPrev: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                    />
                    <label className="mt-3">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({ ...addFormData, name: e.target.value })
                      }
                    />
                    <label className="mt-3">Status</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                    <label className="mt-3">Special Apperence</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          specialApperence: e.target.value,
                        })
                      }
                      value={addFormData?.specialApperence}
                    >
                      <option value="">Select Status</option>
                      <option value="Home">Home</option>
                    </select>
                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={
                        addFormData?.name &&
                        addFormData?.status &&
                        addFormData?.image &&
                        !isLoading
                          ? handleAddCategoryFunc
                          : undefined
                      }
                      disabled={
                        !addFormData?.name ||
                        !addFormData?.status ||
                        !addFormData?.image ||
                        isLoading
                      }
                      style={{
                        opacity:
                          !addFormData?.name ||
                          !addFormData?.status ||
                          !addFormData?.image ||
                          isLoading
                            ? "0.5"
                            : "1",
                      }}
                    >
                      {isLoading ? "Saving..." : "Submit"}
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {addFormData?.show && <div className="modal-backdrop fade show"></div>}
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
                  onClick={() =>
                    setEditFormData({
                      name: "",
                      image: "",
                      status: "",
                      specialApperence: "",
                      _id: "",
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
                    <h5 className="mb-4">Update Category</h5>
                    <div className="p-3 border rounded mb-2">
                      <img
                        src={editFormData?.imgPrev}
                        className="img-fluid w-100 shadow rounded"
                      />
                    </div>
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
                    <label className="mt-3">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      value={editFormData?.name}
                    />
                    <label className="mt-3">Status</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                      value={editFormData?.status}
                    >
                      <option value="">Select Status</option>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                    <label className="mt-3">Special Apperence</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          specialApperence: e.target.value,
                        })
                      }
                      value={editFormData?.specialApperence}
                    >
                      <option value="">Select Status</option>
                      <option value="Home">Home</option>
                    </select>
                    {editFormData?.name && editFormData?.status ? (
                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={!isLoading && handleUpdateCategoryFunc}
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

export default CancelledOrderList;
