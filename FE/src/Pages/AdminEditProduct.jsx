import React, { useState, useEffect } from "react";
import styles from "./AdminAddProduct.module.css";
import AdminPanel from "../Components/AdminPanel";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function AdminEditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  // Lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/products/${productId}`);
        const product = res.data.result;
        setFormData({
          name: product.name || "",
          price: product.price || "",
          description: product.description || "",
          category: product.category || "",
          type: product.type || "",
          image: product.image || null,
          count_in_stock: product.count_in_stock || "",
          sold: product.sold || 0,
          brand: product.brand || "",
          highlightsSummary: product.highlightsSummary || "",
          features: Array.isArray(product.features) && product.features.length > 0
            ? product.features
            : [{ title: "", description: "", image: null }],
          additionalImages: Array.isArray(product.additionalImages) && product.additionalImages.length > 0
            ? product.additionalImages
            : [null],
          specifications: Array.isArray(product.specifications) && product.specifications.length > 0
            ? product.specifications
            : [{ key: "", value: "" }]
        });
      } catch (err) {
        alert("Không tìm thấy sản phẩm!");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  // Các hàm xử lý form giống AdminAddProduct.jsx
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
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData({ ...formData, category: value, type: "" });
      return;
    }
    if (name === "price") {
      if (!/^\d*\.?\d*$/.test(value)) return;
      if (value.startsWith("-")) return;
      setFormData({ ...formData, price: value });
      return;
    }
    if (name === "count_in_stock") {
      if (!/^\d*$/.test(value)) return;
      if (value.startsWith("-")) return;
      setFormData({ ...formData, count_in_stock: value });
      return;
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

  // Khi submit, gọi API update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("category", formData.category);
      if (formData.type) {
        form.append("type", formData.type);
      }
      form.append("brand", formData.brand);
      form.append("count_in_stock", formData.count_in_stock);
      form.append("sold", formData.sold);
      form.append("highlightsSummary", formData.highlightsSummary);
      if (formData.image) form.append("image", formData.image);
      formData.additionalImages.forEach((img) => {
        if (img) form.append('additionalImages', img);
      });
      const featuresForServer = formData.features.map(f => ({
        title: f.title,
        description: f.description
      }));
      form.append('features', JSON.stringify(featuresForServer));
      formData.features.forEach((feature, idx) => {
        if (feature.image) {
          form.append(`features[${idx}][image]`, feature.image);
        }
      });
      formData.specifications.forEach((spec, idx) => {
        form.append(`specifications[${idx}][key]`, spec.key);
        form.append(`specifications[${idx}][value]`, spec.value);
      });
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(`http://localhost:3000/products/${productId}`, form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + accessToken
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update product");
      }
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      if (error.response) {
        alert(JSON.stringify(error.response.data));
      }
      alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.adminPanel}>
          <AdminPanel />
        </div>
        <div className={styles.mainContent}>
          <h1>Edit Product</h1>
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
                />
                {formData.image && typeof formData.image === "string" && (
                  <img src={formData.image} alt="Main" style={{ maxWidth: 120, marginTop: 8 }} />
                )}
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
                    {image && typeof image === "string" && (
                      <img src={image} alt={`Additional ${index + 1}`} style={{ maxWidth: 80, marginTop: 8 }} />
                    )}
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
                    {feature.image && typeof feature.image === "string" && (
                      <img src={feature.image} alt={`Feature ${index + 1}`} style={{ maxWidth: 80, marginTop: 8 }} />
                    )}
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
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminEditProduct; 