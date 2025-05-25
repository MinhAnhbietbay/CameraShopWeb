import React, { useState, useEffect } from "react";
import styles from "./AdminHeader.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/icons/logo.svg";
import search from "../assets/icons/search.svg";
import user from "../assets/icons/user.svg";

const Logo = () => (
    <div className={styles.logoContainer}>
        <Link to="/admin" className={styles.logoLink}>
            <img src={logo} alt="LensLogo" className={styles.logo} />
            <h2 className={styles.brandName}>MANH</h2>
        </Link>
    </div>
);

function AdminHeader() {
    const location = useLocation();
    const [adminInfo, setAdminInfo] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy thông tin admin từ localStorage
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
            setAdminInfo(JSON.parse(userInfo));
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            let path = "/admin/products";
            if (location.pathname.startsWith("/admin/users")) {
                path = "/admin/users";
            } else if (location.pathname.startsWith("/admin/orders")) {
                path = "/admin/orders";
            }
            navigate(`${path}?search=${encodeURIComponent(searchValue)}`);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerTop}></div>
            <div className={styles.headerMain}>
                <div className={styles.headerContent}>
                    <div className={styles.leftSection}>
                        <div className={styles.logo}>
                            <Logo />
                        </div>
                        <form className={styles.searchBar} onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            <button type="submit">
                                <img src={search} alt="Search" />
                            </button>
                        </form>
                    </div>

                    <div className={styles.userSection}>
                        <Link to="/admin/settings" className={styles.avatarLink}>
                            <img src={user} alt="User avatar" className={styles.avatar} />
                        </Link>
                        <Link to="/admin/settings" className={styles.userInfoLink}>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{adminInfo?.name || 'Admin'}</span>
                                <span className={styles.userRole}>Admin</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <hr className={styles.divider} />
        </header>
    );
}

export default AdminHeader;