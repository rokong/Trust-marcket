import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

export default function VerifyCode() {
  const router = useRouter();
  const { email } = router.query;

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-code", { email, code });
      router.push(`/reset-password?email=${email}&code=${code}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleVerify} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Verify Code</h2>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="border p-3 w-full rounded mb-4"
        />
        <button className="bg-green-600 text-white w-full py-3 rounded hover:bg-green-700">Verify</button>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
}
