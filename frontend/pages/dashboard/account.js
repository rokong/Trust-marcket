// pages/dashboard/account.js
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react"; // <-- Import back arrow

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      router.push("/login");
    }
  };

  if (!user) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      
      {/* Back Arrow */}
      <button
        onClick={() => router.back()} // <-- goes to previous page
        className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Account Details</h2>

        <p className="text-lg mb-3"><strong>Name:</strong> {user.name}</p>
        <p className="text-lg mb-6"><strong>Email:</strong> {user.email}</p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/change-password")}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Change Password
          </button>

          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-800"
          >
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}
