import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  addCategoryServ,
  updateCategoryServ,
} from "../../services/category.service";
import {
  getNotifyServ,
  deleteNotifyServ,
  addNotifyServ,
} from "../../services/notification.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { getUserListServ } from "../../services/user.service";
import { MultiSelect } from "react-multi-select-component";
import { getDriverListServ } from "../../services/driver.service";
import { getVenderListServ } from "../../services/vender.services";
import { BsTrash } from "react-icons/bs";
import Pagination from "../../Components/Pagination";
function NotifyList() {
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
  const handleGetNotifyFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getNotifyServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  useEffect(() => {
    handleGetNotifyFunc();
  }, [payload]);
  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    title: "",
    image: "",
    subTitle: "",
    show: false,
    imgPrev: "",
    notifyUserIds: "",
  });
  const handleAddNotifyFunc = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("icon", addFormData?.image);
    formData.append("title", addFormData?.title);
    formData.append("subTitle", addFormData?.subTitle);
    selectedUsers.forEach((user) =>
      formData.append("notifyUserIds[]", user?.value)
    );
    selectedVenders.forEach((v) =>
      formData.append("notifyVenderIds[]", v?.value)
    );
    selectedDrivers.forEach((d) =>
      formData.append("notifyDriverIds[]", d?.value)
    );
    try {
      let response = await addNotifyServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setAddFormData({
          title: "",
          subTitle: "",
          image: "",
          notifyUserIds: [],
          show: false,
          imgPrev: "",
        });
        handleGetNotifyFunc();
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
      "Are you sure you want to delete this Notice?"
    );
    if (confirmed) {
      try {
        let response = await deleteNotifyServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetNotifyFunc();
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

  const [showNotifyDivPopup, setShowNotifyDivPopup] = useState(null);
  const [userList, setUserList] = useState([]);
  const handleGetUserFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getUserListServ({ pageCount: 200 });
      const userOptions = response?.data?.data?.map((v) => ({
        value: v?.androidDeviceId,
        label: `${v?.firstName} ${v?.lastName}`,
      }));
      setUserList(userOptions);
    } catch (error) {}
    setShowSkelton(false);
  };

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [venderList, setVenderList] = useState([]);
  const [selectedVenders, setSelectedVenders] = useState([]);

  const [driverList, setDriverList] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const handleGetVenderFunc = async () => {
    try {
      const res = await getVenderListServ({ pageCount: 200 });
      const venderOptions = res?.data?.data?.map((v) => ({
        value: v?.androidDeviceId,
        label: `${v?.firstName} ${v?.lastName}`,
      }));
      setVenderList(venderOptions);
    } catch (error) {
      console.error(error);
    }
  };

  // NEW: fetch drivers
  const handleGetDriverFunc = async () => {
    try {
      const res = await getDriverListServ({ pageCount: 200 });
      const driverOptions = res?.data?.data?.map((v) => ({
        value: v?.androidDeviceId,
        label: `${v?.firstName} ${v?.lastName}`,
      }));
      setDriverList(driverOptions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetUserFunc();
    handleGetVenderFunc();
    handleGetDriverFunc();
  }, []);
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Broadcaster" selectedItem="Notify" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Notice</h3>
            </div>
            <div className="col-lg-5 mb-2 col-md-12 col-12">
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
                  style={{ background: "#6777EF" }}
                  onClick={() => setAddFormData({ ...addFormData, show: true })}
                >
                  Add Notice
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
                      <th className="text-center py-3">Title</th>
                      <th className="text-center py-3">Message</th>

                      <th className="text-center py-3">Created At</th>
                      <th className="text-center py-3">Preview</th>
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
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">
                                  <img
                                    src={v?.icon}
                                    style={{ height: "30px" }}
                                  />
                                </td>
                                <td
                                  className="font-weight-600 text-center"
                                  style={{ width: "200px" }}
                                >
                                  {v?.title}
                                </td>
                                <td
                                  className="text-center"
                                  style={{ width: "200px" }}
                                >
                                  {v?.subTitle}
                                </td>

                                <td className="text-center">
                                  {moment(v?.createdAt).format("DD-MM-YY")}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <img
                                      onClick={() => setShowNotifyDivPopup(v)}
                                      src="https://cdn-icons-png.flaticon.com/128/159/159604.png"
                                      style={{ height: "20px" }}
                                    />
                                  </div>
                                </td>
                                <td className="text-center">
                                  <BsTrash
                                    size={16}
                                    className="mx-1 text-danger"
                                    style={{ cursor: "pointer" }}
                                    title="Delete"
                                    onClick={() =>
                                      handleDeleteCategoryFunc(v?._id)
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
                width: "564px",
                maxHeight: "95vh",
                overflowY: "auto",
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
                    <h5 className="mb-4">Add Notify</h5>
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
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label className="mt-3">Title</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="mt-3">Sub Title</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              subTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="row">
                      {/* Users */}
                      <div className="col-md-4 mb-3">
                        <label className="mt-3 d-block">Users</label>
                        <MultiSelect
                          options={userList}
                          value={selectedUsers}
                          onChange={setSelectedUsers}
                          labelledBy="Select Users"
                          hasSelectAll={true}
                          overrideStrings={{
                            selectSomeItems: "Select Users",
                            allItemsAreSelected: "All Users Selected",
                            selectAll: "Select All",
                            search: "Search Users...",
                          }}
                        />
                      </div>

                      {/* Vendors */}
                      <div className="col-md-4 mb-3">
                        <label className="mt-3 d-block">Vendors</label>
                        <MultiSelect
                          options={venderList}
                          value={selectedVenders}
                          onChange={setSelectedVenders}
                          labelledBy="Select Vendors"
                          hasSelectAll={true}
                          overrideStrings={{
                            selectSomeItems: "Select Vendors",
                            allItemsAreSelected: "All Vendors Selected",
                            selectAll: "Select All",
                            search: "Search Vendors...",
                          }}
                        />
                      </div>

                      {/* Drivers */}
                      <div className="col-md-4 mb-3">
                        <label className="mt-3 d-block">Drivers</label>
                        <MultiSelect
                          options={driverList}
                          value={selectedDrivers}
                          onChange={setSelectedDrivers}
                          labelledBy="Select Drivers"
                          hasSelectAll={true}
                          overrideStrings={{
                            selectSomeItems: "Select Drivers",
                            allItemsAreSelected: "All Drivers Selected",
                            selectAll: "Select All",
                            search: "Search Drivers...",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={
                        selectedUsers?.length > 0 &&
                        addFormData?.title &&
                        addFormData?.image &&
                        addFormData?.subTitle &&
                        !isLoading
                          ? handleAddNotifyFunc
                          : undefined
                      }
                      style={{
                        opacity:
                          !addFormData?.title ||
                          !addFormData?.subTitle ||
                          !addFormData?.image ||
                          !selectedUsers?.length > 0 ||
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

      {showNotifyDivPopup && (
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
              <div className="modal-body">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <div className="notifyMobileView ">
                      <div className="notifyMobileViewContent d-flex justify-content-center align-items-center">
                        <div>
                          <img src={showNotifyDivPopup?.icon} />
                          <h2 className="mt-3">{showNotifyDivPopup?.title}</h2>
                          <p>{showNotifyDivPopup?.subTitle} </p>
                        </div>
                      </div>
                      <img src="/phone.png" />
                    </div>
                    <div className="notifyPopUpCloseBtn mx-5">
                      <button
                        className="btn btn-danger w-100"
                        onClick={() => setShowNotifyDivPopup(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showNotifyDivPopup && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default NotifyList;
