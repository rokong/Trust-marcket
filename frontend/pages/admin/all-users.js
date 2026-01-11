// frontend/pages/admin/all-users.js
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/router";
import { Trash2, Search, ArrowLeft } from "lucide-react";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
      setFilteredUsers(res.data);

      // ✅ Pending approval update detect
      if (localStorage.getItem("kycUpdated")) {
        localStorage.removeItem("kycUpdated");
        setUsers(res.data); // force refresh to show Verified badge
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!search) setFilteredUsers(users);
    else {
      const lowerSearch = search.toLowerCase();
      const filtered = users.filter(
        (u) =>
          u.name?.toLowerCase().includes(lowerSearch) ||
          u.email?.toLowerCase().includes(lowerSearch) ||
          u._id?.toString().includes(lowerSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = users.filter((u) => u._id !== userId);
      setUsers(updated);
      setFilteredUsers(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const renderKycBadge = (status) => {
    if (status === "verified")
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
          Verified
        </span>
      );
    if (status === "pending")
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-semibold">
          Pending
        </span>
      );
    return (
      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-semibold">
        Not Verified
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800">
            All Registered Users
          </h1>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, ID"
            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">#</th>
                <th className="px-6 py-3 text-left text-sm">User ID</th>
                <th className="px-6 py-3 text-left text-sm">Name</th>
                <th className="px-6 py-3 text-left text-sm">Email</th>
                <th className="px-6 py-3 text-center text-sm">Verification</th>
                <th className="px-6 py-3 text-center text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.length ? (
                filteredUsers.map((u, i) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4 text-sm">{u._id}</td>
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="text-center">{renderKycBadge(u.kyc?.status)}</td>
                    <td className="text-center">
                      <button
                        disabled={u.kyc?.status === "verified"}
                        onClick={() => handleDelete(u._id)}
                        className={`px-3 py-1 rounded text-white ${
                          u.kyc?.status === "verified"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-red-600"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No users found
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
