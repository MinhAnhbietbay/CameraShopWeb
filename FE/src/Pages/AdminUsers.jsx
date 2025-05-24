import React, { useState, useEffect } from "react";
import styles from "./AdminUsers.module.css";
import AdminPanel from "../Components/AdminPanel";
import axios from 'axios'; // Import axios
import deleteIcon from "../assets/icons/deleteIcon.svg"; // Import icon delete

function IconButton({ className, icon, onClick, ariaLabel }) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      <img src={icon} alt={ariaLabel} className={styles.icon} />
    </button>
  );
}

function UserRow({ user, onDelete }) {
  // Định dạng ngày đăng ký
  const formattedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A";

  return (
    <article className={styles.row}>
      <div className={styles.id}>{user._id}</div>
      <div className={styles.name}>{user.name}</div>
      <div className={styles.address}>{user.address || "-"}</div>
      <div className={styles.date}>{formattedDate}</div>
      <div className={styles.phone}>{user.phone || "-"}</div>
      <div className={styles.email}>
        <a href={`mailto:${user.email}`} className={styles.emailLink}>
          {user.email}
        </a>
      </div>
      <div className={styles.role}>{user.role || "user"}</div>
      <div className={styles.action}>
         <IconButton
          className={styles.deleteButton}
          icon={deleteIcon}
          ariaLabel="Delete user"
          onClick={() => onDelete(user._id)}
        />
      </div>
    </article>
  );
}

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/all-users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Assuming accessToken is stored in localStorage
          }
        });
        setUsers(response.data.result.users);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/users/delete-user/${userId}`, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
         }
      });
      // Remove deleted user from state
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Make sure you have admin privileges."); // Basic error feedback
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <section className={styles.tableContainer}>
      <header className={styles.tableHeader}>
        <div>ID</div>
        <div>Name</div>
        <div>Address</div>
        <div>Date Registered</div>
        <div>Phone Number</div>
        <div>Email</div>
        <div>Role</div>
        <div>Action</div>
      </header>
      <div>
        {users.map((user) => (
          <UserRow key={user._id} user={user} onDelete={handleDeleteUser} />
        ))}
      </div>
    </section>
  );
}

function AdminUsers() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <AdminPanel />
        <section className={styles.tableSection}>
          <h1 className={styles.title}>User List</h1>
          <UserTable />
        </section>
      </div>
    </main>
  );
}

export default AdminUsers;