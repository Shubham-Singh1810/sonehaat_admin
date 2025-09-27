import React, { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getProductDetailsServ,
  updateProductServ,
} from "../../services/product.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import Select from "react-select";
import {
  getCategoryServ,
  getCategoryDetailsServ,
} from "../../services/category.service";
import { getZipcodeServ } from "../../services/zipcode.service";
import { getBrandServ } from "../../services/brand.services";
import { useParams, useNavigate } from "react-router-dom";
import { getNlevelCategoryTreeServ } from "../../services/nLevelCategory.service";

function ProductUpdateStep2() {
  const params = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const contentRef = useRef("");

  const config = { placeholder: "Start typing...", height: "400px" };

  const [formData, setFormData] = useState({
    minOrderQuantity: "",
    maxOrderQuantity: "",
    warrantyPeriod: "",
    guaranteePeriod: "",
    categoryId: "",
    subCategoryId: "",
    nLevelCategoryId: "", // single id
    stockQuantity: "",
    brandId: "",
    zipcodeId: [],
    isProductReturnable: "",
    isCodAllowed: "",
    isProductTaxIncluded: "",
    isProductCancelable: "",
    productVideoUrl: "",
    description: "",
    price: "",
    discountedPrice: "",
  });

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [zipcodeList, setZipcodeList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [content, setContent] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);

  // N-Level related (single-select)
  const [nLevelTree, setNLevelTree] = useState([]);
  const [nLevelLoading, setNLevelLoading] = useState(false);
  const [nLevelModalOpen, setNLevelModalOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [selectedNLevelId, setSelectedNLevelId] = useState(null); // single selection
  const [lastClicked, setLastClicked] = useState(null); // for breadcrumb preview

  // Lookup by id
  const nodeIndex = useMemo(() => {
    const idx = {};
    const walk = (arr, parent = null) => {
      arr?.forEach((n) => {
        idx[n._id] = { ...n, parent };
        if (Array.isArray(n.children) && n.children.length) walk(n.children, n);
      });
    };
    walk(nLevelTree);
    return idx;
  }, [nLevelTree]);

  const getCategoryFunc = async () => {
    try {
      const response = await getCategoryServ({ status: true });
      if (response?.data?.statusCode == "200")
        setCategoryList(response?.data?.data);
    } catch {}
  };

  const getSubCategoryFunc = async (categoryId) => {
    try {
      if (!categoryId) return;
      const res = await getCategoryDetailsServ(categoryId);
      if (res?.data?.statusCode == "200")
        setSubCategoryList(res?.data?.data?.SubCategoryList || []);
    } catch {}
  };

  const getZipcodeFunc = async () => {
    try {
      const response = await getZipcodeServ();
      if (response?.data?.statusCode == "200")
        setZipcodeList(response?.data?.data || []);
    } catch {}
  };

  const getBrandList = async () => {
    try {
      const response = await getBrandServ({ status: true });
      if (response?.data?.statusCode == "200")
        setBrandList(response?.data?.data || []);
    } catch {}
  };

  const getProductDetails = async () => {
    const response = await getProductDetailsServ(params?.id);
    if (response?.data?.statusCode == "200") {
      const d = response?.data?.data || {};
      const categoryId = d?.categoryId?._id
        ? String(d.categoryId._id)
        : typeof d?.categoryId === "string"
        ? d.categoryId
        : "";
      const subCategoryId = d?.subCategoryId?._id
        ? String(d.subCategoryId._id)
        : typeof d?.subCategoryId === "string"
        ? d.subCategoryId
        : "";
      const brandId = d?.brandId?._id
        ? String(d.brandId._id)
        : typeof d?.brandId === "string"
        ? d.brandId
        : "";
      const zipcodeId = Array.isArray(d?.zipcodeId)
        ? d.zipcodeId.map((z) => (z?._id ? String(z._id) : String(z)))
        : [];

      // Accept legacy array or single, then enforce single in UI
      const raw = Array.isArray(d?.nLevelCategoryIds)
        ? d.nLevelCategoryIds
        : d?.nLevelCategoryId
        ? [d.nLevelCategoryId]
        : [];
      const firstN = raw.length ? String(raw[0]?._id || raw[0]) : "";

      setFormData((prev) => ({
        ...prev,
        minOrderQuantity: d?.minOrderQuantity ?? "",
        maxOrderQuantity: d?.maxOrderQuantity ?? "",
        warrantyPeriod: d?.warrantyPeriod ?? "",
        guaranteePeriod: d?.guaranteePeriod ?? "",
        categoryId,
        subCategoryId,
        nLevelCategoryId: firstN, // single value
        stockQuantity: d?.stockQuantity ?? "",
        brandId,
        zipcodeId,
        isProductReturnable: Boolean(d?.isProductReturnable),
        isCodAllowed: Boolean(d?.isCodAllowed),
        isProductTaxIncluded: Boolean(d?.isProductTaxIncluded),
        isProductCancelable: Boolean(d?.isProductCancelable),
        productVideoUrl: d?.productVideoUrl ?? "",
        description: d?.description ?? "",
        price: d?.price ?? "",
        discountedPrice: d?.discountedPrice ?? "",
      }));

      if (categoryId) await getSubCategoryFunc(categoryId);
      if (subCategoryId) await loadNLevelTree(subCategoryId);

      setSelectedNLevelId(firstN || null);
      setContent(d?.description ?? "");
      contentRef.current = d?.description ?? "";
    }
  };

  const loadNLevelTree = async (subCategoryId) => {
    if (!subCategoryId) {
      setNLevelTree([]);
      setSelectedNLevelId(null);
      setFormData((p) => ({ ...p, nLevelCategoryId: "" }));
      return;
    }
    try {
      setNLevelLoading(true);
      const res = await getNlevelCategoryTreeServ(subCategoryId);
      if (res?.data?.statusCode == "200") {
        const tree = Array.isArray(res?.data?.data) ? res.data.data : [];
        setNLevelTree(tree);
      }
    } catch (e) {
      toast.error("Failed to load N-Level categories");
    } finally {
      setNLevelLoading(false);
    }
  };

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSelectNode = (node) => {
    const id = node?._id;
    setLastClicked(node);
    setSelectedNLevelId((prev) => (prev === id ? null : id)); // single toggle
  };

  const applyNLevelSelection = () => {
    const id = selectedNLevelId || "";
    setFormData((prev) => ({ ...prev, nLevelCategoryId: id }));
    setNLevelModalOpen(false);
  };

  const clearNLevelSelection = () => {
    setSelectedNLevelId(null);
    setFormData((prev) => ({ ...prev, nLevelCategoryId: "" }));
  };

  const selectedBreadcrumb = useMemo(() => {
    if (!lastClicked || !nodeIndex[lastClicked._id]) return [];
    const crumbs = [];
    let cur = nodeIndex[lastClicked._id];
    while (cur) {
      crumbs.unshift({ _id: cur._id, name: cur.name });
      cur = cur.parent ? nodeIndex[cur.parent._id] : null;
    }
    return crumbs;
  }, [lastClicked, nodeIndex]);

  useEffect(() => {
    getCategoryFunc();
    getZipcodeFunc();
    getBrandList();
    getProductDetails();
  }, []);

  useEffect(() => {
    if (formData?.categoryId) {
      setFormData((p) => ({ ...p, subCategoryId: "", nLevelCategoryId: "" }));
      setSubCategoryList([]);
      setNLevelTree([]);
      setSelectedNLevelId(null);
      getSubCategoryFunc(formData.categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.categoryId]);

  const prevSubRef = useRef("");
  useEffect(() => {
    const current = formData?.subCategoryId || "";
    loadNLevelTree(current);
    if (prevSubRef.current && prevSubRef.current !== current) {
      setSelectedNLevelId(null);
      setFormData((p) => ({ ...p, nLevelCategoryId: "" }));
    }
    prevSubRef.current = current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.subCategoryId]);

  const normalizeBooleans = (d) => ({
    ...d,
    isProductReturnable:
      d.isProductReturnable === true || d.isProductReturnable === "true",
    isCodAllowed: d.isCodAllowed === true || d.isCodAllowed === "true",
    isProductTaxIncluded:
      d.isProductTaxIncluded === true || d.isProductTaxIncluded === "true",
    isProductCancelable:
      d.isProductCancelable === true || d.isProductCancelable === "true",
  });

  const updateProductFunc = async () => {
    setBtnLoader(true);
    try {
      const payload = {
        ...normalizeBooleans(formData),
        _id: String(params?.id),
        categoryId: formData.categoryId || null,
        subCategoryId: formData.subCategoryId || null,
        nLevelCategoryId: formData.nLevelCategoryId || null, // single
        brandId: formData.brandId || null,
        zipcodeId: Array.isArray(formData.zipcodeId) ? formData.zipcodeId : [],
        description: contentRef.current ?? "",
      };
      Object.keys(payload).forEach(
        (k) => payload[k] === null && delete payload[k]
      );

      const response = await updateProductServ(payload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/update-product-step3/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setBtnLoader(false);
    }
  };

  // Tree Node row (checkbox visual but single-select)
  const TreeNode = ({ node, depth = 0 }) => {
    const hasChildren =
      Array.isArray(node.children) && node.children.length > 0;
    const isOpen = !!expanded[node._id];
    const isChecked = selectedNLevelId === node._id;

    return (
      <div style={{ paddingLeft: depth * 12, marginBottom: 6 }}>
        <div
          className="d-flex align-items-center"
          style={{
            background: isChecked ? "#f0fffa" : "#fff",
            borderRadius: 10,
            padding: "8px 10px",
            border: "1px solid #e9ecef",
            cursor: "default",
          }}
        >
          {hasChildren ? (
            <button
              type="button"
              className="btn btn-sm me-2"
              onClick={() => toggleExpand(node._id)}
              style={{ width: 28, height: 28, lineHeight: "1" }}
            >
              <span style={{ fontSize: 14, color: "#6c757d" }}>
                {isOpen ? "▼" : "►"}
              </span>
            </button>
          ) : (
            <span
              className="me-2"
              style={{ width: 28, textAlign: "center", color: "#adb5bd" }}
            >
              •
            </span>
          )}

          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={isChecked}
            onChange={() => toggleSelectNode(node)}
            style={{ width: 16, height: 16, cursor: "pointer" }}
          />

          <img
            src={node.image || "https://via.placeholder.com/28"}
            alt={node.name}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              objectFit: "cover",
              marginRight: 8,
              border: "1px solid #eee",
            }}
            onClick={() => toggleSelectNode(node)}
          />

          <div
            className="flex-grow-1"
            onClick={() => toggleSelectNode(node)}
            style={{ userSelect: "none", cursor: "pointer" }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, color: "#212529" }}>
              {node.name}
            </div>
            <div style={{ fontSize: 11, color: "#868e96" }}>{node._id}</div>
          </div>
        </div>

        {hasChildren && isOpen && (
          <div style={{ marginTop: 6 }}>
            {node.children.map((c) => (
              <TreeNode key={c._id} node={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const NLevelPickerModal = () => {
    if (!nLevelModalOpen) return null;
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
      >
        <div
          className="d-flex flex-column"
          style={{
            width: "min(920px, 96vw)",
            height: "640px",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header with × icon */}
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            style={{ borderBottom: "1px solid #eee", flex: "0 0 auto" }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                Select N‑Level Category
              </div>
              <div style={{ fontSize: 12, color: "#777" }}>
                Pick exactly one node from the tree
              </div>
            </div>
            <button
              className="btn btn-link text-muted p-0"
              onClick={() => setNLevelModalOpen(false)}
              aria-label="Close"
              title="Close"
              style={{
                fontSize: 24,
                lineHeight: 1,
                textDecoration: "none",
              }}
            >
              ×
            </button>
          </div>

          {/* Subheader: breadcrumb of last clicked */}
          <div
            className="px-3 py-2"
            style={{ borderBottom: "1px solid #f3f3f3", flex: "0 0 auto" }}
          >
            <div className="d-flex align-items-center flex-wrap">
              <span style={{ fontSize: 12, color: "#999", marginRight: 8 }}>
                Path:
              </span>
              {(() => {
                const crumbs = [];
                if (lastClicked && nodeIndex[lastClicked._id]) {
                  let cur = nodeIndex[lastClicked._id];
                  while (cur) {
                    crumbs.unshift({ _id: cur._id, name: cur.name });
                    cur = cur.parent ? nodeIndex[cur.parent._id] : null;
                  }
                }
                return crumbs.length ? (
                  crumbs.map((c, i) => (
                    <span key={c._id} style={{ fontSize: 13, color: "#333" }}>
                      {c.name}
                      {i < crumbs.length - 1 ? " / " : ""}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: "#999" }}>—</span>
                );
              })()}
            </div>
          </div>

          {/* Body (scrollable) */}
          <div
            className="p-3"
            style={{
              flex: "1 1 auto",
              overflow: "auto",
              background: "#fafafa",
            }}
          >
            {nLevelLoading ? (
              <div className="text-center text-muted py-5">Loading...</div>
            ) : nLevelTree?.length ? (
              nLevelTree.map((root) => <TreeNode key={root._id} node={root} />)
            ) : (
              <div className="text-center text-muted py-5">
                No N‑Level categories found
              </div>
            )}
          </div>

          {/* Footer (sticky) */}
          <div
            className="px-3 py-2 d-flex align-items-center justify-content-between"
            style={{
              borderTop: "1px solid #eee",
              background: "#fff",
              flex: "0 0 auto",
            }}
          >
            <div
              className="d-flex flex-wrap"
              style={{ gap: 8, maxWidth: "65%", overflow: "hidden" }}
            >
              {selectedNLevelId ? (
                <span
                  className="badge text-dark"
                  style={{
                    background: "#e6f2ff",
                    border: "1px solid #90caf9",
                    color: "#0d47a1",
                    // borderRadius: 16,
                    padding: "6px 10px",
                    fontWeight: 600,
                  }}
                >
                  {nodeIndex[selectedNLevelId]?.name || selectedNLevelId}
                </span>
              ) : (
                <span className="text-muted" style={{ fontSize: 13 }}>
                  None selected
                </span>
              )}
            </div>

            <div className="d-flex" style={{ gap: 8 }}>
              <button
                className="btn btn-outline-danger"
                onClick={clearNLevelSelection}
              >
                Clear
              </button>
              <button
                className="btn btn-primary"
                style={{ color: "#fff",
                  border: "none",
                  // borderRadius: "24px",
                  background:
                    "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                  boxShadow: "0 4px 12px rgba(255,103,30,0.45)", }}
                onClick={applyNLevelSelection}
                disabled={!selectedNLevelId}
              >
                Use Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="d-flex">
                <h4
                  className="p-2 text-dark shadow rounded mb-4"
                  style={{ background: "#e6f2ff" }}
                >
                  Update Product : Step 2/4
                </h4>
              </div>
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label>Min Order Quantity</label>
                <input
                  className="form-control"
                  value={formData?.minOrderQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrderQuantity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Max Order Quantity</label>
                <input
                  className="form-control"
                  value={formData?.maxOrderQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxOrderQuantity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Warranty Period</label>
                <input
                  className="form-control"
                  value={formData?.warrantyPeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, warrantyPeriod: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Guarantee Period</label>
                <input
                  className="form-control"
                  value={formData?.guaranteePeriod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guaranteePeriod: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Stock Quantity</label>
                <input
                  className="form-control"
                  value={formData?.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Brand</label>
                <select
                  className="form-control"
                  value={formData?.brandId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brandId: String(e.target.value),
                    })
                  }
                >
                  <option>Select</option>
                  {brandList?.map((v) => (
                    <option key={v?._id} value={String(v?._id)}>
                      {v?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 mb-3">
                <label>Select Category</label>
                <select
                  className="form-control"
                  value={formData?.categoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: String(e.target.value),
                    })
                  }
                >
                  <option>Select</option>
                  {categoryList?.map((v) => (
                    <option key={v?._id} value={String(v?._id)}>
                      {v?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 mb-3">
                <label>Select Sub Category</label>
                <select
                  className="form-control"
                  value={formData?.subCategoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subCategoryId: String(e.target.value),
                    })
                  }
                  disabled={!formData?.categoryId}
                >
                  <option>Select</option>
                  {subCategoryList?.map((v) => (
                    <option key={v?._id} value={String(v?._id)}>
                      {v?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* N-Level single-select */}
              <div className="col-12 mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <label className="mb-1">N‑Level Category</label>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      Select one to precisely place the product
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm d-inline-flex align-items-center"
                      onClick={() => {
                        if (!formData?.subCategoryId || nLevelLoading) return;
                        setSelectedNLevelId(formData.nLevelCategoryId || null);
                        setNLevelModalOpen(true);
                      }}
                      disabled={!formData?.subCategoryId || nLevelLoading}
                      aria-busy={nLevelLoading ? "true" : "false"}
                      aria-disabled={
                        !formData?.subCategoryId || nLevelLoading
                          ? "true"
                          : "false"
                      }
                      title={
                        !formData?.subCategoryId
                          ? "Select Sub Category first"
                          : nLevelLoading
                          ? "Loading N‑Level categories..."
                          : "Select N‑Level category"
                      }
                      style={{
                        border: "none",
                        // borderRadius: 10,
                        padding: "8px 14px",
                        fontWeight: 600,
                        letterSpacing: 0.2,
                        transition: "all .2s ease",
                        color: "#fff",
                        background:
                          !formData?.subCategoryId || nLevelLoading
                            ? "linear-gradient(180deg,#ffd6bf,#ffc5a6)"
                            : "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                        boxShadow:
                          !formData?.subCategoryId || nLevelLoading
                            ? "none"
                            : "0 4px 12px rgba(255,103,30,0.45)",
                        cursor:
                          !formData?.subCategoryId || nLevelLoading
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          !formData?.subCategoryId || nLevelLoading ? 0.9 : 1,
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        if (!formData?.subCategoryId || nLevelLoading) return;
                        e.currentTarget.style.background =
                          "linear-gradient(180deg, rgb(255,113,50), rgb(242,100,30))";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(255,103,30,0.55)";
                      }}
                      onMouseLeave={(e) => {
                        if (!formData?.subCategoryId || nLevelLoading) return;
                        e.currentTarget.style.background =
                          "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(255,103,30,0.45)";
                      }}
                      onMouseDown={(e) => {
                        if (!formData?.subCategoryId || nLevelLoading) return;
                        e.currentTarget.style.transform = "translateY(1px)";
                      }}
                      onMouseUp={(e) => {
                        if (!formData?.subCategoryId || nLevelLoading) return;
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {nLevelLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                            style={{ width: 16, height: 16, borderWidth: 2 }}
                          />
                          Loading...
                        </>
                      ) : (
                        <>
                          {formData?.nLevelCategoryId ? "Change" : "Choose"} N‑Level
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Selected pill */}
                {formData?.nLevelCategoryId ? (
                  <div
                    className="mt-2 d-flex align-items-center"
                    style={{ gap: 8 }}
                  >
                    <span
                      className="badge text-dark"
                      style={{
                        background: "#e6f2ff",
                        border: "1px solid #90caf9",
                        color: "#0d47a1",
                        // borderRadius: 16,
                        padding: "10px 8px",
                        fontWeight: 600,
                      }}
                    >
                      {nodeIndex[formData.nLevelCategoryId]?.name ||
                        formData.nLevelCategoryId}
                    </span>
                    <button
                      className="btn btn-link text-danger p-0 ms-2"
                      onClick={() =>
                        setFormData((p) => ({ ...p, nLevelCategoryId: "" }))
                      }
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                    No N‑Level selected
                  </div>
                )}
              </div>

              <div className="col-6 mb-3">
                <label>Select Deliverable Zipcodes</label>
                <Select
                  isMulti
                  options={zipcodeList?.map((v) => ({
                    label: v?.zipcode,
                    value: String(v?._id),
                  }))}
                  value={zipcodeList
                    .filter((v) => formData.zipcodeId.includes(String(v?._id)))
                    .map((v) => ({ label: v?.zipcode, value: String(v?._id) }))}
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      zipcodeId: selected.map((o) => String(o.value)),
                    })
                  }
                  classNamePrefix="select"
                />
              </div>

              <div className="col-6 mb-3">
                <label>Product Price</label>
                <input
                  className="form-control"
                  value={formData?.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Product Discounted Price</label>
                <input
                  className="form-control"
                  value={formData?.discountedPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountedPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Video URL</label>
                <input
                  className="form-control"
                  value={formData?.productVideoUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productVideoUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label>Product Returnable</label>
                <select
                  className="form-control"
                  value={String(formData?.isProductReturnable)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isProductReturnable: e.target.value === "true",
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label>Product COD Allowed</label>
                <select
                  className="form-control"
                  value={String(formData?.isCodAllowed)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isCodAllowed: e.target.value === "true",
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label>Product Tax Included</label>
                <select
                  className="form-control"
                  value={String(formData?.isProductTaxIncluded)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isProductTaxIncluded: e.target.value === "true",
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label>Product Cancelable</label>
                <select
                  className="form-control"
                  value={String(formData?.isProductCancelable)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isProductCancelable: e.target.value === "true",
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-12 mb-3">
                <label>Product Description</label>
                <JoditEditor
                  ref={editor}
                  config={config}
                  value={content}
                  onChange={(newContent) => {
                    contentRef.current = newContent;
                    setContent(newContent);
                  }}
                />
              </div>

              <div className="col-12">
                <button
                  className="btn w-100"
                  style={{
                    color: "#fff",
                    border: "none",
                    borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgb(255,103,30), rgb(242,92,20))",
                    boxShadow: "0 4px 12px rgba(255,103,30,0.45)",
                  }}
                  onClick={updateProductFunc}
                  disabled={btnLoader}
                >
                  {btnLoader ? "Updating ..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <NLevelPickerModal />
      </div>
    </div>
  );
}

export default ProductUpdateStep2;
