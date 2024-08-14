"use client";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useEffectOnce from "../../../้hook/use-effect-once";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    CitizenID: "",
    FirstName: "",
    LastName: "",
    role: "",
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const { data: session } = useSession();
  const router = useRouter();

  useEffectOnce(() => {
    if (!session) {
      router.replace("/");
    } else {
      fetchUsers(page);
    }
  });

  const fetchUsers = async (page) => {
    try {
      const res = await fetch(`/api/users?page=${page}&limit=${limit}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const { users = [], total = 0 } = await res.json();
      setUsers(users);
      setTotal(total);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? "/api/users" : "/api/users";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, id: editId }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await res.json();

      // อัปเดตผู้ใช้ใน state
      if (method === "POST") {
        setUsers([...users, result]);
      } else {
        setUsers(
          users.map((user) => (user._id === result._id ? result : user))
        );
      }
      // รีเซ็ตฟอร์มและ ID
      setForm({ CitizenID: "", FirstName: "", LastName: "", role: "" });
      setEditId(null);

      // รีเฟรชรายการผู้ใช้หลังจากการเพิ่มหรืออัปเดต
      fetchUsers(page);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      // รีเฟรชรายการผู้ใช้หลังจากการลบ
      fetchUsers(page);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setForm({
      CitizenID: user.CitizenID,
      FirstName: user.FirstName,
      LastName: user.LastName,
      role: user.role,
    });
    setEditId(user._id);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar />
      <div className="p-4 m-4 bg-white rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Citizen ID"
              value={form.CitizenID}
              onChange={(e) => setForm({ ...form, CitizenID: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="First Name"
              value={form.FirstName}
              onChange={(e) => setForm({ ...form, FirstName: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.LastName}
              onChange={(e) => setForm({ ...form, LastName: e.target.value })}
              required
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editId ? "Update User" : "Add User"}
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Citizen ID</th>
                <th className="p-2 text-left">First Name</th>
                <th className="p-2 text-left">Last Name</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-2">{user.CitizenID}</td>
                    <td className="p-2">{user.FirstName}</td>
                    <td className="p-2">{user.LastName}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-white p-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-2 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            className="bg-gray-500 text-white p-2 rounded"
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={page * limit >= total}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
