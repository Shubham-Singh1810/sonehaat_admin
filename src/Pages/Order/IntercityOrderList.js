import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoRecordFound from "../../Components/NoRecordFound";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// services
// import { getIntercityOrderListServ } from "../../services/intercityOrder.services";
import Pagination from "../../Components/Pagination";

function IntercityOrderList() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [showSkelton, setShowSkelton] = useState(false);

  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "createdAt",
    sortByOrder: "desc",
  });

  const totalPages = useMemo(() => {
    if (!statics?.totalCount || !payload.pageCount) return 1;
    return Math.max(1, Math.ceil(statics.totalCount / payload.pageCount));
  }, [statics, payload.pageCount]);

  const deliveryStatusOptions = [
    { label: "All Status", value: "" },
    { label: "Order Placed", value: "orderPlaced" },
    { label: "Order Packed", value: "orderPacked" },
    { label: "Driver Assigned", value: "driverAssigned" },
    { label: "Driver Accepted", value: "driverAccepted" },
    { label: "Picked Order", value: "pickedOrder" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const staticsArr = [
    { title: "Today's Intercity Orders", count: statics?.totalCount, bgColor: "#6777EF" },
    { title: "This Week", count: statics?.activeCount, bgColor: "#63ED7A" },
    { title: "This Month", count: statics?.inactiveCount, bgColor: "#FFA426" },
  ];

//   const handleFetch = async () => {
//     if (list.length === 0) setShowSkelton(true);
//     try {
//       const res = await getIntercityOrderListServ({
//         searchKey: payload.searchKey,
//         status: payload.status,
//         pageNo: payload.pageNo,
//         pageCount: payload.pageCount,
//         sortByField: payload.sortByField,
//         sortByOrder: payload.sortByOrder,
//       });
//       setList(res?.data?.data || []);
//       setStatics(res?.data?.documentCount || {});
//     } catch (e) {
//       toast.error("Failed to load intercity orders");
//     } finally {
//       setShowSkelton(false);
//     }
//   };

//   useEffect(() => {
//     handleFetch();
//   }, [
//     payload.pageNo,
//     payload.pageCount,
//     payload.status,
//     payload.searchKey,
//     payload.sortByField,
//     payload.sortByOrder,
//   ]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setPayload((p) => ({ ...p, pageNo: page }));
  };

  const handleDownload = async (type) => {
    toast.info(`Preparing ${type.toUpperCase()} download...`);
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="Intercity Orders" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{ position: "relative", top: "-75px", marginBottom: "-75px" }}
          >
            {staticsArr?.map((v, i) => (
              <div className="col-md-4 col-12" key={i}>
                <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                  <div className="d-flex align-items-center">
                    <div className="p-2 shadow rounded" style={{ background: v?.bgColor }}>
                      <img src="https://cdn-icons-png.flaticon.com/128/666/666120.png" />
                    </div>
                    <div className="ms-3">
                      <h6>{v?.title}</h6>
                      <h2 className="text-secondary">{v?.count}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row m-0 p-0 d-flex justify-content-between align-items-center my-4 topActionForm">
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Intercity Orders</h3>
            </div>

            <div className="col-lg-4 mb-2 col-md-6 col-12">
              <input
                className="form-control"
                placeholder="Search by order id/user"
                value={payload.searchKey}
                onChange={(e) => setPayload({ ...payload, searchKey: e.target.value, pageNo: 1 })}
              />
            </div>

            <div className="col-lg-3 mb-2 col-md-6 col-6">
              <select
                className="form-control"
                value={payload.status}
                onChange={(e) => setPayload({ ...payload, status: e.target.value, pageNo: 1 })}
              >
                {deliveryStatusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="container mt-4">
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th className="text-center py-3" style={{ borderRadius: "30px 0px 0px 30px" }}>
                      Sr. No
                    </th>
                    <th>Order ID</th>
                    <th>Created</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {showSkelton ? (
                    [...Array(10)].map((_, i) => (
                      <tr key={i}>
                        <td><Skeleton width={60} height={20} /></td>
                        <td><Skeleton width={120} height={20} /></td>
                        <td><Skeleton width={140} height={20} /></td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Skeleton circle width={32} height={32} />
                            <Skeleton width={100} height={20} />
                          </div>
                        </td>
                        <td><Skeleton width={180} height={20} /></td>
                        <td><Skeleton width={80} height={30} /></td>
                      </tr>
                    ))
                  ) : list?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-3">
                        <NoRecordFound />
                      </td>
                    </tr>
                  ) : (
                    list.map((item, index) => (
                      <tr key={item?._id || index}>
                        <td className="text-center">
                          {(payload.pageNo - 1) * payload.pageCount + index + 1}
                        </td>
                        <td>{item?._id.slice(0, 10) || "-"}</td>
                        <td>
                          {item?.createdAt
                            ? moment(item.createdAt).format("DD MMM YYYY hh:mm A")
                            : "-"}
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={
                                item?.userId?.profilePic
                                  ? item?.userId?.profilePic
                                  : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                              }
                              alt="profile"
                              style={{ width: 32, height: 32, borderRadius: "50%" }}
                            />
                            {item?.address?.fullName
                              ? item.address.fullName
                              : [item?.userId?.firstName, item?.userId?.lastName]
                                  .filter(Boolean)
                                  .join(" ") || "Guest"}
                          </div>
                        </td>
                        <td style={{ fontSize: "14px" }}>
                          <div>Mode: {item?.modeOfPayment || "-"}</div>
                          <div>Paid: ₹{item?.totalAmount ?? "-"}</div>
                          {item?.paymentId && <div>Txn ID: #{item.paymentId}</div>}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => navigate(`/intercity-order-details/${item._id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

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
  );
}

export default IntercityOrderList;
