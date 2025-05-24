import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { authApi } from "../services/authApi";

import eyeShowIcon from "../assets/icons/eyeShow.svg";
import eyeHideIcon from "../assets/icons/eyeHide.svg";

const Register = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi cụ thể khi người dùng bắt đầu nhập lại
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match!"
      }));
      return;
    }

    try {
      const response = await authApi.register(formData);
      if (response.data) {
        const { accessToken, refreshToken, user } = response.data.result;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      if (error.errors) {
        const mappedErrors = {};
        Object.keys(error.errors).forEach(key => {
          mappedErrors[key] = error.errors[key];
        });
        setFieldErrors(mappedErrors);
      }
      setError(error.message || "Registration failed!");
    }
  };

  return (
    <div>
      <h1 className={styles.text}>REGISTER</h1>
      <form className={styles.registerContainer} onSubmit={handleRegister}>
        {/* Hiển thị lỗi chung */}
        {error && !Object.keys(fieldErrors).length && <div className={styles.error}>{error}</div>}
        
        {/* Name Input */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="name"
            className={styles.inputField}
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
        </div>

        {/* Email Input */}
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            className={styles.inputField}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
        </div>

        {/* Phone Input */}
        <div className={styles.inputGroup}>
          <input
            type="tel"
            name="phone"
            className={styles.inputField}
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
           {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
        </div>

        {/* Password Input */}
        <div className={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={styles.inputField}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" className={styles.togglePassword} onClick={toggleShowPassword}>
            <img 
              src={showPassword ? eyeHideIcon : eyeShowIcon} 
              alt={showPassword ? "Hide password" : "Show password"}
              width="16" 
              height="16"
            />
          </button>
           {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
        </div>

        {/* Confirm Password Input */}
        <div className={styles.inputGroup}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className={styles.inputField}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="button" className={styles.togglePassword} onClick={toggleShowConfirmPassword}>
            <img 
              src={showConfirmPassword ? eyeHideIcon : eyeShowIcon} 
              alt={showConfirmPassword ? "Hide password" : "Show password"}
              width="16" 
              height="16"
            />
          </button>
          {fieldErrors.confirmPassword && <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>}
        </div>

        {/* Register Button */}
        <button className={styles.registerButton} type="submit">
          Register
        </button>

        {/* Already have an account? */}
        <section className={styles.loginSection}>
          <p className={styles.loginText}>Already have an account?</p>
          <button
            className={styles.loginButton}
            onClick={() => navigate("/login")}
            type="button"
          >
            Log In
          </button>
        </section>
      </form>
    </div>
  );
};

export default Register;
