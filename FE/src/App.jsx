import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Account from "./Pages/Account";
import ShoppingCart from "./Pages/ShoppingCart";
import Checkout from "./Pages/Checkout";
import Contact from "./Pages/Contact";
import AboutUs from "./Pages/AboutUs";
import SearchResults from "./Pages/SearchResult";
import ProductDetails from "./Pages/ProductDetails";
import MyOrder from "./Pages/MyOrder";
import AdminHeader from "./Components/AdminHeader";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminAddProduct from "./Pages/AdminAddProduct";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";

import api from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/users/me')
        .then(response => {
          if (response.data && response.data.result) {
            setUser(response.data.result.user);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const AdminPrivateRoute = ({ element: Element, ...rest }) => {
    return isLoggedIn && user && user.role === 'admin' ? (
      <Element {...rest} />
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <Router>
      <HeaderWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login setIsLoggedIn={handleLoginSuccess} />} />
        <Route
          path="/account"
          element={
            isLoggedIn ? (
              <Account />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account/order" element={<MyOrder />} />
        <Route 
          path="/products/:category/:productId" 
          element={<ProductDetails cartProducts={cartProducts} setCartProducts={setCartProducts} />} 
        />

        <Route path="/admin" element={<AdminPrivateRoute element={AdminDashboard} />} />
        <Route path="/admin/products" element={<AdminPrivateRoute element={AdminProducts} />} />
        <Route path="/admin/products/add" element={<AdminPrivateRoute element={AdminAddProduct} />} />
        <Route path="/admin/orders" element={<AdminPrivateRoute element={AdminOrders} />} />
        <Route path="/admin/users" element={<AdminPrivateRoute element={AdminUsers} />} />
      </Routes>

      <FooterWrapper />
    </Router>
  );
}

function HeaderWrapper({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return isAdmin ? (
    <AdminHeader />
  ) : (
    <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
  );
}

function FooterWrapper() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return !isAdmin ? <Footer /> : null;
}

export default App;