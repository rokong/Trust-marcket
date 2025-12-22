import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/router";
import { Trash2, Search, ArrowLeft } from "lucide-react";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = users.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(lowerSearch)) ||
          (user.email && user.email.toLowerCase().includes(lowerSearch)) ||
          (user._id && user._id.toString().includes(lowerSearch))
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await api.get("/api/admin/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-3xl font-extrabold text-gray-800 text-right">
            All Registered Users
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Name, Email, or User ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-gray-500 font-medium uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-gray-500 font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-gray-500 font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-gray-500 font-medium uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user._id}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
