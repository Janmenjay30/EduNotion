import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../../../services/apiConnector";
import { courseEndpoints } from "../../../../services/apis";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import ConfirmationModal from "../../../common/ConfirmationModal";

const { 
  COURSE_CATEGORIES_API, 
  CREATE_CATEGORY_API, 
  UPDATE_CATEGORY_API, 
  DELETE_CATEGORY_API 
} = courseEndpoints;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await apiConnector("GET", COURSE_CATEGORIES_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("📥 Categories fetched:", response.data);
      
      if (response.data.success) {
        setCategories(response.data.data || response.data.allCategories || []);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("❌ Fetch categories error:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Category description is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await apiConnector("POST", CREATE_CATEGORY_API, {
        name: formData.name.trim(),
        description: formData.description.trim()
      }, {
        Authorization: `Bearer ${token}`,
      });
      
      console.log("📤 Create category response:", response.data);
      
      if (response.data.success) {
        toast.success("Category added successfully!");
        setFormData({ name: "", description: "" });
        setShowAddForm(false);
        fetchCategories(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("❌ Add category error:", error);
      toast.error(error?.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await apiConnector("PUT", `${UPDATE_CATEGORY_API}/${editingCategory._id}`, {
        name: formData.name.trim(),
        description: formData.description.trim()
      }, {
        Authorization: `Bearer ${token}`,
      });
      
      if (response.data.success) {
        toast.success("Category updated successfully!");
        setFormData({ name: "", description: "" });
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("❌ Update category error:", error);
      toast.error(error?.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await apiConnector("DELETE", `${DELETE_CATEGORY_API}/${categoryId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      
      if (response.data.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("❌ Delete category error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
      setConfirmationModal(null);
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setShowAddForm(false);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner w-8 h-8 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <MdCategory className="text-yellow-50" />
              Category Management
            </h1>
            <p className="text-richblack-300 mt-2">
              Manage course categories for the platform
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={loading}
            className="bg-yellow-50 hover:bg-yellow-25 text-richblack-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <FaPlus />
            {showAddForm ? "Cancel" : "Add Category"}
          </button>
        </div>

        {/* Add/Edit Category Form */}
        {showAddForm && (
          <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            
            <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-richblack-200 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-richblack-400 focus:ring-2 focus:ring-yellow-50 focus:border-yellow-50 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-richblack-200 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter category description"
                    rows="3"
                    className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-richblack-400 focus:ring-2 focus:ring-yellow-50 focus:border-yellow-50 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : (editingCategory ? "Update Category" : "Add Category")}
                </button>
                
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-richblack-600 hover:bg-richblack-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-richblack-800 rounded-xl border border-richblack-700">
          <div className="p-6 border-b border-richblack-700">
            <h2 className="text-xl font-semibold text-white">
              All Categories ({categories.length})
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <MdCategory className="mx-auto text-6xl text-richblack-400 mb-4" />
              <p className="text-richblack-300 text-lg">No categories found</p>
              <p className="text-richblack-400 text-sm mt-2">
                Click "Add Category" to create your first category
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-richblack-700">
                  <tr>
                    <th className="text-left p-4 text-richblack-200 font-semibold">Name</th>
                    <th className="text-left p-4 text-richblack-200 font-semibold">Description</th>
                    <th className="text-left p-4 text-richblack-200 font-semibold">Courses</th>
                    <th className="text-left p-4 text-richblack-200 font-semibold">Created</th>
                    <th className="text-center p-4 text-richblack-200 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr 
                      key={category._id} 
                      className={`border-b border-richblack-700 hover:bg-richblack-700 transition-colors ${
                        index % 2 === 0 ? 'bg-richblack-800' : 'bg-richblack-750'
                      }`}
                    >
                      <td className="p-4 text-white font-medium">{category.name}</td>
                      <td className="p-4 text-richblack-300 max-w-xs truncate">
                        {category.description}
                      </td>
                      <td className="p-4 text-richblack-300">
                        {category.courses?.length || 0} courses
                      </td>
                      <td className="p-4 text-richblack-300">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => startEdit(category)}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                            title="Edit Category"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setConfirmationModal({
                              text1: "Delete Category?",
                              text2: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
                              btn1Text: "Delete",
                              btn2Text: "Cancel",
                              btn1Handler: () => handleDeleteCategory(category._id),
                              btn2Handler: () => setConfirmationModal(null),
                            })}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Category"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CategoryManagement;