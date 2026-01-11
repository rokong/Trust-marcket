// pages/dashboard/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../utils/api";
import { User, Heart, FileText, ShieldCheck, LogOut } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Unauthorized");
      router.push("/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Top Right Home Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Home
        </button>
      </div>

      {/* PAGE TITLE */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Account Dashboard
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Welcome, <span className="font-semibold">{user.name}</span>
        </p>

        {/* MENU OPTIONS */}
        <div className="mt-10 space-y-4">
          {/* My Posts */}
          <Link
            href="/dashboard/my-posts"
            className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 p-4 rounded-xl transition font-medium"
          >
            <FileText className="w-5 h-5 text-blue-600" /> My Posts
          </Link>

          {/* Favorites */}
          <Link
            href="/dashboard/favorites"
            className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 p-4 rounded-xl transition font-medium"
          >
            <Heart className="w-5 h-5 text-red-500" /> Favorites
          </Link>

          {/* KYC Verification */}
          {user.kyc?.status !== "verified" && (
            <>
              {user.kyc?.status === "pending" ? (
                <div
                  className="flex items-center gap-3 bg-yellow-100 text-yellow-700 p-4 rounded-xl font-medium cursor-not-allowed"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Verification Pending
                </div>
              ) : (
                <button
                  onClick={() => router.push("/dashboard/verification")}
                  className="flex items-center gap-3 bg-green-100 hover:bg-green-200 text-green-700 p-4 rounded-xl font-medium transition w-full"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {user.kyc?.status === "rejected" ? "Re-submit Verification" : "Verify Identity"}
                </button>
              )}
            </>
          )}


          {/* VERIFIED BADGE */}
          {user.kyc?.status === "verified" && (
            <div className="flex items-center gap-3 bg-green-600 text-white p-4 rounded-xl font-medium">
              <ShieldCheck className="w-5 h-5" />
              Identity Verified
            </div>
          )}


          {/* Account Details */}
          <Link
            href="/dashboard/account"
            className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 p-4 rounded-xl transition font-medium"
          >
            <User className="w-5 h-5 text-gray-700" /> Account Details
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 bg-red-600 text-white p-4 w-full rounded-xl hover:bg-red-700 transition font-medium mt-10"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
