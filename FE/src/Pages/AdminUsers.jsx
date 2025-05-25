import React, { useState, useEffect } from "react";
import styles from "./AdminUsers.module.css";
import AdminPanel from "../Components/AdminPanel";
import api from "../api"; // Thay thế axios bằng api từ api.js
import deleteIcon from "../assets/icons/deleteIcon.svg"; // Import icon delete
import sortIcon from "../assets/icons/sortIcon.svg";

function IconButton({ className, icon, onClick, ariaLabel }) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      <img src={icon} alt={ariaLabel} className={styles.icon} />
    </button>
  );
}

function UserRow({ user, onDelete, onRoleChange }) {
  const [role, setRole] = useState(user.role || 'user');
  const [roleLoading, setRoleLoading] = useState(false);

  const formattedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A";
  const formattedTotalSpent = user.totalSpent ? `$${user.totalSpent.toFixed(2)}` : "$0.00";

  const handleRoleChange = async (newRole) => {
    setRoleLoading(true);
    try {
      await api.put(`/users/update-role/${user._id}`, { role: newRole });
      setRole(newRole);
      onRoleChange(user._id, newRole);
      alert('Role updated successfully!');
    } catch (err) {
      alert('Failed to update user role');
    }
    setRoleLoading(false);
  };

  return (
    <article className={styles.row}>
      <div className={styles.date}>{formattedDate}</div>
      <div className={styles.name}>{user.name}</div>
      <div className={styles.address}>{user.address || "-"}</div>
      <div className={styles.phone}>{user.phone || "-"}</div>
      <div className={styles.email}>
        <a href={`mailto:${user.email}`} className={styles.emailLink}>
          {user.email}
        </a>
      </div>
      <div className={styles.orders}>{user.orderCount || 0}</div>
      <div className={styles.totalSpent}>{formattedTotalSpent}</div>
      <div className={styles.role}>
        <select
          value={role}
          onChange={e => handleRoleChange(e.target.value)}
          disabled={roleLoading}
          onClick={e => e.stopPropagation()}
          className={styles.roleDropdown}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className={styles.action}>
        <IconButton
          className={styles.deleteButton}
          icon={deleteIcon}
          ariaLabel="Delete user"
          onClick={e => {
            e.stopPropagation();
            onDelete(user._id);
          }}
        />
      </div>
    </article>
  );
}

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsersAndOrders = async () => {
      try {
        // Fetch all users
        const usersResponse = await api.get('/users/all-users', { params: { page, pageSize } });
        const usersData = usersResponse.data?.result?.users || [];
        setTotalPages(usersResponse.data?.result?.pagination?.totalPages || 1);

        // Fetch all orders for admin view
        const ordersResponse = await api.get('/orders/order-list');
        const allOrders = ordersResponse.data?.result?.orders || [];

        // Calculate order counts and total spent for each user
        const orderDataByUser = allOrders.reduce((acc, order) => {
          const userId = order.user_id; // Assuming order object has user_id field
          if (!acc[userId]) {
            acc[userId] = { orderCount: 0, totalSpent: 0 };
          }
          acc[userId].orderCount += 1;
          acc[userId].totalSpent += order.total_amount || 0;
          return acc;
        }, {});

        // Combine user data with order data
        const usersWithOrders = usersData.map(user => ({
          ...user,
          orderCount: orderDataByUser[user._id]?.orderCount || 0,
          totalSpent: orderDataByUser[user._id]?.totalSpent || 0
        }));

        setUsers(usersWithOrders);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch users or orders:', err);
        setError('Failed to fetch users or orders');
        setUsers([]);
        setLoading(false);
        setTotalPages(1);
      }
    };

    fetchUsersAndOrders();
  }, [page, pageSize]);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/delete/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully!');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setUsers([...users].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Add a check for empty users array before rendering
  if (!users || users.length === 0) return <div>No users found</div>;

  const Pagination = ({ page, totalPages, onPageChange }) => (
    <div style={{ margin: '16px 0', textAlign: 'center' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</button>
      <span style={{ margin: '0 12px' }}>{page} / {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );

  return (
    <section className={styles.tableContainer}>
      <header className={styles.tableHeader}>
        <div>Date</div>
        <div onClick={handleSort} className={styles.sortableHeader}>
          Name <img src={sortIcon} alt="Sort" className={styles.sortIcon} />
        </div>
        <div>Address</div>
        <div>Phone</div>
        <div>Email</div>
        <div>Orders</div>
        <div>Total Spent</div>
        <div>Role</div>
        <div>Action</div>
      </header>
      <div>
        {users.map((user) => (
          <UserRow key={user._id} user={user} onDelete={handleDeleteUser} onRoleChange={handleRoleChange} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}

function AdminUsers() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <AdminPanel />
        <section className={styles.tableSection}>
          <h1 className={styles.title}>Users List</h1>
          <UserTable />
        </section>
      </div>
    </main>
  );
}

export default AdminUsers;