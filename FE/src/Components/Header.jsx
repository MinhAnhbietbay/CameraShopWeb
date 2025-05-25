import React, { useState } from "react"; // quản lý trạng thái đóng mở menu
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

import logo from "../assets/icons/logo.svg";
import arrowdown from "../assets/icons/arrowdown.svg";
import cart from "../assets/icons/cart.svg";
import search from "../assets/icons/search.svg";
import user from "../assets/icons/user.svg";

// Logo
const Logo = () => (
  <Link to="/" className={styles.logoContainer}>
    <img src={logo} alt="LensLogo" className={styles.logo} />
    <h2 className={styles.brandName}>MANH</h2>
  </Link>
);

const menuData = {
  Products: {
    link: "/search", // Link cho Products
    subItems: {
      Cameras: {
        link: "/search?category=cameras", // Link cho Cameras
        subItems: {
          "Digital Camera": "/search?category=cameras&type=digital",
          "Film Camera": "/search?category=cameras&type=film",
          "Video Cameras": "/search?category=cameras&type=video",
        },
      },
      Accessories: {
        link: "/search?category=accessories", // Link cho Accessories
        subItems: {
          "Lenses": "/search?category=accessories&type=lenses",
          "Tripods": "/search?category=accessories&type=tripods",
          "Storage & Editing": "/search?category=accessories&type=storage-editing",
        },
      },
      "Lighting & Studio": {
        link: "/search?category=lighting-studio", 
        subItems: {
          Flashes: "/search?category=lighting-studio&type=flashes",
          Softboxes: "/search?category=lighting-studio&type=softboxes",
          "Light Stands": "/search?category=lighting-studio&type=light-stands",
          "Studio Backgrounds": "/search?category=lighting-studio&type=studio-backgrounds",
        },
      },
    },
  },
  // Brands: {
  //   link: "/search", 
  //   subItems: ["Canon", "FujiFilm", "Leica", "Sony", "Nikon"].map((brand) => ({
  //     label: brand,
  //     link: `/search?brand=${brand.toLowerCase()}`,
  //   })),
  // },
  Used: {
    link: "/search?condition=used",
    subItems: ["Used Cameras", "Used Lenses", "Used Accessories"].map((item) => ({
      label: item,
      link: `/search?condition=used&category=${item.toLowerCase().replace(/\s+/g, "-")}`,
    })),
  },
};

const DropdownMenu = ({ label, items, link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div
      className={styles.menuItem}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={styles.menuBtn}
        onClick={() => link && navigate(link)} // Điều hướng nếu có link
      >
        {label}
        {items && (
          <img
            src={arrowdown}
            alt="Dropdown arrow"
            className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}
          />
        )}
      </button>

      {isOpen && items && (
        <ul className={styles.dropdownList}>
          {Array.isArray(items)
            ? items.map((item, index) => (
                <li key={index} className={styles.dropdownItem}>
                  <button
                    className={styles.menuBtn}
                    onClick={() => navigate(item.link)} // Điều hướng mục con
                  >
                    {item.label}
                  </button>
                </li>
              ))
            : Object.entries(items).map(([subLabel, subData]) => (
                <li key={subLabel} className={styles.dropdownItem}>
                  {typeof subData === "string" ? (
                    <button
                      className={styles.menuBtn}
                      onClick={() => navigate(subData)} // Điều hướng nếu subData là string
                    >
                      {subLabel}
                    </button>
                  ) : (
                    <DropdownMenu
                      label={subLabel}
                      items={subData.subItems}
                      link={subData.link} // Truyền link và subItems
                    />
                  )}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
};

const Navigation = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  return (
    <nav className={styles.menu}>
      {Object.entries(menuData).map(([label, data]) => (
        <DropdownMenu
          key={label}
          label={label}
          items={data.subItems}
          link={data.link} 
        />
      ))}
      <button
        className={styles.menuBtn}
        onClick={() => navigate("/about-us")} // Điều hướng đến About us
      >
        About us
      </button>
      <button
        className={styles.menuBtn}
        onClick={() => navigate("/contact")} 
      >
        Contact
      </button>
    </nav>
  );
};

const IconGroup = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showSearch, setShowSearch] = useState(false); // Trạng thái hiển thị thanh tìm kiếm
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái lưu từ khóa tìm kiếm
  const [showMenu, setShowMenu] = useState(false); // Trạng thái hiển thị menu dropdown

  const handleUserClick = () => {
    if (isLoggedIn) {
      setShowMenu(!showMenu); // Hiển thị hoặc ẩn menu dropdown
    } else {
      navigate("/login"); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Đặt trạng thái đăng xuất
    setShowMenu(false); // Ẩn menu dropdown
    navigate("/"); // Điều hướng về trang chủ
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Điều hướng đến trang kết quả tìm kiếm
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Gọi hàm tìm kiếm khi nhấn Enter
    }
  };

  return (
    <div className={styles.groupHeader}>
      {/*Search*/}
      <button
        className={styles.menuBtn}
        onClick={() => setShowSearch(!showSearch)}
      >
        <img src={search} alt="Search" />
      </button>
      {showSearch && (
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search..."
          value={searchQuery} // Liên kết với trạng thái searchQuery
          onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật trạng thái khi nhập
          onKeyDown={handleKeyDown} // Lắng nghe sự kiện nhấn phím
        />
      )}
  
      {/*User*/}
      <div className={styles.userMenu}>
        <button className={styles.usermenuBtn} onClick={handleUserClick}>
          <img src={user} alt="User" />
        </button>

        {isLoggedIn && showMenu && (
          <ul className={styles.userdropdownList}>
            <li className={styles.userdropdownItem}>
              <Link to="/account" className={styles.usermenuBtn}>
                My Account
              </Link>
            </li>
            <li className={styles.userdropdownItem}>
              <button className={styles.usermenuBtn} onClick={handleLogout}>
                Log Out
              </button>
            </li>
          </ul>
        )}
      </div>

      {/*Cart*/}
      <Link to="/cart">
        <img src={cart} alt="Cart" />
      </Link>
    </div>
  );
};

const AnnouncementBar = () => (
  <div className={styles.annoucmentBar}>ồ lá lá lá</div>
);

function Header({ isLoggedIn, setIsLoggedIn }) {
  return (
    <header className={styles.header}>
      <AnnouncementBar />

      <section className={styles.div}>
        <Logo />
        <Navigation />
        <IconGroup isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </section>

      <hr className={styles.line} />
    </header>
  );
}

export default Header;