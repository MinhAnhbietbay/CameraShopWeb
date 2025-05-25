import React, { useState } from 'react';
import styles from "./ChangePassword.module.css";
import Sidebar from "../Components/Sidebar"; // Assuming Sidebar is used here
import { authApi } from '../api'; // Use authApi

import eyeShowIcon from "../assets/icons/eyeShow.svg";
import eyeHideIcon from "../assets/icons/eyeHide.svg";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false); // State for old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // State for confirm new password visibility

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmNewPassword = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // Client-side validation
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu mới không khớp.' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) { // Example minimum length
        setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        setLoading(false);
        return;
    }

    try {
      // Assuming userApi has a changePassword method
      const response = await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      console.log('Change password response:', response.data);

      if (response.data?.message === 'Password changed successfully') { // Adjust based on actual API success response
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        // Handle specific API errors if needed
        setMessage({ type: 'error', text: response.data?.message || 'Đổi mật khẩu thất bại.' });
      }

    } catch (err) {
      console.error('Error changing password:', err);
      // Handle common errors like incorrect old password (status code 400/401)
      if (err.response?.status === 400 || err.response?.status === 401) {
          setMessage({ type: 'error', text: 'Mật khẩu cũ không đúng.' });
      } else {
          setMessage({ type: 'error', text: 'Đã xảy ra lỗi khi đổi mật khẩu.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
         {/* Sidebar */}
         <div className={styles.sidebarContainer}>
           <h2 className={styles.sidebarTitle}>Account Navigation</h2>
           <Sidebar />
         </div>
        <div className={styles.changePasswordContainer}>
          <h2 className={styles.title}>Đổi mật khẩu</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="oldPassword">Mật khẩu cũ:</label>
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.togglePassword} onClick={toggleShowOldPassword}>
                <img 
                  src={showOldPassword ? eyeHideIcon : eyeShowIcon} 
                  alt={showOldPassword ? "Hide password" : "Show password"} 
                  width="16" 
                  height="16"
                />
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">Mật khẩu mới:</label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.togglePassword} onClick={toggleShowNewPassword}>
                <img 
                  src={showNewPassword ? eyeHideIcon : eyeShowIcon} 
                  alt={showNewPassword ? "Hide password" : "Show password"} 
                  width="16" 
                  height="16"
                />
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới:</label>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.togglePassword} onClick={toggleShowConfirmNewPassword}>
                <img 
                  src={showConfirmNewPassword ? eyeHideIcon : eyeShowIcon} 
                  alt={showConfirmNewPassword ? "Hide password" : "Show password"} 
                  width="16" 
                  height="16"
                />
              </button>
            </div>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
            {message && (
              <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword; 