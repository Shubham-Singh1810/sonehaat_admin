import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getTicketListServ,
  updateTicketServ,
} from "../../services/ticker.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import {useNavigate} from "react-router-dom"
function DriverTicketList() {
  const navigate = useNavigate()
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
    userType: "Driver",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetTicketFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getTicketListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Ticket",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Open Tickets",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Closed Tickets",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleGetTicketFunc();
  }, [payload]);
  const [isLoadingId, setIsLoadingId] = useState("");
  const updateTicketFunc = async (formData) => {
    setIsLoadingId(formData?._id);
    try {
      let response = await updateTicketServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        handleGetTicketFunc();
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setIsLoadingId("");
  };
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Support Tickets" selectedItem="Driver Tickets" />
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
              <h3 className="mb-0 text-bold text-secondary">Tickets</h3>
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
            <div className="col-lg-4 mb-2  col-md-6 col-12">
              <div>
                <select
                  className="form-control borderRadius24"
                  onChange={(e) =>
                    setPayload({ ...payload, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value={true}>Open</option>
                  <option value={false}>Closed</option>
                </select>
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
                      <th className="text-center py-3">Subject</th>
                      <th className="text-center py-3">Category</th>
                      <th className="text-center py-3">User Name</th>
                      <th className="text-center py-3">Created At</th>
                      <th className="text-center py-3">Chat</th>
                      <th
                        className="text-center py-3 "
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Staus
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
                                        : "https://cdn-icons-png.flaticon.com/128/175/175613.png"
                                    }
                                    style={{ height: "30px" }}
                                  />
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.subject}
                                </td>
                                <td className="text-center">
                                  <div
                                    className="badge py-2"
                                    style={{ background: "gray" }}
                                  >
                                    {v?.ticketCategoryId?.name}
                                  </div>
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.userDetails?.firstName +
                                    " " +
                                    v?.userDetails?.lastName}
                                </td>
                                <td className="text-center">
                                  {moment(v?.createdAt).format("DD-MM-YY")}
                                </td>
                                <td className="text-center">
                                <div
                                    className="badge py-2"
                                    style={{ background: "#63ED7A", cursor:"pointer" }}
                                    onClick={()=>navigate("/chat-box/"+v?._id)}
                                  >
                                    View
                                  </div>
                                </td>
                                <td className="text-center">
                                  {isLoadingId == v?._id ? (
                                    <button className="btn btn-sm shadow-sm ">
                                      Updating ...
                                    </button>
                                  ) : (
                                    <select
                                      className={
                                        "form-control shadow-sm text-light py-0" +
                                        (v?.status ? " bg-info" : " bg-warning")
                                      }
                                      style={{ height: "30px" }}
                                      value={v?.status}
                                      onChange={(e) =>
                                        updateTicketFunc({
                                          status: e.target.value === "true",
                                          _id: v?._id,
                                        })
                                      }
                                    >
                                      <option value="">Select</option>
                                      <option value="true">Open</option>
                                      <option value="false">Closed</option>
                                    </select>
                                  )}
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
    </div>
  );
}

export default DriverTicketList;
