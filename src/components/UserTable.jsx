import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function UserTable() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    totalBill: "",
    status: "Active",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  // ================= ADD / UPDATE =================
  const handleSubmit = async () => {
    if (!formData.name) return alert("Name required");

    if (editingId) {
      const res = await fetch(`http://localhost:5000/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setUsers(users.map((u) => (u._id === updated._id ? updated : u)));
      setEditingId(null);
    } else {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newUser = await res.json();
      setUsers([...users, newUser]);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      totalBill: "",
      status: "Active",
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const password = prompt("Enter admin password");
    if (!password) return;

    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.status === 401) {
      alert("Wrong password");
      return;
    }

    setUsers(users.filter((u) => u._id !== id));
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");

    // Hard redirect so routing state resets
    window.location.href = "/login";
  };

  // ================= FILTER =================
  const filteredUsers = users.filter(
    (u) =>
      u.userNumber?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalRevenue = users.reduce(
    (sum, u) => sum + Number(u.totalBill || 0),
    0,
  );

  return (
    <div className="dashboard-container">
      <div className="top-bar">
        <h2>Ashtha clinic</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search by User Number, Name or Phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="form-row">
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <input
          type="number"
          placeholder="Total Bill"
          value={formData.totalBill}
          onChange={(e) =>
            setFormData({ ...formData, totalBill: e.target.value })
          }
        />

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button className="primary-btn" onClick={handleSubmit}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Bill</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.userNumber}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.date}</td>
              <td>₹ {u.totalBill}</td>
              <td>{u.status}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingId(u._id);
                    setFormData(u);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan="5">
              <strong>Total Revenue</strong>
            </td>
            <td>
              <strong>₹ {totalRevenue}</strong>
            </td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
