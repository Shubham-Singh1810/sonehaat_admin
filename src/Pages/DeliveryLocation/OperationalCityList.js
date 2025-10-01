import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getOperationalCityServ,
  addOperationalCityServ,
  updateOperationalCityServ,
  deleteOperationalCityServ,
} from "../../services/OperationalCity.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { BsPencil, BsTrash } from "react-icons/bs";
import Pagination from "../../Components/Pagination";

function OperationalCityList() {
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

  const fetchCities = async () => {
    if (list.length === 0) setShowSkelton(true);
    try {
      const response = await getOperationalCityServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (err) {
      console.error(err);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    fetchCities();
  }, [payload]);

  const staticsArr = [
    {
      title: "Total Operational Cities",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Operational Cities",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Inactive Operational Cities",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    status: "",
    rate: "",
    show: false,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    status: "",
    rate: "",
    _id: "",
  });

  const handleAddCity = async () => {
    setIsLoading(true);
    try {
      const res = await addOperationalCityServ(addFormData);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        setAddFormData({ name: "", status: "", show: false });
        fetchCities();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
    setIsLoading(false);
  };

  const handleDeleteCity = async (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        const res = await deleteOperationalCityServ(id);
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          fetchCities();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      }
    }
  };

  const handleUpdateCity = async () => {
    setIsLoading(true);
    try {
      const res = await updateOperationalCityServ(editFormData);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        setEditFormData({ name: "", status: "", _id: "" });
        fetchCities();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
    setIsLoading(false);
  };

  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Location Management"
        selectedItem="Operational City"
      />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          {/* Statics Cards */}
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          >
            {staticsArr.map((v, i) => (
              <div key={i} className="col-md-4 col-12">
                <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="p-2 shadow rounded"
                      style={{ background: v.bgColor }}
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/666/666120.png"
                        alt="icon"
                      />
                    </div>
                    <div className="ms-3">
                      <h6>{v.title}</h6>
                      <h2 className="text-secondary">{v.count}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Actions */}
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-4 mb-2">
              <h3 className="mb-0 text-bold text-secondary">
                Operational Cities
              </h3>
            </div>
            <div className="col-lg-4 mb-2">
              <input
                className="form-control"
                placeholder="Search"
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e.target.value })
                }
              />
            </div>
            <div className="col-lg-2 mb-2">
              <select
                className="form-control"
                onChange={(e) =>
                  setPayload({ ...payload, status: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="col-lg-2 mb-2">
              <button
                className="btn btn-primary w-100"
                style={{
                  color: "#fff",
                  border: "none",
                  // borderRadius: "24px",
                  background:
                    "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                  boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                }}
                onClick={() => setAddFormData({ ...addFormData, show: true })}
              >
                Add City
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-3 card-body px-2 table-responsive table-invoice">
            <table className="table">
              <tbody>
                <tr style={{ background: "#F3F3F3", color: "#000" }}>
                  <th
                    className="text-center py-3"
                    style={{ borderRadius: "30px 0 0 30px" }}
                  >
                    Sr. No
                  </th>
                  <th className="text-center py-3">Name</th>
                  <th className="text-center py-3">Price/Km</th>
                  <th className="text-center py-3">Status</th>
                  <th className="text-center py-3">Created At</th>
                  <th
                    className="text-center py-3"
                    style={{ borderRadius: "0 30px 30px 0" }}
                  >
                    Action
                  </th>
                </tr>
                {showSkelton
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td className="text-center">
                          <Skeleton width={50} height={25} />
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
                    ))
                  : list.map((v, i) => (
                      <tr key={v._id}>
                        <td className="text-center">
                          {(payload.pageNo - 1) * payload.pageCount + i + 1}
                        </td>
                        <td className="text-center">{v.name}</td>
                        <td className="text-center">{v.rate}</td>
                        <td className="text-center">
                          {v.status ? (
                            <div
                              className="badge py-2"
                              style={{ background: "#63ED7A" }}
                            >
                              Active
                            </div>
                          ) : (
                            <div
                              className="badge py-2"
                              style={{ background: "#FFA426" }}
                            >
                              Inactive
                            </div>
                          )}
                        </td>

                        <td className="text-center">
                          {moment(v.createdAt).format("DD-MM-YY")}
                        </td>
                        <td className="text-center">
                          <BsPencil
                            size={16}
                            className="mx-1 text-info"
                            style={{ cursor: "pointer" }}
                            title="Edit"
                            onClick={() =>
                              setEditFormData({
                                name: v.name,
                                status: v.status,
                                rate: v.rate,
                                _id: v._id,
                              })
                            }
                          />
                          <BsTrash
                            size={16}
                            className="mx-1 text-danger"
                            style={{ cursor: "pointer" }}
                            title="Delete"
                            onClick={() => handleDeleteCity(v._id)}
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {list.length === 0 && !showSkelton && <NoRecordFound />}
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

      {/* Add Modal */}
      {addFormData?.show && (
        <>
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
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
                    alt="close"
                    style={{ height: "20px", cursor: "pointer" }}
                    onClick={() =>
                      setAddFormData({
                        name: "",
                        status: "",
                        rate: "",
                        show: false,
                      })
                    }
                  />
                </div>

                <div className="modal-body">
                  <div className="d-flex justify-content-center w-100 px-2">
                    <div className="w-100">
                      <h5 className="mb-4">Add Operational City</h5>

                      <label className="mt-3">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            name: e.target.value,
                          })
                        }
                      />

                      <label className="mt-3">Rate</label>
                      <input
                        className="form-control"
                        type="number"
                        value={addFormData?.rate}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            rate: e.target.value,
                          })
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

                      <button
                        className="btn btn-success w-100 mt-4"
                        onClick={
                          addFormData?.name && addFormData?.status && !isLoading
                            ? handleAddCity
                            : undefined
                        }
                        disabled={
                          !addFormData?.name ||
                          !addFormData?.status ||
                          isLoading
                        }
                        style={{
                          opacity:
                            !addFormData?.name ||
                            !addFormData?.status ||
                            isLoading
                              ? "0.5"
                              : "1",
                        }}
                      >
                        {isLoading ? "Saving..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editFormData?._id && (
        <>
          <div
            className="modal fade show d-flex align-items-center justify-content-center"
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
                    alt="close"
                    style={{ height: "20px", cursor: "pointer" }}
                    onClick={() =>
                      setEditFormData({
                        name: "",
                        status: "",
                        rate: "",
                        _id: "",
                      })
                    }
                  />
                </div>

                <div className="modal-body">
                  <div className="d-flex justify-content-center w-100 px-2">
                    <div className="w-100">
                      <h5 className="mb-4">Update Operational City</h5>

                      <label className="mt-3">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        value={editFormData?.name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name: e.target.value,
                          })
                        }
                      />

                      <label className="mt-3">Rate</label>
                      <input
                        className="form-control"
                        type="number"
                        value={editFormData?.rate}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            rate: e.target.value,
                          })
                        }
                      />

                      <label className="mt-3">Status</label>
                      <select
                        className="form-control"
                        value={editFormData?.status}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
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
                          !isLoading &&
                          editFormData?.name &&
                          editFormData?.status
                            ? handleUpdateCity
                            : undefined
                        }
                        disabled={
                          !editFormData?.name ||
                          !editFormData?.status ||
                          isLoading
                        }
                        style={{
                          opacity:
                            !editFormData?.name ||
                            !editFormData?.status ||
                            isLoading
                              ? "0.5"
                              : "1",
                        }}
                      >
                        {isLoading ? "Saving..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default OperationalCityList;
