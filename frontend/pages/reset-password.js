import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

export default function ResetPassword() {
  const router = useRouter();
  const { email, code } = router.query;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", { email, code, newPassword: password });
      setMessage("✅ Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-3 w-full rounded mb-4"
        />
        <button className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700">Reset Password</button>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
}
