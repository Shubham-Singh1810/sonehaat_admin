import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getCategoryServ,
  addCategoryServ,
  deleteCategoryServ,
  updateCategoryServ,
} from "../../services/category.service";
import {
  getRoleListServ,
  getPermissionListServ,
  deleteRoleServ,
  addRoleServ,
  updateRoleServ
} from "../../services/commandCenter.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import Select from "react-select";
function RoleList() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 20,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetRoleFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getRoleListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Roles",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
  ];
  const [permissionList, setPermissionList] = useState([]);
  const handleGetPermissionFunc = async () => {
    try {
      let response = await getPermissionListServ(payload);
      setPermissionList(response?.data?.data);
    } catch (error) {}
  };
  useEffect(() => {
    handleGetRoleFunc();
    handleGetPermissionFunc();
  }, [payload]);
  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    permissions: [],
    show: false,
  });
  const handleAddRoleFunc = async () => {
    setIsLoading(true);
    try {
      let response = await addRoleServ(addFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setAddFormData({
          name: "",
          permissions: [],
          show: false,
        });
        handleGetRoleFunc();
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
  const handleDeleteRoleFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role?"
    );
    if (confirmed) {
      try {
        let response = await deleteRoleServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetRoleFunc();
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
  const handleUpdateRoleFunc = async () => {
    setIsLoading(true);
    try {
      let response = await updateRoleServ(editFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          name: "",
          permissions: [],
          show: false,
        });
        handleGetRoleFunc();
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
      <Sidebar selectedMenu="Command Center" selectedItem="Roles" />
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
              <h3 className="mb-0 text-bold text-secondary">Roles</h3>
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

            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <div>
                <button
                  className="btn btn-primary w-100 borderRadius24"
                  style={{ background: "#6777EF" }}
                  onClick={() => setAddFormData({ ...addFormData, show: true })}
                >
                  Add Role
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

                      <th className="text-center py-3">Name</th>
                      <th className="text-center py-3">Permissions</th>

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

                                <td className="font-weight-600 text-center">
                                  {v?.name}
                                </td>
                                <td className="text-center">
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-secondary btn-sm dropdown-toggle"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      Permissions
                                    </button>
                                    <ul className="dropdown-menu ">
                                      {v?.permissions?.map((item, i) => (
                                        <li key={i}>
                                          <span className="dropdown-item">
                                            {item}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </td>

                                <td className="text-center">
                                  <a
                                    onClick={() => {
                                      setEditFormData({
                                        name: v?.name,
                                        permissions:v?.permissions,
                                        _id: v?._id,
                                        
                                      });
                                    }}
                                    className="btn btn-info mx-2 text-light shadow-sm"
                                  >
                                    Edit
                                  </a>
                                  <a
                                    onClick={() => handleDeleteRoleFunc(v?._id)}
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
                      permissions: [],
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
                    <h5 className="mb-4">Add Role</h5>
                    <label className="mt-3">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setAddFormData({ ...addFormData, name: e.target.value })
                      }
                    />
                    <label className="mt-3">Permissions (Multiple)</label>
                    <Select
                      isMulti
                      options={permissionList?.map((v) => ({
                        label: v?.name,
                        value: v?._id,
                      }))}
                      onChange={(selectedOptions) =>
                        setAddFormData({
                          ...addFormData,
                          permissions: selectedOptions.map(
                            (option) => option.label
                          ), // only array of string IDs
                        })
                      }
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />

                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={
                        addFormData?.name &&
                        addFormData?.permissions?.length > 0 &&
                        !isLoading
                          ? handleAddRoleFunc
                          : undefined
                      }
                      disabled={
                        !addFormData?.name ||
                        (addFormData?.permissions?.length > 0 && isLoading)
                      }
                      style={{
                        opacity:
                          !addFormData?.name ||
                          (addFormData?.permissions?.length > 0 && isLoading)
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
                      permissions: [],
                      show: false,
                      _id:""
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
                    <h5 className="mb-4">Update Role</h5>
                    <label className="mt-3">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      value={editFormData?.name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                    />
                    <label className="mt-3">Permissions (Multiple)</label>
                    <Select
                      isMulti
                      options={permissionList?.map((v) => ({
                        label: v?.name,
                        value: v?._id,
                      }))}
                      value={permissionList
                        ?.filter((v) => editFormData?.permissions?.includes(v.name))
                        .map((v) => ({
                          label: v.name,
                          value: v._id,
                        }))}
                      onChange={(selectedOptions) =>
                        setEditFormData({
                          ...editFormData,
                          permissions: selectedOptions.map(
                            (option) => option.label
                          ), // only array of string IDs
                        })
                      }
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />

                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={
                        editFormData?.name &&
                        editFormData?.permissions?.length > 0 &&
                        !isLoading
                          ? handleUpdateRoleFunc
                          : undefined
                      }
                      disabled={
                        !editFormData?.name ||
                        (editFormData?.permissions?.length > 0 && isLoading)
                      }
                      style={{
                        opacity:
                          !editFormData?.name ||
                          (editFormData?.permissions?.length > 0 && isLoading)
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
      {editFormData?._id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default RoleList;
