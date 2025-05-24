import React, { useState, useEffect } from "react";
import styles from "./AdminUsers.module.css";
import AdminPanel from "../Components/AdminPanel";
import axios from 'axios'; // Import axios
import deleteIcon from "../assets/icons/deleteIcon.svg"; // Import icon delete
import sortIcon from "../assets/icons/sortIcon.svg";
import editIcon from "../assets/icons/editIcon.svg";

function IconButton({ className, icon, onClick, ariaLabel }) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      <img src={icon} alt={ariaLabel} className={styles.icon} />
    </button>
  );
}

function OrderList({ orders }) {
  if (!orders || orders.length === 0) {
    return <div className={styles.noOrders}>No orders found</div>;
  }

  return (
    <div className={styles.orderList}>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user, onDelete, onRoleChange }) {
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [role, setRole] = useState(user.role || 'user');
  const [roleLoading, setRoleLoading] = useState(false);

  const formattedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A";
  const formattedTotalSpent = user.totalSpent ? `$${user.totalSpent.toFixed(2)}` : "$0.00";

  const handleRowClick = async () => {
    if (!showOrders) {
      try {
        const response = await axios.get(`http://localhost:3000/orders/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setOrders(response.data.result.orders || []);
      } catch (err) {
        setOrders([]);
      }
    }
    setShowOrders(!showOrders);
  };

  const handleRoleChange = async (newRole) => {
    setRoleLoading(true);
    try {
      await axios.put(`http://localhost:3000/users/update-role/${user._id}`, 
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      setRole(newRole);
      onRoleChange(user._id, newRole);
      alert('Role updated successfully!');
    } catch (err) {
      alert('Failed to update user role');
    }
    setRoleLoading(false);
  };

  return (
    <>
      <article className={styles.row} onClick={handleRowClick}>
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
      {showOrders && (
        <div className={styles.orderDetails}>
          <OrderList 
            orders={orders.map(o => ({
              ...o,
              customerName: user.name,
              address: user.address,
            }))}
            onStatusChange={async (orderId, status) => {
              try {
                await axios.patch(`http://localhost:3000/orders/update-status/${orderId}`, { status }, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
              } catch (err) {
                alert('Failed to update order status');
              }
            }}
          />
        </div>
      )}
    </>
  );
}

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/all-users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        // Fetch order data for each user
        const usersWithOrders = await Promise.all(
          response.data.result.users.map(async (user) => {
            try {
              const ordersResponse = await axios.get(`http://localhost:3000/orders/user/${user._id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
              });
              const orders = ordersResponse.data.result.orders || [];
              const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
              return {
                ...user,
                orderCount: orders.length,
                totalSpent
              };
            } catch (err) {
              console.error(`Error fetching orders for user ${user._id}:`, err);
              return {
                ...user,
                orderCount: 0,
                totalSpent: 0
              };
            }
          })
        );
        
        setUsers(usersWithOrders);
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
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Make sure you have admin privileges.");
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user._id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <section className={styles.tableContainer}>
      <header className={styles.tableHeader}>
        <div className={styles.sortableHeader} onClick={handleSort}>
          Date Registered
          <img 
            src={sortIcon} 
            alt="Sort" 
            className={`${styles.sortIcon} ${sortOrder === 'desc' ? styles.sortDesc : ''}`}
          />
        </div>
        <div>Name</div>
        <div>Address</div>
        <div>Phone Number</div>
        <div>Email</div>
        <div className={styles.ordersHeader}>Orders</div>
        <div className={styles.totalSpentHeader}>Total Spent</div>
        <div>Role</div>
        <div>Action</div>
      </header>
      <div>
        {users.map((user) => (
          <UserRow 
            key={user._id} 
            user={user} 
            onDelete={handleDeleteUser}
            onRoleChange={handleRoleChange}
          />
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