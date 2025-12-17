// frontend/pages/admin/message.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../../utils/api";

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/admin/message-users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );

      setUsers(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(() => loadUsers(), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadUsers();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const formatTime = (time) => {
    if (!time) return "No messages yet";
    const date = new Date(time);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const openChat = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await api.post(
        `/admin/messages/mark-read/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, unreadCount: 0 } : u))
      );

      router.push(`/admin/messages/${userId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 relative">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 md:top-6 right-4 md:right-6 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm md:text-base"
      >
        ← Back
      </button>

      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
        💬 User Messages
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500 text-sm md:text-base">No users found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => openChat(u._id)}
              className="relative bg-white p-4 md:p-5 rounded-2xl shadow-md border border-gray-200 cursor-pointer transition hover:shadow-xl hover:-translate-y-1"
            >
              {u.unreadCount > 0 && (
                <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-red-500 text-white w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-xs md:text-sm font-bold">
                  {u.unreadCount}
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 flex justify-center items-center rounded-full text-lg md:text-xl">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                    {u.name || "Unknown User"}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm">{u.email}</p>
                </div>
              </div>

              <div className="mt-2 md:mt-3 text-gray-600 text-xs md:text-sm">
                ⏱ Last Message:{" "}
                <span className="font-medium">{formatTime(u.lastMessageTime)}</span>
              </div>

              <div className="mt-1 md:mt-2 text-blue-600 text-xs md:text-sm font-medium">
                Click to view chat →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
