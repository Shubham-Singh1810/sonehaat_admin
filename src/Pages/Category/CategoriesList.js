import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getCategoryServ,
  addCategoryServ,
  deleteCategoryServ,
  updateCategoryServ,
  getCategoryDetailsServ,
} from "../../services/category.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { BsPencil, BsTrash } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination";

function CategoriesList() {
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
  const handleGetCategoryFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getCategoryServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Category",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Category",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Inactive Category",
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

  const navigate = useNavigate();

  const handleViewCategoryDetails = async (id) => {
    try {
      const res = await getCategoryDetailsServ(id);
      const details = res?.data?.data;
      navigate(`/category-details/${id}`, { state: { details } });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Unable to fetch category details"
      );
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Categories" selectedItem="Main Categories" />
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
              <h3 className="mb-0 text-bold text-secondary">Categories</h3>
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
                  className="form-control "
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
                  className="btn btn-primary w-100 "
                  style={{ color: "#fff",
                    border: "none",
                    // borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                    boxShadow: "0 4px 12px rgba(255,103,30,0.45)", }}
                  onClick={() => setAddFormData({ ...addFormData, show: true })}
                >
                  Add Category
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
                      <th className="text-center py-3">Image</th>
                      <th className="text-center py-3">Category Name</th>
                      <th className="text-center py-3">Status</th>
                      <th className="text-center py-3">Special Apperence</th>
                      <th className="text-center py-3">Created At</th>
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
                                    src={v?.image}
                                    style={{ height: "30px" }}
                                  />
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.name}
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
                                <td className="font-weight-600 text-center">
                                  {v?.specialApperence
                                    ? v?.specialApperence
                                    : "None"}
                                </td>
                                <td className="text-center">
                                  {moment(v?.createdAt).format("DD-MM-YY")}
                                </td>

                                <td className="text-center">
                                  <BsEye
                                    size={16}
                                    className="mx-1 text-primary"
                                    style={{ cursor: "pointer" }}
                                    title="View Details"
                                    onClick={() =>
                                      handleViewCategoryDetails(v?._id)
                                    }
                                  />

                                  <BsPencil
                                    size={16}
                                    className="mx-1 text-info"
                                    style={{ cursor: "pointer" }}
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
                                    title="Edit"
                                  />

                                  <BsTrash
                                    size={16}
                                    className="mx-1 text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDeleteCategoryFunc(v?._id)
                                    }
                                    title="Delete"
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
      {addFormData?.show && (
        <div className="modal fade show d-flex align-items-center  justify-content-center ">
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
                <div className="d-flex justify-content-center w-100">
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
                      className="btn w-100 mt-4"
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
                            color: "#fff",
                          border: "none",
                          // borderRadius: "24px",
                          background:
                            "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                          boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
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
                        className="btn w-100 mt-4"
                        style={{
                          color: "#fff",
                          border: "none",
                          // borderRadius: "24px",
                          background:
                            "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                          boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                        }}
                        onClick={!isLoading && handleUpdateCategoryFunc}
                      >
                        {isLoading ? "Saving..." : "Submit"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100 mt-4"
                        style={{
                          opacity: "0.5",
                          color: "#fff",
                          border: "none",
                          // borderRadius: "24px",
                          background:
                            "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                          boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                        }}
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

export default CategoriesList;
