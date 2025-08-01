import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getCategoryServ,
  addCategoryServ,
  deleteCategoryServ,
  updateCategoryServ,
} from "../../services/category.service";
import { getCouponServ, deleteCouponServ } from "../../services/coupon.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
function AddCoupon() {
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
  const handleGetCouponFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getCouponServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Coupon",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Coupon",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Inactive Coupon",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
    {
      title: "Expired Coupon",
      count: statics?.expiredCount,
      bgColor: "red",
    },
  ];
  useEffect(() => {
    handleGetCouponFunc();
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
        handleGetCouponFunc();
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
  const handleDeleteCouponFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (confirmed) {
      try {
        let response = await deleteCouponServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetCouponFunc();
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
        handleGetCouponFunc();
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
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Promo Code" selectedItem="Coupon" />
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
                <div className="col-md-3 col-12 ">
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
              <h3 className="mb-0 text-bold text-secondary">Coupons</h3>
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
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <div>
                <button
                  className="btn btn-primary w-100 borderRadius24"
                  style={{ background: "#6777EF" }}
                  onClick={() => setAddFormData({ ...addFormData, show: true })}
                >
                  Add Coupon
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table
                  className="table"
                  style={{ width: "1400px", overflow: "scroll" }}
                >
                  <tbody>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "30px 0px 0px 30px" }}
                      >
                        Sr. No
                      </th>
                      <th className="text-center py-3">Image</th>
                      <th className="text-center py-3">Promo Code</th>
                      <th className="text-center py-3">Message</th>
                      <th className="text-center py-3">Duration</th>
                      <th className="text-center py-3">Discount</th>
                      <th className="text-center py-3">Min Order Amount</th>
                      <th className="text-center py-3">Usage</th>
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
                                    src={
                                      v?.image
                                        ? v?.image
                                        : "https://cdn-icons-png.flaticon.com/128/9341/9341950.png"
                                    }
                                    style={{ height: "30px" }}
                                  />
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.code}
                                </td>

                                <td
                                  className="font-weight-600 text-center"
                                  style={{ width: "200px" }}
                                >
                                  {v?.message}
                                </td>
                                <td className="text-center">
                                  {moment(v?.validFrom).format("DD MMM YYYY")}{" "}
                                  to {moment(v?.validTo).format("DD MMM YYYY")}
                                </td>
                                <td className="text-center">
                                  {v?.discountValue}{" "}
                                  {v?.discountType == "percentage"
                                    ? "%"
                                    : "INR"}
                                </td>
                                <td className="text-center">
                                  {v?.minimumOrderAmount} INR
                                </td>
                                <td className="text-center">
                                  {v?.usedCount}/{v?.usageLimit}
                                </td>
                                <td className="text-center">
                                  {v?.status ? (
                                    <div
                                      className="badge py-2"
                                      style={{ background: "#63ED7A" }}
                                    >
                                      Active
                                    </div>
                                  ) : (
                                    <div
                                      className="badge py-2 "
                                      style={{ background: "#FFA426" }}
                                    >
                                      Inactive
                                    </div>
                                  )}
                                </td>
                                <td className="text-center">
                                  <a
                                    onClick={() => {
                                      setEditFormData({
                                        name: v?.name,
                                        image: "",
                                        imgPrev: v?.image,
                                        status: v?.status,
                                        _id: v?._id,
                                        specialApperence: v?.specialApperence,
                                      });
                                    }}
                                    className="btn btn-info mx-2 text-light shadow-sm"
                                  >
                                    Edit
                                  </a>
                                  <a
                                    onClick={() =>
                                      handleDeleteCouponFunc(v?._id)
                                    }
                                    className="btn btn-warning mx-2 text-light shadow-sm"
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
                background: "red",
                width: "600px",
                height:"800px",
                overflow:"scroll"
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
                    <h5 className="mb-4">Add Coupon</h5>
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
                    <div className="row">
                      <div className="col-6">
                        <label className="mt-3">Code</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({ ...addFormData, code: e.target.value })
                      }
                    />
                      </div>
                      <div className="col-6">
                        <label className="mt-3">Minimum Order Amount</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({ ...addFormData, code: e.target.value })
                      }
                    />
                      </div>
                    </div>
                    <label className="mt-3">Message</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          message: e.target.value,
                        })
                      }
                    />
                    <div className="row">
                      <div className="col-6">
                        <label className="mt-3">Start Date</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              validFrom: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-6">
                        <label className="mt-3">End Date</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              validTo: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 pe-0">
                        <label className="mt-3">Discount</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              validFrom: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-4 ps-0">
                        <label className="mt-3">Type</label>
                        <select className="form-control py-1" style={{height:"37px"}}>
                          <option>Select</option>
                          <option>Flat</option>
                          <option>Percentage</option>
                        </select>
                      </div>
                    </div>
                    
                     <div className="row">
                      <div className="col-6">
                        <label className="mt-3">Used</label>
                        <input
                          className="form-control"
                          type="text"
                          readOnly
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              validFrom: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-6">
                        <label className="mt-3">Total Usage</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              validTo: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
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

export default AddCoupon;
