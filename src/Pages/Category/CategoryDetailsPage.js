// ...imports remain the same
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { getCategoryDetailsServ } from "../../services/category.service";
import {
  getNlevelCategoryTreeServ,
  createNlevelCategoryServ,
  updateNlevelCategoryServ,
  deleteNlevelCategoryServ,
} from "../../services/nLevelCategory.service";
import { AiOutlinePlus } from "react-icons/ai";

function CategoryDetailsPage() {
  const { id: categoryId } = useParams();
  const location = useLocation();
  const initDetails = location.state?.details || null;

  const [categoryDetails, setCategoryDetails] = useState(
    initDetails?.CategoryDetails || null
  );
  const [subCategoryList, setSubCategoryList] = useState(
    initDetails?.SubCategoryList || []
  );
  const [showSubListSkeleton, setShowSubListSkeleton] = useState(!initDetails);

  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [tree, setTree] = useState([]);
  const [path, setPath] = useState([]);
  const [showTreeSkeleton, setShowTreeSkeleton] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [addFormData, setAddFormData] = useState({
    show: false,
    name: "",
    image: null,
    imgPrev: "",
    status: "",
    levelIndex: 0,
    parentId: null,
  });
  const [editFormData, setEditFormData] = useState({
    show: false,
    _id: "",
    name: "",
    image: null,
    imgPrev: "",
    status: "",
    levelIndex: 0,
    parentId: null,
  });

  useEffect(() => {
    if (!selectedSubCat && Array.isArray(subCategoryList) && subCategoryList.length > 0) {
        const first = subCategoryList[0];
        setSelectedSubCat(first);
        setShowTreeSkeleton(true);
        fetchTree(first._id);
      }
    const loadCategoryBundle = async () => {
      if (categoryDetails && Array.isArray(subCategoryList)) {
        setShowSubListSkeleton(false);
        return;
      }
      try {
        setShowSubListSkeleton(true);
        const res = await getCategoryDetailsServ(categoryId);
        const details = res?.data?.data;
        setCategoryDetails(details?.CategoryDetails || null);
        setSubCategoryList(details?.SubCategoryList || []);
      } catch (e) {
        toast.error("Failed to load category details");
      } finally {
        setShowSubListSkeleton(false);
      }
    };
    loadCategoryBundle();
  }, [categoryId], [subCategoryList]);

  const fetchTree = async (subCatId) => {
    setShowTreeSkeleton(true);
    try {
      const res = await getNlevelCategoryTreeServ(subCatId);
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data || [];
        setTree(data);
        setPath(data.length ? [data[0]._id] : []);
      } else {
        toast.error(res?.data?.message || "Failed to fetch N-level tree");
      }
    } catch (err) {
      toast.error("Failed to fetch N-level tree");
    }
    setShowTreeSkeleton(false);
  };

  const handleSubClick = (sub) => {
    setSelectedSubCat(sub);
    fetchTree(sub._id);
  };

  const levels = useMemo(() => {
    const arr = [];
    let current = tree;
    for (let i = 0; i <= path.length; i++) {
      arr.push(current);
      const selectedId = path[i];
      const selectedNode = current?.find?.((n) => n._id === selectedId);
      if (!selectedNode) break;
      current = selectedNode.children || [];
    }
    return arr;
  }, [tree, path]);

  const handleSelect = (levelIndex, id) => {
    setPath((prev) => {
      const newPath = prev.slice(0, levelIndex);
      newPath[levelIndex] = id;
      return newPath;
    });
  };

  const getSelectedNodeAtLevel = (list, selectedId) =>
    list?.find?.((n) => n._id === selectedId);

  const openAddModal = (levelIndex, parentId = null) => {
    if (!selectedSubCat?._id) return toast.error("Select a subcategory first");
    setAddFormData({
      show: true,
      name: "",
      image: null,
      imgPrev: "",
      status: "",
      levelIndex,
      parentId,
    });
  };

  const handleAddCategoryFunc = async () => {
    if (!addFormData.name || !addFormData.image || !addFormData.status) return;
    const formData = new FormData();
    formData.append("name", addFormData.name);
    formData.append("status", addFormData.status);
    formData.append("image", addFormData.image);
    formData.append("parent", addFormData.parentId || "");
    formData.append("subCategoryId", selectedSubCat._id);
    try {
      setIsSaving(true);
      const res = await createNlevelCategoryServ(formData);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Category added");
        setAddFormData((s) => ({ ...s, show: false }));
        await fetchTree(selectedSubCat._id);
      }
    } catch {
      toast.error("Failed to add category");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (levelIndex, parentId, category) => {
    setEditFormData({
      show: true,
      _id: category._id,
      name: category.name,
      image: null,
      imgPrev: category.image || "",
      status: category.status,
      levelIndex,
      parentId,
    });
  };

  const handleEditCategoryFunc = async () => {
    if (!editFormData.name || editFormData.status === "") return;
    const formData = new FormData();
    formData.append("name", editFormData.name);
    formData.append("status", editFormData.status);
    formData.append("parent", editFormData.parentId || "");
    formData.append("subCategoryId", selectedSubCat._id);
    if (editFormData.image) formData.append("image", editFormData.image);
    try {
      setIsSaving(true);
      const res = await updateNlevelCategoryServ(editFormData._id, formData);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Category updated");
        setEditFormData((s) => ({ ...s, show: false }));
        await fetchTree(selectedSubCat._id);
      }
    } catch {
      toast.error("Failed to update category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategoryFunc = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      setIsSaving(true);
      const res = await deleteNlevelCategoryServ(categoryId);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Category deleted");
        await fetchTree(selectedSubCat._id);
      }
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setIsSaving(false);
    }
  };

  const SubBoxSkeleton = () => (
    <div
      style={{
        width: "150px",
        border: "1px solid #e5e5e5",
        borderRadius: "10px",
        background: "#fff",
        textAlign: "center",
        padding: "0.75rem 0.5rem",
        margin: "0 auto",
      }}
    >
      <Skeleton
        circle
        width={65}
        height={65}
        style={{ display: "block", margin: "0 auto 8px" }}
      />
      <Skeleton width={100} height={16} style={{ margin: "0 auto" }} />
      <Skeleton
        width={90}
        height={30}
        style={{ margin: "8px auto 0", borderRadius: 999 }}
      />
    </div>
  );

  const CardSkeleton = () => (
    <div
      style={{
        flex: "0 0 150px",
        width: "150px",
        border: "1px solid #e5e5e5",
        borderRadius: "10px",
        background: "#fff",
        textAlign: "center",
        padding: "0.75rem 0.5rem",
        boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Skeleton circle width={65} height={65} style={{ margin: "0 auto 8px" }} />
      <Skeleton width={100} height={16} style={{ margin: "0 auto" }} />
      <div className="d-flex justify-content-center gap-2 mt-2">
        <Skeleton width={30} height={30} />
        <Skeleton width={30} height={30} />
      </div>
      <Skeleton width={90} height={30} style={{ margin: "8px auto 0", borderRadius: 999 }} />
    </div>
  );
  

  const ColumnSkeleton = () => (
    <div
      className="d-flex"
      style={{ gap: "1rem", overflowX: "auto", padding: "0.5rem 24px 0.5rem 0", flexWrap: "nowrap" }}
    >
      {[1, 2, 3, 4].map((k) => (
        <CardSkeleton key={k} />
      ))}
      <div
        style={{
          flex: "0 0 150px",
          width: "150px",
          height: "150px",
          border: "1px dashed #bbb",
          borderRadius: "10px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Skeleton width={50} height={50} />
      </div>
    </div>
  );
  

  // Styled header components
  const Title = ({ text, image }) => (
    <div style={{ position: "relative", marginBottom: "18px" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          borderRadius: "14px",
          background:
            "linear-gradient(135deg, rgba(13,110,253,0.12), rgba(25,135,84,0.10))",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(13,110,253,0.18)",
          boxShadow: "0 8px 24px rgba(13,110,253,0.12)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(13,110,253,0.2), rgba(25,135,84,0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0d6efd",
            fontWeight: 700,
            fontSize: 16,
          }}
          title="Category"
        >
          C
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {image ? (
            <img
              src={image}
              alt="category"
              style={{
                width: 34,
                height: 34,
                objectFit: "cover",
                borderRadius: "50%",
                boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                border: "2px solid #fff",
              }}
            />
          ) : null}
          <h2
            className="mb-0"
            style={{
              fontSize: "28px",
              lineHeight: 1.2,
              letterSpacing: "0.2px",
              background:
                "linear-gradient(90deg, #0d6efd 0%, #6610f2 35%, #20c997 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 1px 0 rgba(0,0,0,0.06)",
            }}
            title={text}
          >
            {text}
          </h2>
        </div>
      </div>
      <div
        style={{
          height: 3,
          width: 180,
          background:
            "linear-gradient(90deg, rgba(13,110,253,0.35), rgba(102,16,242,0.35), rgba(32,201,151,0.35))",
          borderRadius: 999,
          marginTop: 10,
          boxShadow: "0 2px 10px rgba(13,110,253,0.25)",
        }}
      />
    </div>
  );

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Categories" selectedItem="Main Categories" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-4">
          {categoryDetails ? (
            <Title
              text={categoryDetails?.name}
              image={categoryDetails?.image}
            />
          ) : (
            <div style={{ marginBottom: 18 }}>
              <Skeleton width={260} height={36} />
              <Skeleton
                width={180}
                height={6}
                style={{ marginTop: 10, borderRadius: 999 }}
              />
            </div>
          )}

          <p className="text-muted mb-4">
            Select a sub-category to view its N-level categories
          </p>

          <div className="row">
            <div className="col-md-3">
              <h5>Sub-Categories</h5>
              <div
                className="d-flex flex-column"
                style={{
                  minWidth: "190px",
                  maxWidth: "220px",
                  gap: "1rem",
                  border: "1px solid #e0e0e0",
                  padding: "0.75rem",
                  background: "#fff",
                  borderRadius: "8px",
                }}
              >
                {showSubListSkeleton
                  ? [1, 2, 3, 4, 5].map((k) => <SubBoxSkeleton key={k} />)
                  : subCategoryList?.map((sub) => {
                      const isSelected = selectedSubCat?._id === sub._id;
                      return (
                        <div
                          key={sub._id}
                          style={{
                            width: "150px",
                            border: isSelected
                              ? "2px solid #0d6efd"
                              : "1px solid #e5e5e5",
                            borderRadius: "10px",
                            background: "#fff",
                            textAlign: "center",
                            padding: "0.75rem 0.5rem",
                            boxShadow: isSelected
                              ? "0 6px 14px rgba(0,0,0,0.15)"
                              : "0 3px 8px rgba(0,0,0,0.08)",
                            transition: "all 0.25s ease",
                            margin: "0 auto",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSubClick(sub)}
                          title={sub.name}
                        >
                          <img
                            src={sub.image || "https://via.placeholder.com/70"}
                            alt={sub.name}
                            style={{
                              width: "65px",
                              height: "65px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              marginBottom: "0.5rem",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              color: isSelected ? "#0d6efd" : "#333",
                              wordBreak: "break-word",
                            }}
                          >
                            {sub.name}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            <div className="col-md-9">
              {selectedSubCat && (
                <h5 className="mb-3">N-Level of: {selectedSubCat.name}</h5>
              )}

              {showTreeSkeleton ? (
                <div style={{ overflowX: "hidden", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <ColumnSkeleton />
                  <ColumnSkeleton />
                  <ColumnSkeleton />
                </div>
              ) : tree.length === 0 ? (
                selectedSubCat ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center py-5"
                    style={{ border: "1px dashed #c9c9c9", background: "#fff" }}
                  >
                    <p className="text-muted mb-3">
                      No categories found. Create the first category to get
                      started.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => openAddModal(0, null)}
                    >
                      + Add First Category
                    </button>
                  </div>
                ) : (
                  <p className="text-muted">
                    Select a Sub-Category to view data.
                  </p>
                )
              ) : (
                levels.map((list, idx) => {
                  const selectedId = path[idx];
                  if (idx > 0) {
                    const prevList = levels[idx - 1] || [];
                    const prevSelectedId = path[idx - 1];
                    const prevSelected = getSelectedNodeAtLevel(
                      prevList,
                      prevSelectedId
                    );
                    const prevHasChildren = !!(
                      prevSelected &&
                      prevSelected.children &&
                      prevSelected.children.length > 0
                    );
                    if (!prevHasChildren) return null;
                  }

                  return (
                    <div
                      key={idx}
                      className="d-flex"
                      style={{
                        gap: "1rem",
                        overflowX: "auto",
                        padding: "0.5rem 24px 0.5rem 0",
                        flexWrap: "nowrap",
                        alignItems: "flex-start",
                        alignContent: "flex-start",
                        scrollSnapType: "x proximity",
                        scrollbarWidth: "thin",
                      }}
                    >
                      {list.map((cat) => {
                        const isSelected = selectedId === cat._id;
                        const hasChildren =
                          cat.children && cat.children.length > 0;
                        return (
                          <div
                            key={cat._id}
                            style={{
                              width: "150px",
                              border: isSelected
                                ? "2px solid #0d6efd"
                                : "1px solid #e5e5e5",
                              borderRadius: "10px",
                              background: "#fff",
                              textAlign: "center",
                              padding: "0.75rem 0.5rem",
                              boxShadow: isSelected
                                ? "0 6px 14px rgba(0,0,0,0.15)"
                                : "0 3px 8px rgba(0,0,0,0.08)",
                              transition: "all 0.25s ease",
                            }}
                          >
                            <div
                              onClick={() => handleSelect(idx, cat._id)}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={
                                  cat.image || "https://via.placeholder.com/70"
                                }
                                alt={cat.name}
                                style={{
                                  width: "65px",
                                  height: "65px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  marginBottom: "0.5rem",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                }}
                              />
                              <div
                                style={{
                                  fontSize: "0.9rem",
                                  fontWeight: "600",
                                  color: isSelected ? "#0d6efd" : "#333",
                                  wordBreak: "break-word",
                                }}
                              >
                                {cat.name}
                              </div>
                            </div>

                            <div
                              className="categoryNlevel d-flex justify-content-center gap-2 mt-2"
                              style={{ fontSize: "0.85rem" }}
                            >
                              <button
                                className="btn btn-sm shadow-sm"
                                title="Edit"
                                style={{
                                  //   backgroundColor: "#1e88e5",
                                  //   color: "#fff",
                                  borderRadius: "10px",
                                  border: "none",
                                  padding: "4px 10px",
                                  fontSize: "0.8rem",
                                  minWidth: "50px",
                                  transition: "all 0.2s ease",
                                }}
                                onClick={() =>
                                  openEditModal(idx, path[idx - 1] || null, cat)
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm shadow-sm"
                                title="Delete"
                                style={{
                                  //   backgroundColor: "rgb(255, 103, 30)",
                                  //   color: "#fff",
                                  border: "none",
                                  padding: "4px 10px",
                                  borderRadius: "10px",
                                  fontSize: "0.8rem",
                                  minWidth: "50px",
                                  transition: "all 0.2s ease",
                                }}
                                onClick={() =>
                                  handleDeleteCategoryFunc(cat._id)
                                }
                              >
                                Delete
                              </button>
                            </div>

                            {isSelected && !hasChildren && (
                              <button
                                className="btn btn-primary rounded-pill shadow-sm mt-2"
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "4px 10px",
                                  height: "30px",
                                  minWidth: "50px",
                                }}
                                onClick={() => openAddModal(idx + 1, cat._id)}
                              >
                                + Add Child
                              </button>
                            )}
                          </div>
                        );
                      })}

                      <div
                        onClick={() => openAddModal(idx, path[idx - 1] || null)}
                        style={{
                            flex: "0 0 150px",
                            width: "150px",
                            height: "150px",
                            border: "1px dashed #bbb",
                            borderRadius: "10px",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                            transition: "all 0.25s ease",
                        }}
                      >
                        <AiOutlinePlus size={60} color="#0d6efd" />
                      </div>
                    </div>
                  );
                })
              )}

              {addFormData.show && (
                <ModalForm
                  title="Add Category"
                  formData={addFormData}
                  setFormData={setAddFormData}
                  isLoading={isSaving}
                  onSubmit={handleAddCategoryFunc}
                />
              )}
              {editFormData.show && (
                <ModalForm
                  title="Edit Category"
                  formData={editFormData}
                  setFormData={setEditFormData}
                  isLoading={isSaving}
                  onSubmit={handleEditCategoryFunc}
                />
              )}
              {(addFormData.show || editFormData.show) && (
                <div className="modal-backdrop fade show"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalForm({ title, formData, setFormData, isLoading, onSubmit }) {
  return (
    <div className="modal fade show d-flex align-items-center justify-content-center">
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
              style={{ height: "20px", cursor: "pointer" }}
              onClick={() => setFormData({ ...formData, show: false })}
              alt="close"
            />
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-center w-100">
              <div className="w-100 px-2">
                <h5 className="mb-4">{title}</h5>
                <div className="p-3 border rounded mb-2">
                  {formData.imgPrev ? (
                    <img
                      src={formData.imgPrev}
                      className="img-fluid w-100 shadow rounded"
                      alt="preview"
                    />
                  ) : (
                    <p className="mb-0 text-center">No Item Selected!</p>
                  )}
                </div>
                <label>Upload Image</label>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                      imgPrev: e.target.files[0]
                        ? URL.createObjectURL(e.target.files[0])
                        : "",
                    })
                  }
                />
                <label className="mt-3">Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <label className="mt-3">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
                <button
                  className="btn btn-success w-100 mt-4"
                  onClick={
                    formData?.name && formData?.status && !isLoading
                      ? onSubmit
                      : undefined
                  }
                  disabled={!formData.name || !formData.status || isLoading}
                  style={{
                    opacity:
                      !formData.name || !formData.status || isLoading
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
  );
}

export default CategoryDetailsPage;
