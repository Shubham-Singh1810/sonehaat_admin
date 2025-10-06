import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { getOrderDetailsServ } from "../../services/order.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useReactToPrint } from "react-to-print";

const OrderInvoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${order?._id?.slice(0, 8)}`,
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .print-area { overflow: visible !important; height: auto !important; }
      }
    `,
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await getOrderDetailsServ(id);
        setOrder(res?.data?.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="bodyContainer">
        <Sidebar selectedMenu="Orders" selectedItem="Orders" />
        <div className="mainContainer">
          <TopNav />
          <div className="container-fluid p-lg-4 p-md-3 p-2">
            <div className="card shadow-sm p-4 mb-4">
              <Skeleton height={30} width={200} className="mb-3" />
              <Skeleton count={6} height={20} className="mb-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const address = order?.addressId || {};
  const user = order?.userId || {};
  const products = order?.product || [];

  const subTotal = products.reduce((sum, p) => {
    const price = p?.productId?.discountedPrice || p?.productId?.price || 0;
    return sum + price * (p.quantity || 1);
  }, 0);

  const deliveryCharge = Number(order?.deliveryCharges) || 0;
  const totalAmount = subTotal + deliveryCharge;

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="All Orders" />
      <div className="mainContainer">
        <TopNav />
        <div className="container-fluid p-lg-4 p-md-3 p-2">
          <div className="card shadow-sm p-4">
          <div className="mb-3">
                <button
                  className="btn btn-light shadow-sm border rounded-pill px-4 py-2"
                  onClick={() => navigate(`/order-details/${id}`)}
                  style={{ fontSize: "0.9rem", fontWeight: "500" }}
                >
                  ← Back
                </button>
              </div>
            {/* Printable area */}
            <div ref={invoiceRef} className="p-4 print-area">
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <img src="/brandLogo.jpeg" alt="Sonehat" width="100" />
                  <p className="mb-0 mt-3">Email: support@sonehat.com</p>
                  <p className="mb-0">Customer Care: +91-XXXXXXXXXX</p>
                </div>
                <div className="text-end">
                  <h3 className="" style={{ color: "rgb(242,92,20)" }}>INVOICE</h3>
                  <p className="mb-0">
                    #INV-{order?._id?.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="fw-bold">Bill To</h6>
                  <p className="mb-0 fw-bold" style={{ color: "rgb(242,92,20)" }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="mb-0">{user.email}</p>

                  <p className="mb-0">
                    {address.area}, {address.city}
                  </p>
                  <p className="mb-0">
                    {address.state} - {address.pincode}
                  </p>
                  <p className="mb-0">{address.landmark}</p>
                  <p className="mb-0 mt-2">
                    <strong>Mobile:</strong> {address.phone}{" "} / {address.alternatePhone}
                  </p>
                </div>
                <div className="col-md-6 text-end">
                  <p>
                    Invoice Date:{" "}
                    {moment(order.createdAt).format("DD MMM YYYY")}
                  </p>
                  <p>Payment Mode: {order.modeOfPayment}</p>
                </div>
              </div>

              <table className="table table-bordered">
                <thead style={{ backgroundColor: "rgb(242,92,20)", color: "#fff" }}>
                  <tr>
                    <th>#</th>
                    <th>Item & Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, i) => {
                    const price =
                      item?.productId?.discountedPrice ||
                      item?.productId?.price ||
                      0;

                    const variantText = item?.selectedVariant
                      ? `${item.selectedVariant.variantKey}: ${item.selectedVariant.variantValue}`
                      : "N/A";

                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item?.productId?.productHeroImage}
                              alt="product"
                              style={{ width: 50 }}
                            />
                            <div className="ms-3">
                              <strong>{item?.productId?.name}</strong>
                              {/* 🆕 show variant below the name */}
                              <div style={{ fontSize: "13px", color: "#555" }}>
                                Variant: {variantText}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>₹{price.toFixed(2)}</td>
                        <td>₹{(price * item.quantity).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-end mt-3">
                <p className="mb-1">Sub Total: ₹{subTotal.toFixed(2)}</p>
                <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
                <h5 className="fw-bold" style={{ color: "rgb(242,92,20)" }}>
                  Grand Total: ₹{totalAmount.toFixed(2)}
                </h5>
              </div>

              <div className="mt-4">
                <p className="fw-bold mb-1">Terms & Conditions</p>
                <p className="text-muted small">
                  1. Delivery timelines may vary due to weather or logistics
                  issues. <br />
                  2. Full payment required for dispatch (if Online). <br />
                  3. Goods once sold will not be returned or exchanged. <br />
                  4. Thank you for shopping with Sonehat!
                </p>
              </div>
            </div>

            {/* Only print button */}
            {/* <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-success" onClick={handlePrint}>
                <i className="fa fa-print me-2"></i>Print
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoice;
