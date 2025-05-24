import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { authApi } from "../services/authApi";

import eyeShowIcon from "../assets/icons/eyeShow.svg";
import eyeHideIcon from "../assets/icons/eyeHide.svg";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      const response = await authApi.login(formData);
      if (response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Pass user data to handleLoginSuccess
        setIsLoggedIn(response.data.user); 

        // Check user role and navigate accordingly
        if (response.data.user && response.data.user.role === 'admin') {
          navigate("/admin"); // Navigate to admin dashboard
        } else {
          navigate("/"); // Navigate to home page or user dashboard
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
         // Xử lý lỗi validation từ backend
         const errors = error.response.data.errors;
         const mappedErrors = {};
         if (Array.isArray(errors)) {
            errors.forEach(err => {
              if (err.path) {
                mappedErrors[err.path] = err.msg;
              }
            });
         } else if (errors && typeof errors === 'object') {
            // Handle case where errors might be a single object or different structure
            // Based on backend response structure, adjust this parsing logic
            for (const key in errors) {
                if (errors[key].msg) {
                    mappedErrors[key] = errors[key].msg;
                } else {
                    mappedErrors[key] = errors[key];
                }
            }
         }

        setFieldErrors(mappedErrors);
        setError(error.response.data.message || "Validation failed!");

      } else {
        // Xử lý lỗi khác (network, server error 500,...)
        setError(error.response?.data?.message || "Login failed!");
      }
    }
  };

  return (
    <div>
      <h1 className={styles.text}>LOGIN</h1>
      <form className={styles.loginContainer} onSubmit={handleLogin}>
        {/* Hiển thị lỗi chung */}
        {error && !Object.keys(fieldErrors).length && <div className={styles.error}>{error}</div>}
        
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

        {/* Login Button */}
        <button className={styles.loginButton} type="submit">
          Log In
        </button>

        {/* Don't have an account? */}
        <section className={styles.registerSection}>
          <p className={styles.registerText}>Don't have an account?</p>
          <button
            className={styles.registerButton}
            onClick={() => navigate("/register")}
            type="button"
          >
            Register
          </button>
        </section>
      </form>
    </div>
  );
};

export default Login;