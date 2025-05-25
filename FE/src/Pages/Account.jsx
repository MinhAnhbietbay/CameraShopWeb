import React, { useState, useEffect } from "react";
import styles from "./Account.module.css";
import Sidebar from "../Components/Sidebar";
import write from "../assets/icons/write.svg";
import { authApi } from '../api';

function InformationSection({ title, showEditIcon, onEdit, editText, children }) {
  return (
    <section className={styles.infoSection}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {showEditIcon && (
          editText ? (
            <span className={styles.editText} onClick={onEdit}>Edit</span>
          ) : (
            <img
              src={write}
              alt="Edit"
              className={styles.editIcon}
              onClick={onEdit}
              style={{ cursor: 'pointer' }}
            />
          )
        )}
      </header>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}

function DashboardContent() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    // Lấy user từ localStorage
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setUser(userData);
    setForm(userData);
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Gọi API cập nhật thông tin user lên backend
      await authApi.updateUserInfo({ name: form.name, address: form.address, phone: form.phone });
      setUser(form);
      localStorage.setItem("user", JSON.stringify(form));
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile!');
    }
  };

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.dashboardTitle}>My Profile</h1>
      <p className={styles.dashboardDescription}>
        From your dashboard you can view and update your account information.
      </p>
      <main className={styles.infoContainer}>
        <InformationSection
          title="Contact Information"
          showEditIcon={!editMode}
          onEdit={handleEdit}
          editText={!editMode}
        >
          <div style={{ width: '100%' }}>
            <div className={styles.infoRow}>
              <label className={styles.infoLabel}>Name:</label>
              {editMode ? (
                <input name="name" value={form.name || ""} onChange={handleChange} className={styles.infoInputLarge} />
              ) : (
                <span className={styles.infoValue}>{user.name || <i>Not set</i>}</span>
              )}
            </div>
            <div className={styles.infoRow}>
              <label className={styles.infoLabel}>Email:</label>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <label className={styles.infoLabel}>Phone:</label>
              {editMode ? (
                <input name="phone" value={form.phone || ""} onChange={handleChange} className={styles.infoInputLarge} />
              ) : (
                <span className={styles.infoValue}>{user.phone || <i>Not set</i>}</span>
              )}
            </div>
          </div>
          {editMode && (
            <button className={styles.saveButton} onClick={handleSave}>Save</button>
          )}
        </InformationSection>

        <InformationSection title="Default Delivery Address">
          <div className={styles.infoRow}>
            <label className={styles.infoLabel}>Address:</label>
            {editMode ? (
              <input name="address" value={form.address || ""} onChange={handleChange} className={styles.infoInputLarge} />
            ) : (
              <span className={styles.infoValue}>{user.address || <i>Not set</i>}</span>
            )}
          </div>
        </InformationSection>
      </main>
    </div>
  );
}

function InputDesign() {
  return (
    <div className={styles.container}>
      <h2 className={styles.sidebarTitle}>Have a good time</h2>
      <Sidebar />
      <DashboardContent />
    </div>
  );
}

export default InputDesign;