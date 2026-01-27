// frontend/pages/admin/pages.js
import { useState, useEffect } from "react";
import {
  Search,
  BarChart2,
  Users,
  MessageCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";


export default function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://trust-market-backend-nsao.onrender.com/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setTotalViews(data.homeViews);
      })
      .catch(err => console.error(err));
  }, []);

  
  useEffect(() => {
    const allowedAdminEmail = "mdnajmullhassan938@gmail.com";
    const email = localStorage.getItem("userEmail");
    if (email === allowedAdminEmail) {
      setAdminEmail(email);
    } else {
      alert("Access denied! You are not admin.");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <div className="w-full max-w-md md:max-w-3xl bg-white rounded-xl p-4 shadow">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 relative">
          <div className="mb-2 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold leading-tight">
              Trust Market <br /> Admin
            </h1>
          </div>

          {/* Admin dropdown */}
          <div className="relative md:ml-auto w-full md:w-auto">
            <div
              className="text-sm md:text-base text-gray-600 cursor-pointer flex justify-between items-center p-2 border rounded-lg bg-gray-100"
              onClick={() => setDropdown(!dropdown)}
            >
              {adminEmail ? `${adminEmail} ▼` : "Admin ▼"}
            </div>

            {dropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
                <p className="p-2 text-gray-800">{adminEmail}</p>
                <button
                  className="p-2 w-full text-left text-red-500 hover:bg-gray-100 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="p-4 rounded-lg bg-blue-50 text-center shadow-sm">
            <p className="text-gray-600 text-sm">Views</p>
            <h2 className="text-xl font-semibold">{totalViews}</h2>
          </div>

          <div className="p-4 rounded-lg bg-green-50 text-center shadow-sm">
            <p className="text-gray-600 text-sm">Post Views</p>
            <h2 className="text-xl font-semibold">7.5k</h2>
          </div>

          <div className="p-4 rounded-lg bg-yellow-50 text-center shadow-sm">
            <p className="text-gray-600 text-sm">Accounts</p>
            <h2 className="text-xl font-semibold">42</h2>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4 text-center">
          <h2 className="text-lg font-semibold">Welcome Admin 👋</h2>
          <p className="text-gray-600 text-sm mt-1">
            Use quick links below to manage posts, messages & verification.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mt-4">
          <h2 className="text-lg font-semibold mb-3 text-center">Quick Links</h2>

          <div className="space-y-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <BarChart2 className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              href="/admin/posts"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <Users className="w-5 h-5" />
              Posts
            </Link>

            <Link href="/admin/messages" className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition relative">
              <MessageCircle className="w-5 h-5" />
              Messages
              {users.some(u => u.unreadCount > 0) && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </Link>
              
            <Link
              href="/admin/all-users"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <Users className="w-5 h-5" />
              All Users
            </Link>

            {/* Verification Button */}
            <Link
              href="/admin/verification"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <ShieldCheck className="w-5 h-5 text-green-600" />
              User Verification
            </Link>

            <Link
              href="/admin/payments"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <BarChart2 className="w-5 h-5" />
              Payments
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
