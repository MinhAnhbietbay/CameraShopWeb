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
import ChangePassword from "./Pages/ChangePassword";
import AdminHeader from "./Components/AdminHeader";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminAddProduct from "./Pages/AdminAddProduct";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";
import AdminEditProduct from "./Pages/AdminEditProduct";

import { authApi } from "./services/authApi";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  useEffect(() => {
    const userData = authApi.getCurrentUser();
    if (userData) {
      setUser(userData);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const AdminPrivateRoute = ({ element: Element, ...rest }) => {
    const userData = authApi.getCurrentUser();
    if (!userData) {
      return <Navigate to="/login" replace />;
    }
    if (userData.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return <Element {...rest} />;
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
        <Route path="/register" element={<Register setIsLoggedIn={handleLoginSuccess} />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account/order" element={<MyOrder />} />
        <Route path="/account/change-password" element={isLoggedIn ? <ChangePassword /> : <Navigate to="/login" replace />} />
        <Route 
          path="/products/:category/:productId" 
          element={<ProductDetails cartProducts={cartProducts} setCartProducts={setCartProducts} />} 
        />

        <Route path="/admin" element={<AdminPrivateRoute element={AdminDashboard} />} />
        <Route path="/admin/products" element={<AdminPrivateRoute element={AdminProducts} />} />
        <Route path="/admin/products/add" element={<AdminPrivateRoute element={AdminAddProduct} />} />
        <Route path="/admin/products/edit/:productId" element={<AdminPrivateRoute element={AdminEditProduct} />} />
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