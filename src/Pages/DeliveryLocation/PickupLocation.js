import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { getVenderListServ } from "../../services/vender.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoRecordFound from "../../Components/NoRecordFound";
import Pagination from "../../Components/Pagination";

function PickupLocationPage() {
  const [vendorList, setVendorList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
  });
  const [loading, setLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getVenderListServ(payload);
      setVendorList(response?.data?.data || []);
      setStatics(response?.data?.documentCount || {});
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, [payload]);

  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Location Management"
        selectedItem="Pickup Location"
      />
      <div className="mainContainer">
        <TopNav />

        <div className="p-lg-4 p-md-3 p-2">
          <h3 className="mb-4 text-secondary">Pickup Locations</h3>

          <div className="table-responsive card-body px-2 table-invoice">
            <table className="table">
              <tbody>
                <tr style={{ background: "#F3F3F3", color: "#000" }}>
                  <th
                    className="text-center py-3"
                    style={{ borderRadius: "30px 0 0 30px" }}
                  >
                    Sr. No
                  </th>
                  <th className="text-center py-3">Store Details</th>
                  <th className="text-center py-3">Pincode</th>
                  <th className="text-center py-3">Address</th>
                  <th className="text-center py-3">City</th>
                  <th
                    className="text-center py-3"
                    style={{ borderRadius: "0 30px 30px 0" }}
                  >
                    State
                  </th>
                </tr>

                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td className="text-center">
                          <Skeleton width={50} height={25} />
                        </td>
                        <td className="text-center">
                          <Skeleton circle width={50} height={50} />
                          <div className="mt-1">
                            <Skeleton width={100} height={20} />
                          </div>
                        </td>
                        <td className="text-center">
                          <Skeleton width={80} height={25} />
                        </td>
                        <td className="text-center">
                          <Skeleton width={120} height={25} />
                        </td>
                        <td className="text-center">
                          <Skeleton width={80} height={25} />
                        </td>
                        <td className="text-center">
                          <Skeleton width={100} height={25} />
                        </td>
                      </tr>
                    ))
                  : vendorList.map((v, i) => (
                      <tr key={v._id}>
                        <td className="text-center">{i + 1}</td>
                        <td className="text-center">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <img
                              src={
                                v?.storeLogo ||
                                "https://cdn-icons-png.flaticon.com/128/726/726569.png"
                              }
                              alt="store"
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #eee",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                              }}
                              onError={(e) => {
                                e.currentTarget.onerror = null; // prevents infinite loop if icon fails
                                e.currentTarget.src =
                                  "https://cdn-icons-png.flaticon.com/128/726/726569.png";
                              }}
                            />

                            <div style={{ textAlign: "left" }}>
                              <div style={{ fontWeight: 500 }}>
                                {v?.storeName ||
                                  `${v?.firstName} ${v?.lastName}`}
                              </div>
                              <div
                                style={{ fontSize: "0.85rem", color: "#555" }}
                              >
                                {v?.phone
                                  ? `+${v?.countryCode}-${v?.phone}`
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="text-center">{v?.pincode || "-"}</td>
                        <td className="text-center">{v?.address || "-"}</td>
                        <td className="text-center">{v?.district || "-"}</td>
                        <td className="text-center">{v?.state || "-"}</td>
                      </tr>
                    ))}

                {!loading && vendorList.length === 0 && <NoRecordFound />}
              </tbody>
            </table>
          </div>

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
  );
}

export default PickupLocationPage;
