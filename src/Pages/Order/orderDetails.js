import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getOrderDetailsServ } from "../../services/order.services";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [showSkelton, setShowSkelton] = useState(false);



  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setShowSkelton(true);
    try {
      const res = await getOrderDetailsServ(id);
      setOrder(res?.data?.data || null);
    } catch (error) {
      // handle UI error as needed
    } finally {
      setShowSkelton(false);
    }
  };

  if (showSkelton) {
    return (
      <div className="bodyContainer">
        <Sidebar selectedMenu="Orders" selectedItem="Orders" />
        <div className="mainContainer">
          <TopNav />
          <div className="container-fluid p-lg-4 p-md-3 p-2">
            <div className="card shadow-sm p-4 mb-4">
              <Skeleton height={30} width={200} className="mb-3" />
              <Skeleton count={5} height={20} className="mb-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const user = order?.userId || {};
  const address = order?.address || order?.addressId || {};

  const products = [
    ...(order?.product || []).map((item) => ({ ...item, type: "product" })),
    ...(order?.comboProduct || []).map((item) => ({ ...item, type: "comboProduct" })),
  ];

  const getUnitPrice = (item) => {
    if (item.type === "product") {
      const p = item?.productId;
      return p?.discountedPrice || p?.price || 0;
    }
    if (item.type === "comboProduct") {
      const c = item?.comboProductId;
      return c?.pricing?.comboPrice || 0;
    }
    return 0;
  };

  const getRowTotal = (item) => (getUnitPrice(item) * (item?.quantity || 1)).toFixed(2);

  const getVariantText = (item) => {
    const v =
      item?.selectedVariant ||
      item?.productVariant ||
      item?.variantValue ||
      null;

    if (typeof v === "string" && v.trim()) return v;

    if (v && typeof v === "object") {
      const entries = [];
      if (v.variantKey && v.variantValue) entries.push(`${v.variantKey}: ${v.variantValue}`);
      if (v.variantSecondaryKey && v.variantSecondaryValue)
        entries.push(`${v.variantSecondaryKey}: ${v.variantSecondaryValue}`);
      if (entries.length) return entries.join(", ");
    }

    if (item?.variantKey && item?.variantValue) return `${item.variantKey}: ${item.variantValue}`;
    if (item?.variantSecondaryKey && item?.variantSecondaryValue)
      return `${item.variantSecondaryKey}: ${item.variantSecondaryValue}`;

    return "N/A";
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="All Orders" />
      <div className="mainContainer">
        <TopNav />
        <div className="container-fluid p-lg-4 p-md-3 p-2">
          <div className="row g-4">
            
            {/* Left Column */}
            <div className="col-lg-8">
              <div className="card shadow-sm p-4">
              <div className="mb-3">
                <button
                  className="btn btn-light shadow-sm border rounded-pill px-4 py-2"
                  onClick={() => navigate("/order-list")}
                  style={{ fontSize: "0.9rem", fontWeight: "500" }}
                >
                  ← Back
                </button>
              </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">
                    Order #{(order?._id || order?.orderId || "").toString().slice(0, 8).toUpperCase()}
                  </h4>
                  {order?._id && (
                    <button
                      className="btn"
                      onClick={() => navigate(`/order-invoice/${order?._id}`)}
                      style={{
                        backgroundColor: "#28c76f",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <i className="fa fa-download"></i> Invoice
                    </button>
                  )}
                </div>

                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Product Details</th>
                      <th>Item Price</th>
                      <th>Quantity</th>
                      <th>Variant</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, i) => {
                      if (item.type === "product") {
                        const p = item?.productId;
                        return (
                          <tr key={`product-${i}`}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    p?.productHeroImage ||
                                    "https://cdn-icons-png.flaticon.com/128/7515/7515150.png"
                                  }
                                  alt="product"
                                  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                                />
                                <strong className="ms-3">{p?.name || "-"}</strong>
                              </div>
                            </td>
                            <td>
                              <div style={{ lineHeight: "1.2" }}>
                                <div style={{ fontWeight: "bold", fontSize: "16px", color: "#28a745" }}>
                                  ₹{p?.discountedPrice || p?.price || 0}
                                </div>
                                {p?.discountedPrice && (
                                  <div
                                    style={{ textDecoration: "line-through", color: "#888", fontSize: "13px", marginTop: 4 }}
                                  >
                                    ₹{p?.price}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>{item?.quantity || 1}</td>
                            <td>{getVariantText(item)}</td>
                            <td>₹{getRowTotal(item)}</td>
                          </tr>
                        );
                      }

                      if (item.type === "comboProduct") {
                        const c = item?.comboProductId;
                        return (
                          <tr key={`combo-${i}`}>
                            <td>
                              <div>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={
                                      c?.productHeroImage ||
                                      "https://cdn-icons-png.flaticon.com/128/7515/7515150.png"
                                    }
                                    alt="combo"
                                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                                  />
                                  <strong className="ms-3">{c?.name || "Combo"}</strong>
                                </div>
                                <ul className="list-unstyled mb-0 mt-2 text-start">
                                  {Array.isArray(c?.productId) &&
                                    c.productId.map((prodObj, idx) => (
                                      <li key={idx} className="mb-1 px-2 py-1 bg-light rounded text-dark">
                                        {prodObj?.product?.name} ({prodObj?.quantity})
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </td>
                            <td>
                              <div style={{ lineHeight: "1.2" }}>
                                <div style={{ fontWeight: "bold", fontSize: "16px", color: "#28a745" }}>
                                  ₹{c?.pricing?.comboPrice || 0}
                                </div>
                                {c?.pricing?.offerPrice && (
                                  <div
                                    style={{ textDecoration: "line-through", color: "#888", fontSize: "13px", marginTop: 4 }}
                                  >
                                    ₹{c?.pricing?.offerPrice}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>{item?.quantity || 1}</td>
                            <td>{getVariantText(item)}</td>
                            <td>₹{getRowTotal(item)}</td>
                          </tr>
                        );
                      }

                      return null;
                    })}
                  </tbody>
                </table>

                <div className="d-flex flex-column align-items-end mt-3">
                  <div>Total: ₹{order?.totalAmount ?? 0}</div>
                  <div>Delivery Charge: ₹{order?.deliveryCharge || 0}</div>
                  <div>
                    Total Paid: ₹
                    {Number(order?.totalAmount || 0) +
                      (Number(order?.deliveryCharge) > 0 ? Number(order?.deliveryCharge) : 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (No Payment Section, No Status Section) */}
            <div className="col-lg-4">
              {/* Customer Details */}
              <div className="card shadow-sm p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h6 className="fw-bold mb-0">Customer Details</h6>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <img
                    src={
                      user?.profilePic
                        ? user?.profilePic
                        : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                    }
                    alt="profile"
                    style={{ width: 32, height: 32, borderRadius: "50%" }}
                  />
                  <div className="ms-3">
                    <div className="fw-semibold">
                      {address?.fullName ||
                        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                        "Guest"}
                    </div>
                    <div className="text-muted small">Customer</div>
                  </div>
                </div>

                <div className="mb-2 d-flex align-items-center">
                  <i className="fa fa-envelope me-2 text-muted"></i>
                  <span>{user?.email || "-"}</span>
                </div>

                <div className="d-flex align-items-center">
                  <i className="fa fa-phone me-2 text-muted"></i>
                  <span>{address?.phone || "-"} / {address?.alternatePhone|| "-"} </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card shadow-sm p-3 mb-4">
                <h6 className="fw-bold mb-2">Shipping Address</h6>
                {/* <div className="mb-2"><strong>Shipping:</strong> {order?.shipping || order?.shippingMethod || "-"}</div> */}
                <div>{address?.fullName || "-"}</div>
                <div>{address?.phone || "-"} / {address?.alternatePhone|| "-"}</div>
                <div>
                  {[address?.area, address?.landmark, address?.city]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  {address?.pincode ? `- ${address?.pincode}` : ""}
                  {address?.state ? `, ${address?.state}` : ""}
                </div>
                <div>{address?.country || ""}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderDetails;
