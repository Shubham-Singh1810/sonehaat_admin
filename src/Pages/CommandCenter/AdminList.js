import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  addCategoryServ,
  deleteCategoryServ,
  updateCategoryServ,
} from "../../services/category.service";
import {
  getRoleListServ,
  getAdminListServ,
  addAdminServ,
  deleteAdminServ,
  updateAdminServ,
} from "../../services/commandCenter.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { BsPencil, BsTrash } from "react-icons/bs";
import Pagination from "../../Components/Pagination";
function AdminList() {
  const [showPassword, setShowPassword] = useState(false);
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
  const handleGetAdminFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getAdminListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Admin",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
  ];
  const [roleList, setRoleList] = useState();
  const handleGetRoleFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getRoleListServ(payload);
      setRoleList(response?.data?.data);
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetAdminFunc();
    handleGetRoleFunc();
  }, [payload]);
  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    show: false,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const handleAddAdminFunc = async () => {
    setIsLoading(true);
    try {
      let response = await addAdminServ(addFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setAddFormData({
          show: false,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "",
        });
        handleGetAdminFunc();
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
  const handleDeleteAdminFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (confirmed) {
      try {
        let response = await deleteAdminServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetAdminFunc();
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
  const handleUpdateAdminFunc = async () => {
    setIsLoading(true);
    try {
      let response = await updateAdminServ(editFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          name: "",
          image: "",
          status: "",
          _id: "",
          imgPrev: "",
          specialApperence: "",
        });
        handleGetAdminFunc();
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
      <Sidebar selectedMenu="Command Center" selectedItem="Admins" />
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
              <h3 className="mb-0 text-bold text-secondary">Admins</h3>
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

            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <div>
                <button
                  className="btn btn-primary w-100"
                  style={{ color: "#fff",
                    border: "none",
                    // borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                    boxShadow: "0 4px 12px rgba(255,103,30,0.45)",}}
                  onClick={() => setAddFormData({ ...addFormData, show: true })}
                >
                  Add Admin
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
                      <th className="text-center py-3">Profile Pic</th>
                      <th className="text-center py-3">Name</th>
                      <th className="text-center py-3">Email</th>
                      <th className="text-center py-3">Phone</th>
                      <th className="text-center py-3">Role</th>
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
                                <td className="font-weight-600 text-center">
                                  <div>
                                    <img
                                      style={{
                                        height: "50px",
                                        width: "50px",
                                        borderRadius: "50%",
                                      }}
                                      src={
                                        v?.profilePic
                                          ? v?.profilePic
                                          : "https://cdn-icons-png.flaticon.com/128/1144/1144709.png"
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.firstName + " " + v?.lastName}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.email}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.phone}
                                </td>
                                <td className="text-center">
                                  <div
                                    className="badge py-2"
                                    style={{ background: "#63ED7A" }}
                                  >
                                    {v?.role?.name}
                                  </div>
                                </td>

                                <td className="text-center">
                                  <BsPencil
                                    size={16}
                                    className="mx-1 text-info"
                                    style={{ cursor: "pointer" }}
                                    title="Edit"
                                    onClick={() => {
                                      setEditFormData({
                                        firstName: v?.firstName,
                                        lastName: v?.lastName,
                                        email: v?.email,
                                        phone: v?.phone,
                                        password: v?.password,
                                        role: v?.role,
                                        _id: v?._id,
                                      });
                                    }}
                                  />

                                  <BsTrash
                                    size={16}
                                    className="mx-1 text-danger"
                                    style={{ cursor: "pointer" }}
                                    title="Delete"
                                    onClick={() =>
                                      handleDeleteAdminFunc(v?._id)
                                    }
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
                width: "800px",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px" }}
                  onClick={() =>
                    setAddFormData({
                      show: false,
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      password: "",
                      role: "",
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
                    <h5 className="mb-4">Add Admin</h5>

                    <div className="row">
                      <div className="col-6">
                        <label className="mt-3">First Name</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-6">
                        <label className="mt-3">Last Name</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <label className="mt-3">Email</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          email: e.target.value,
                        })
                      }
                    />
                    <label className="mt-3">Phone</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          phone: e.target.value,
                        })
                      }
                    />
                    <div className="d-flex justify-content-between align-items-center">
                      <label>Password</label>
                      <i
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "relative",
                          top: "30px",
                          right: "10px",
                          cursor: "pointer",
                        }}
                        className="fa fa-eye"
                      ></i>
                    </div>
                    <input
                      className="form-control"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          password: e.target.value,
                        })
                      }
                    />
                    <label className="mt-3">Role</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Status</option>
                      {roleList?.map((v, i) => {
                        return <option value={v?._id}>{v?.name}</option>;
                      })}
                    </select>

                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={
                        addFormData?.firstName &&
                        addFormData?.lastName &&
                        addFormData?.email &&
                        addFormData?.phone &&
                        addFormData?.password &&
                        addFormData?.role &&
                        !isLoading
                          ? handleAddAdminFunc
                          : undefined
                      }
                      disabled={
                        !addFormData?.firstName &&
                        !addFormData?.lastName &&
                        !addFormData?.email &&
                        !addFormData?.phone &&
                        !addFormData?.password &&
                        !addFormData?.role &&
                        isLoading
                      }
                      style={{
                        opacity:
                          !addFormData?.firstName ||
                          !addFormData?.lastName ||
                          !addFormData?.email ||
                          !addFormData?.phone ||
                          !addFormData?.password ||
                          !addFormData?.role ||
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
                width: "800px",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px" }}
                  onClick={() =>
                    setEditFormData({
                      _id: "",
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      password: "",
                      role: "",
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
                    <h5 className="mb-4">Update Admin</h5>

                    <div className="row">
                      <div className="col-6">
                        <label className="mt-3">First Name</label>
                        <input
                          className="form-control"
                          type="text"
                          value={editFormData?.firstName}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-6">
                        <label className="mt-3">Last Name</label>
                        <input
                          className="form-control"
                          type="text"
                          value={editFormData?.lastName}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <label className="mt-3">Email</label>
                    <input
                      className="form-control"
                      type="text"
                      value={editFormData?.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value,
                        })
                      }
                    />
                    <label className="mt-3">Phone</label>
                    <input
                      className="form-control"
                      type="text"
                      value={editFormData?.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                    />
                    <div className="d-flex justify-content-between align-items-center">
                      <label>Password</label>
                      <i
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "relative",
                          top: "30px",
                          right: "10px",
                          cursor: "pointer",
                        }}
                        className="fa fa-eye"
                      ></i>
                    </div>
                    <input
                      className="form-control"
                      type={showPassword ? "text" : "password"}
                      value={editFormData?.password}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          password: e.target.value,
                        })
                      }
                    />
                    <label className="mt-3">Role</label>
                    <select
                      className="form-control"
                      value={editFormData?.role?._id}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Status</option>
                      {roleList?.map((v, i) => {
                        return <option value={v?._id}>{v?.name}</option>;
                      })}
                    </select>

                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={
                        editFormData?.firstName &&
                        editFormData?.lastName &&
                        editFormData?.email &&
                        editFormData?.phone &&
                        editFormData?.password &&
                        editFormData?.role &&
                        !isLoading
                          ? handleUpdateAdminFunc
                          : undefined
                      }
                      disabled={
                        !editFormData?.firstName &&
                        !editFormData?.lastName &&
                        !editFormData?.email &&
                        !editFormData?.phone &&
                        !editFormData?.password &&
                        !editFormData?.role &&
                        isLoading
                      }
                      style={{
                        opacity:
                          !editFormData?.firstName ||
                          !editFormData?.lastName ||
                          !editFormData?.email ||
                          !editFormData?.phone ||
                          !editFormData?.password ||
                          !editFormData?.role ||
                          isLoading
                            ? "0.5"
                            : "1",
                      }}
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </button>
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

export default AdminList;
