import React, { useState, useEffect } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import {
  getFaqListServ,
  addFaqServ,
  updateFaqServ,
  deleteFaqServ,
} from "../../../services/faq.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { BsPencil, BsTrash } from "react-icons/bs";
import NoRecordFound from "../../../Components/NoRecordFound";
function UserFaq() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    category: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetFaqFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getFaqListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "User Faqs",
      count: statics?.userFaq,
      bgColor: "#6777EF",
    },
    {
      title: "Driver Faqs",
      count: statics?.driverFaq,
      bgColor: "#63ED7A",
    },
    {
      title: "Vendor Faqs",
      count: statics?.vendorFaq,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleGetFaqFunc();
  }, [payload]);
  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const handleAddFaqFunc = async () => {
    setIsLoading(true);
    try {
      let response = await addFaqServ(addFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setAddFormData({
          question: "",
          answer: "",
          category: "",
        });
        handleGetFaqFunc();
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
  const handleDeleteFaqFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Faq?"
    );
    if (confirmed) {
      try {
        let response = await deleteFaqServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetFaqFunc();
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
    question: "",
    answer: "",
    category: "",
    _id: "",
  });
  const handleUpdateFaqFunc = async () => {
    setIsLoading(true);
    try {
      let response = await updateFaqServ(editFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          question: "",
          answer: "",
          category: "",
          _id: "",
        });
        handleGetFaqFunc();
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
  const renderCategory = (category) => {
    if (category == "user") {
      return (
        <button
          className="badge"
          style={{ height: "30px", background: "#6777EF", border: "none" }}
        >
          User
        </button>
      );
    }
    if (category == "driver") {
      return (
        <button
          className="badge"
          style={{ height: "30px", background: "#63ED7A", border: "none" }}
        >
          Driver
        </button>
      );
    }
    if (category == "vendor") {
      return (
        <button
          className="badge"
          style={{ height: "30px", background: "#FFA426", border: "none" }}
        >
          Vendor
        </button>
      );
    }
  };
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="System Support" selectedItem="FAQs" />
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
              <h3 className="mb-0 text-bold text-secondary">FAQs</h3>
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
                    setPayload({ ...payload, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <div>
                <button
                  className="btn btn-primary w-100"
                  style={{ background: "#6777EF" }}
                  onClick={() => setAddFormData({ ...addFormData, show: true })}
                >
                  Add Faq
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
                      <th className="text-center py-3">Question</th>
                      <th className="text-center py-3">Answer</th>
                      <th className="text-center py-3">Category</th>
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

                                <td className="font-weight-600 text-center">
                                  {v?.question}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.answer}
                                </td>
                                <td className="text-center">
                                  {renderCategory(v?.category)}
                                </td>

                                <td className="text-center">
                                  <BsPencil
                                    size={16}
                                    className="mx-1 text-info"
                                    style={{ cursor: "pointer" }}
                                    title="Edit"
                                    onClick={() => {
                                      setEditFormData({
                                        question: v?.question,
                                        answer: v?.answer,
                                        category: v?.category,
                                        _id: v?._id,
                                      });
                                    }}
                                  />

                                  <BsTrash
                                    size={16}
                                    className="mx-1 text-danger"
                                    style={{ cursor: "pointer" }}
                                    title="Delete"
                                    onClick={() => handleDeleteFaqFunc(v?._id)}
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
                      question: "",
                      answer: "",
                      category: "",
                      show: false,
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
                    <h5 className="mb-4">Add FAQ</h5>

                    <label className="mt-3">Question</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          question: e.target.value,
                        })
                      }
                    />
                    <label className="mt-3">Answer</label>
                    <textarea
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          answer: e.target.value,
                        })
                      }
                    />
                    <label className="mt-3">Category</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="driver">Driver</option>
                    </select>
                    {addFormData?.question &&
                    addFormData?.answer &&
                    addFormData?.category ? (
                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={!isLoading && handleAddFaqFunc}
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
                      question: "",
                      answer: "",
                      category: "",
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
                    <h5 className="mb-4">Update Faq</h5>

                    <label className="mt-3">Question</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          question: e.target.value,
                        })
                      }
                      value={editFormData?.question}
                    />
                    <label className="mt-3">Answer</label>
                    <textarea
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          answer: e.target.value,
                        })
                      }
                      value={editFormData?.answer}
                    />
                    <label className="mt-3">Category</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAddFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                      value={editFormData?.category}
                    >
                      <option value="">Select Status</option>
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="driver">Driver</option>
                    </select>
                    {editFormData?.question &&
                    editFormData?.answer &&
                    editFormData?.category ? (
                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={!isLoading && handleUpdateFaqFunc}
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

export default UserFaq;
