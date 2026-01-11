// frontend/pages/admin/verification.js
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/router";

export default function AdminVerification() {
  const [users, setUsers] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // 🔥 fullscreen image
  const router = useRouter();

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await api.get("/admin/kyc/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load KYC requests");
    } finally {
      setLoading(false);
    }
  };

  const review = async (id, decision) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/admin/kyc/review",
        { userId: id, decision, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.filter((u) => u._id !== id));
      localStorage.setItem("kycUpdated", "true");
    } catch (err) {
      alert("Review failed");
    }
  };

  if (loading)
    return <p className="text-center mt-16 text-gray-500">Loading KYC requests…</p>;

  if (users.length === 0)
    return (
      <p className="text-center mt-16 text-gray-400">
        No pending verifications 🎉
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10">
          🛂 Pending NID Verifications
        </h1>

        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white rounded-2xl shadow-md p-6 mb-8"
          >
            <div className="mb-4">
              <p className="font-semibold text-lg">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {[
                { label: "NID Front", src: u.kyc.front },
                { label: "NID Back", src: u.kyc.back },
                { label: "Selfie", src: u.kyc.selfie },
              ].map((img) => (
                <div
                  key={img.label}
                  className="border rounded-xl p-2 bg-gray-50 cursor-pointer hover:shadow"
                  onClick={() => setPreview(img.src)}
                >
                  <p className="text-sm text-center mb-1">{img.label}</p>
                  <img
                    src={img.src}
                    className="h-40 w-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Reason */}
            <textarea
              placeholder="Reject reason (optional)"
              className="w-full border rounded-lg p-3 mb-4"
              onChange={(e) => setReason(e.target.value)}
            />

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => review(u._id, "verified")}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => review(u._id, "rejected")}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Fullscreen Image Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
