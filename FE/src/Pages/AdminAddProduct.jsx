import React, { useState } from "react";
import styles from "./AdminAddProduct.module.css";
import AdminPanel from "../Components/AdminPanel";
import axios from "axios";

function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    type: "",
    image: null,
    count_in_stock: "",
    sold: 0,
    brand: "",
    highlightsSummary: "",
    features: [{ title: "", description: "", image: null }],
    additionalImages: [null],
    specifications: [{ key: "", value: "" }]
  });

  const categoryGroups = [
    {
      label: "Cameras",
      value: "cameras",
      types: [
        { label: "Digital Camera", value: "digital" },
        { label: "Film Camera", value: "film" },
        { label: "Video Cameras", value: "video" }
      ]
    },
    {
      label: "Accessories",
      value: "accessories",
      types: [
        { label: "Lenses", value: "lenses" },
        { label: "Tripods", value: "tripods" },
        { label: "Storage & Editing", value: "storage-editing" }
      ]
    },
    {
      label: "Lighting & Studio",
      value: "lighting-studio",
      types: [
        { label: "Flashes", value: "flashes" },
        { label: "Softboxes", value: "softboxes" },
        { label: "Light Stands", value: "light-stands" },
        { label: "Studio Backgrounds", value: "studio-backgrounds" }
      ]
    },
    {
      label: "Used",
      value: "used",
      types: [
        { label: "Used Cameras", value: "used-cameras" },
        { label: "Used Lenses", value: "used-lenses" },
        { label: "Used Accessories", value: "used-accessories" }
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData({ ...formData, category: value, type: "" });
      return;
    }
    if (name === "price" || name === "count_in_stock") {
      if (value === "0") return;
      if (value.startsWith("-") || value.startsWith("+")) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "image") {
      setFormData({ ...formData, image: file });
    } else if (type === "additionalImages") {
      const newImages = [...formData.additionalImages];
      newImages[index] = file;
      setFormData({ ...formData, additionalImages: newImages });
    } else if (type === "features") {
      const newFeatures = [...formData.features];
      newFeatures[index].image = file;
      setFormData({ ...formData, features: newFeatures });
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications[index] = { ...newSpecifications[index], [field]: value };
    setFormData({ ...formData, specifications: newSpecifications });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: "", description: "", image: null }]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const addAdditionalImage = () => {
    setFormData({
      ...formData,
      additionalImages: [...formData.additionalImages, null]
    });
  };

  const removeAdditionalImage = (index) => {
    const newAdditionalImages = [...formData.additionalImages];
    newAdditionalImages.splice(index, 1);
    setFormData({ ...formData, additionalImages: newAdditionalImages });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: "", value: "" }]
    });
  };

  const removeSpecification = (index) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications.splice(index, 1);
    setFormData({ ...formData, specifications: newSpecifications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", Number(formData.price));
      form.append("description", formData.description);
      form.append("category", formData.category);
      if (formData.type) {
        form.append("type", formData.type);
      }
      form.append("brand", formData.brand);
      form.append("count_in_stock", Number(formData.count_in_stock));
      form.append("sold", Number(formData.sold));
      form.append("highlightsSummary", formData.highlightsSummary);
      if (formData.image) form.append("image", formData.image);
      // Gửi các ảnh phụ
      formData.additionalImages.forEach((img) => {
        if (img) form.append('additionalImages', img);
      });
      // Gửi features (không gửi ảnh trong object)
      const featuresForServer = formData.features.map(f => ({
        title: f.title,
        description: f.description
      }));
      form.append('features', JSON.stringify(featuresForServer));
      // Gửi ảnh cho từng feature
      formData.features.forEach((feature, idx) => {
        if (feature.image) {
          form.append(`features[${idx}][image]`, feature.image);
        }
      });
      // Gửi specifications
      formData.specifications.forEach((spec, idx) => {
        form.append(`specifications[${idx}][key]`, spec.key);
        form.append(`specifications[${idx}][value]`, spec.value);
      });

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post("http://localhost:3000/products/add", form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + accessToken
        },
      });
      console.log(response.data);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to add product");
      }
      alert("Sản phẩm đã được thêm thành công!");
      // Có thể reset form hoặc chuyển hướng
    } catch (error) {
      if (error.response) {
        console.error("Lỗi chi tiết từ backend:", error.response.data);
        alert(JSON.stringify(error.response.data));
      }
      console.error("Error adding product:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:3000/products/${productId}`, {
        headers: {
          "Authorization": "Bearer " + accessToken
        }
      });
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      alert("Xóa sản phẩm thất bại!");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.adminPanel}>
          <AdminPanel />
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h1>Add New Product</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <section className={styles.basicInfo}>
              <h2>Basic Information</h2>
              <div className={styles.field}>
                <label>Product Name<span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Price<span className={styles.required}>*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Brand<span className={styles.required}>*</span></label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Category<span className={styles.required}>*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categoryGroups.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                  ))}
                </select>
              </div>
              {formData.category && (
                <div className={styles.field}>
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select type (optional)</option>
                    {categoryGroups.find(g => g.value === formData.category)?.types.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className={styles.field}>
                <label>Product Description<span className={styles.required}>*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Product Feature Highlights<span className={styles.required}>*</span></label>
                <textarea
                  name="highlightsSummary"
                  value={formData.highlightsSummary}
                  onChange={handleInputChange}
                  placeholder="Enter highlights summary"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Main Image<span className={styles.required}>*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "image")}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Additional Images</label>
                {formData.additionalImages.map((image, index) => (
                  <div key={index}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "additionalImages", index)}
                    />
                    <button type="button" onClick={() => removeAdditionalImage(index)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addAdditionalImage}>Add Image</button>
              </div>
              <div className={styles.field}>
                <label>Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                      placeholder={`Feature ${index + 1} title`}
                    />
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                      placeholder={`Feature ${index + 1} description`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "features", index)}
                    />
                    <button type="button" onClick={() => removeFeature(index)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addFeature}>Add Feature</button>
              </div>
              <div className={styles.field}>
                <label>Specifications</label>
                {formData.specifications.map((spec, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                      placeholder={`Specification ${index + 1} key`}
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      placeholder={`Specification ${index + 1} value`}
                    />
                    <button type="button" onClick={() => removeSpecification(index)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addSpecification}>Add Specification</button>
              </div>
              <div className={styles.field}>
                <label>Count in Stock<span className={styles.required}>*</span></label>
                <input
                  type="number"
                  name="count_in_stock"
                  value={formData.count_in_stock}
                  onChange={handleInputChange}
                  placeholder="Enter count in stock"
                  min="0"
                  required
                />
              </div>
            </section>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProduct;