// frontend/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import { Home } from "lucide-react"; // Home icon

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("role", user.role);

      if (user.role === "admin" && user.email === "mdnajmullhassan938@gmail.com") {
        router.push("/admin/pages");
      } else {
        router.push("/");
      }

    } catch (err) {
      console.log(err);
      setError("Login failed. Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Home Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <Home className="w-5 h-5" /> Home
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Trust Market Login
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="hover:text-blue-600"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="hover:text-blue-600"
          >
            Don’t have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
}
