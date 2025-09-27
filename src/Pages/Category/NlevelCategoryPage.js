import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { toast } from "react-toastify";
import {
  getNlevelCategoryTreeServ,
  createNlevelCategoryServ,
  updateNlevelCategoryServ,
  deleteNlevelCategoryServ,
} from "../../services/nLevelCategory.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AiOutlinePlus } from "react-icons/ai";

function NlevelCategoryPage() {
  const { id: subCategoryId } = useParams();
  const [tree, setTree] = useState([]);
  const [path, setPath] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);

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

  const [isLoading, setIsLoading] = useState(false);

  // fetch tree
  const fetchCategories = async () => {
    if (tree.length === 0) setShowSkeleton(true);
    try {
      const res = await getNlevelCategoryTreeServ(subCategoryId);
      if (res?.data?.statusCode === 200) {
        const treeData = res?.data?.data || [];
        setTree(treeData);
        if (treeData.length && path.length === 0) setPath([treeData[0]._id]);
        if (!treeData.length) setPath([]);
      } else toast.error(res?.data?.message || "Failed to fetch categories");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
    setShowSkeleton(false);
  };

  useEffect(() => {
    if (subCategoryId) fetchCategories();
  }, [subCategoryId]);

  const openAddModal = (levelIndex, parentId = null) => {
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
    formData.append("subCategoryId", subCategoryId);

    try {
      setIsLoading(true);
      const res = await createNlevelCategoryServ(formData);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Category added");
        setAddFormData((s) => ({ ...s, show: false }));
        await fetchCategories();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    } finally {
      setIsLoading(false);
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
    formData.append("subCategoryId", subCategoryId);
    if (editFormData.image) formData.append("image", editFormData.image);

    try {
      setIsLoading(true);
      const res = await updateNlevelCategoryServ(editFormData._id, formData);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Category updated");
        setEditFormData((s) => ({ ...s, show: false }));
        await fetchCategories();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategoryFunc = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      setIsLoading(true);
      const res = await deleteNlevelCategoryServ(categoryId);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Category deleted");
        await fetchCategories();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  // build levels
  const levels = [];
  let currentList = tree;
  for (let i = 0; i <= path.length; i++) {
    levels.push(currentList);
    const selectedId = path[i];
    const selectedNode = currentList?.find?.((n) => n._id === selectedId);
    if (!selectedNode) break;
    currentList = selectedNode.children || [];
  }

  const handleSelect = (levelIndex, id) => {
    setPath((prev) => {
      const newPath = prev.slice(0, levelIndex);
      newPath[levelIndex] = id;
      return newPath;
    });
  };

  const getSelectedNodeAtLevel = (list, selectedId) =>
    list?.find?.((n) => n._id === selectedId);

  // Skeleton Card
  const CardSkeleton = () => (
    <div
      style={{
        width: "150px",
        border: "1px solid #e5e5e5",
        borderRadius: "10px",
        background: "#fff",
        textAlign: "center",
        padding: "0.75rem 0.5rem",
        boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Skeleton
        circle
        width={65}
        height={65}
        style={{ margin: "0 auto 8px" }}
      />
      <Skeleton width={100} height={16} style={{ margin: "0 auto" }} />
      <div className="d-flex justify-content-center gap-2 mt-2">
        <Skeleton width={30} height={30} />
        <Skeleton width={30} height={30} />
      </div>
      <Skeleton
        width={90}
        height={30}
        style={{ margin: "8px auto 0", borderRadius: 999 }}
      />
    </div>
  );

  const ColumnSkeleton = () => (
    <div
      className="d-flex flex-row"
      style={{
        gap: "1rem",
        minHeight: "180px",
        padding: "0.5rem",
      }}
    >
      {[1, 2, 3].map((k) => (
        <CardSkeleton key={k} />
      ))}
      <div
        style={{
          width: "150px",
          height: "150px",
          border: "1px dashed #bbb",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton width={50} height={50} />
      </div>
    </div>
  );

  return (
    <div className="bodyContainer bg-light min-vh-100">
      <Sidebar selectedMenu="Categories" selectedItem="N-Level Categories" />
      <div className="mainContainer">
        <TopNav />
        <div className="container-fluid py-4">
          <div className="card shadow-sm border border-light-subtle">
            <div className="card-body">
              <h3 className="card-title fw-semibold mb-4 text-dark">
                N-Level Category Manager
              </h3>

              {/* Skeleton Loader */}
              {showSkeleton && (
                <div
                  style={{ overflowX: "auto", display: "flex", gap: "1rem" }}
                >
                  <ColumnSkeleton />
                  <ColumnSkeleton />
                  <ColumnSkeleton />
                </div>
              )}

              {/* Empty state */}
              {!showSkeleton && tree.length === 0 && (
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
              )}

              {/* Levels */}
              {!showSkeleton &&
                tree.length > 0 &&
                levels.map((list, idx) => {
                  const selectedId = path[idx];
                  const selectedNode = getSelectedNodeAtLevel(list, selectedId);
                  const isBeyondCurrentLevel = idx > path.length - 1;
                  if (isBeyondCurrentLevel) {
                    const prevLevelList = levels[idx - 1] || [];
                    const prevSelectedId = path[idx - 1];
                    const prevSelected = getSelectedNodeAtLevel(
                      prevLevelList,
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
                        padding: "0.5rem 0",
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

                            {/* Edit/Delete */}
                            <div
                              className="d-flex justify-content-center gap-2 mt-2"
                              style={{ fontSize: "0.85rem" }}
                            >
                              {/* Add Button */}
                              <button
                                className="btn btn-sm rounded-pill shadow-sm"
                                title="Add"
                                style={{
                                  backgroundColor: "rgb(255, 103, 30)",
                                  color: "#fff",
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

                              {/* Edit Button */}
                              <button
                                className="btn btn-sm rounded-pill shadow-sm"
                                title="Edit"
                                style={{
                                  backgroundColor: "#1e88e5",
                                  color: "#fff",
                                  border: "none",
                                  padding: "4px 10px",
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

                            {/* Add Child inside card */}
                            {isSelected && !hasChildren && (
                              <button
                                className="btn btn-primary btn-sm rounded-pill shadow-sm mt-2 px-3"
                                onClick={() => openAddModal(idx + 1, cat._id)}
                              >
                                + Add Child
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Same Level */}
                      <div
                        onClick={() => openAddModal(idx, path[idx - 1] || null)}
                        style={{
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
                })}

              {addFormData.show && (
                <ModalForm
                  title="Add Category"
                  formData={addFormData}
                  setFormData={setAddFormData}
                  isLoading={isLoading}
                  onSubmit={handleAddCategoryFunc}
                />
              )}
              {editFormData.show && (
                <ModalForm
                  title="Edit Category"
                  formData={editFormData}
                  setFormData={setEditFormData}
                  isLoading={isLoading}
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

export default NlevelCategoryPage;
