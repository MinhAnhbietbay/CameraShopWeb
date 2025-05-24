import React, { useState } from "react";
import styles from "./AdminAddProduct.module.css";
import AdminPanel from "../Components/AdminPanel";

function AdminAddProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    description: "",
    highlightsSummary: "",
    highlights: ["", "", ""],
    specifications: "",
    price: "",
    stock: "",
    productImages: [null, null, null, null, null],
    promotionImage: null,
    featureImages: [null, null, null],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHighlightChange = (index, value) => {
    const updatedHighlights = [...formData.highlights];
    updatedHighlights[index] = value;
    setFormData({ ...formData, highlights: updatedHighlights });
  };

  const handleImageChange = (e, type, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...formData[type]];
      updatedImages[index] = file;
      setFormData({ ...formData, [type]: updatedImages });
    }
  };

  const handleRemoveImage = (type, index) => {
    const updatedImages = [...formData[type]];
    updatedImages[index] = null; // Xóa ảnh tại vị trí được chọn
    setFormData({ ...formData, [type]: updatedImages });
  };

  const handlePromotionImageChange = (file) => {
    setFormData({ ...formData, promotionImage: file });
  };

  const handleRemovePromotionImage = () => {
    setFormData({ ...formData, promotionImage: null }); // Xóa ảnh promo
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add logic to send data to the server
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
                <label>Product Images*</label>
                <div className={styles.imageUploadContainer}>
                  {formData.productImages.map((image, index) => (
                    <div key={index} className={styles.imageUploadBox}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "featureImages", index)}
                      />
                      {formData.featureImages && formData.featureImages[index] && (
                        <>
                          <img
                            src={URL.createObjectURL(formData.featureImages[index])}
                            alt={`Feature ${index + 1}`}
                          />
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleRemoveImage("featureImages", index)}
                          >
                            ✖
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label>Promotion Image*</label>
                <p className={styles.note}>
                  Upload 1:1 Image. Promotion Image will be used on the promotion page, search result page, daily discover, etc. Upload Promotion Image will inspire buyers to click on your product.
                </p>
                <div className={styles.imageUploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePromotionImageChange(e.target.files[0])}
                    required={!formData.promotionImage} // Chỉ yêu cầu nếu chưa có ảnh
                  />
                  {formData.promotionImage && (
                    <>
                      <img
                        src={URL.createObjectURL(formData.promotionImage)}
                        alt="Promotion"
                      />
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={handleRemovePromotionImage}
                      >
                        ✖
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.field}>
                <label>Product Name*</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Category*</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Product Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Product Feature Highlights*</label>

                <div className={styles.field}>
                  <textarea
                    name="highlightsSummary"
                    value={formData.highlightsSummary || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, highlightsSummary: e.target.value })
                    }
                    placeholder="Enter highlights summary"
                    required
                  />
                </div>

                {formData.highlights.map((highlight, index) => (
                  <div key={index} className={styles.featureRow}>
                    <div className={styles.imageUploadBox}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange("featureImages", index, e.target.files[0])
                        }
                      />
                      {formData.featureImages && formData.featureImages[index] && (
                        <>
                          <img
                            src={URL.createObjectURL(formData.featureImages[index])}
                            alt={`Feature ${index + 1}`}
                          />
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleRemoveImage("featureImages", index)}
                          >
                            ✖
                          </button>
                        </>
                      )}
                    </div>
                    <textarea
                      type="text"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className={styles.field}>
                <label>Specifications*</label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleInputChange}
                  placeholder="Enter specifications"
                  required
                />
              </div>
            </section>

            <section className={styles.saleInfo}>
              <h2>Sale Information</h2>
              <div className={styles.field}>
                <label>Price*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Stock*</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
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