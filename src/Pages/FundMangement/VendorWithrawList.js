import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { getAdminDetailsServ } from "../../services/adminFund.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";
function VendorWithdrawList() {
  const navigate = useNavigate();
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
  const [details, setDetails] = useState(null);
  const handleAdminFundDetails = async () => {
    try {
      let response = await getAdminDetailsServ(payload);
      setDetails(response?.data?.data);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Requests",
      count: 12,
      bgColor: "#6777EF",
    },
    {
      title: "Completed Requests",
      count: 10,
      bgColor: "#63ED7A",
    },
    {
      title: "Cancelled Requests",
      count: 8,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleAdminFundDetails();
  }, [payload]);

  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Fund Management"
        selectedItem="Vendor Withdraw Request"
      />
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
            <div className="col-lg-4 mb-2 col-md-12 col-12 d-flex">
              <div>
                {" "}
                <h3
                  className="mb-0 text-bold  text-light bg-secondary p-2 px-3"
                  style={{ borderRadius: "30px" }}
                >
                  Admin Wallet :{" "}
                  <b>{details?.details?.wallet.toFixed(2)} &#8377;</b>
                </h3>
              </div>
            </div>
            <div className="col-lg-4 mb-2  col-md-6 col-12">
              <div>
                <input
                  placeholder="Search"
                  className="form-control borderRadius24"
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
                  <option value="credit">Pending</option>
                  <option value="debit">Completed</option>
                  <option value="debit">Cancelled</option>
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
                      <th className="text-center py-3">Vendor Details</th>
                      <th className="text-center py-3">Message</th>
                      <th className="text-center py-3">Amount</th>
                      <th className="text-center py-3">Date</th>

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
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })
                      : (details?.details?.transactionHistory ?? [])
                          .filter(
                            (txn) =>
                              !payload.status ||
                              txn.transactionType === payload.status
                          )
                          .sort(
                            (a, b) =>
                              moment(b.date, "YYYY-MM-DD HH:mm:ss") -
                              moment(a.date, "YYYY-MM-DD HH:mm:ss")
                          )
                          .map((v, i) => {
                            return (
                              <>
                                <tr>
                                  <td className="text-center">{i + 1}</td>
                                  <td className="d-flex justify-content-center">
                                    <div className="border p-2 px-4 d-flex align-items-center bg-light rounded" style={{width:"220px"}}>
                                        <img src="https://cdn-icons-png.flaticon.com/128/456/456212.png" style={{height:"35px", width:"35px", borderRadius:"50%"}}/>
                                        <div className="ms-2">
                                            <p className="mb-0">Shubham Singh</p>
                                      <p className="mb-0">
                                        <i className="fa fa-phone" /> 9060148308
                                      </p>
                                        </div>
                                      
                                    </div>
                                  </td>
                                  <td className="text-center" style={{width:"220px"}}>{v?.message}</td>
                                  <td className="text-center">
                                    {v?.transactionType == "credit" ? "+" : "-"}{" "}
                                    {v?.amount.toFixed(2)} &#8377;
                                  </td>
                                  <td className="text-center">
                                    {moment(
                                      v?.date,
                                      "YYYY-MM-DD HH:mm:ss"
                                    ).format("DD MMM YYYY, hh:mm A")}
                                  </td>

                                  <td className="text-center" style={{verticalAlign:"center"}}>
                                    <select className="form-control">
                                        <option>Pending</option>
                                        <option>Pay</option>
                                        <option>Cancel</option>
                    
                                    </select>
                                  </td>
                                </tr>
                                <div className="py-2"></div>
                              </>
                            );
                          })}
                  </tbody>
                </table>
                {details?.details?.transactionHistory?.length == 0 &&
                  !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorWithdrawList;
