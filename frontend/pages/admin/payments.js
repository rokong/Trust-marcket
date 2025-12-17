// frontend/pages/admin/payments.js
// frontend/pages/admin/payments.js
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import api from "../../utils/api";
import { useRouter } from "next/router";

export default function AdminPayments() {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState("bKash");
  const [trxID, setTrxID] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [payments, setPayments] = useState([]);

  // Load all payments
  const loadPayments = async () => {
    try {
      const { data } = await api.get("/api/admin/payment/list");
      setPayments(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const addPayment = async () => {
    if (!trxID || !price) {
      setMsg("❌ Transaction ID & Amount are required");
      return;
    }

    try {
      const { data } = await api.post("/api/admin/payment/add", {
        trxID,
        price,
        paymentType,
      });
      setMsg(data.message);
      setTrxID("");
      setPrice("");
      loadPayments(); // refresh list
    } catch (err) {
      console.error(err.response?.data);
      setMsg("❌ Error adding payment");
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "bKash":
        return "text-pink-600";
      case "Nogod":
        return "text-orange-500";
      case "Rocket":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900"
      >
        <ChevronLeft size={20} /> Back
      </button>

      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        Admin – Add Payment
      </h1>

      {/* Payment Type Dropdown */}
      <div className="flex mb-4">
        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="border p-3 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="bKash">bKash</option>
          <option value="Nogod">Nogod</option>
          <option value="Rocket">Rocket</option>
        </select>
      </div>

      {/* Add Payment Form */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <input
          placeholder="Transaction ID"
          value={trxID}
          onChange={(e) => setTrxID(e.target.value)}
          className="border p-3 rounded flex-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <input
          placeholder="Amount"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 rounded w-full md:w-40 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          onClick={addPayment}
          className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 transition"
        >
          Add Payment
        </button>
      </div>

      {msg && (
        <p className="mb-4 text-gray-700 font-medium bg-green-100 p-2 rounded">
          {msg}
        </p>
      )}

      {/* Payments Table */}
      <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800">
        All Payments
      </h2>
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        {payments.length === 0 ? (
          <p className="p-4 text-gray-500">No payments added yet</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-3 text-gray-700">Payment Type</th>
                <th className="py-3 px-3 text-gray-700">trxID</th>
                <th className="py-3 px-3 text-gray-700">Amount</th>
                <th className="py-3 px-3 text-gray-700">Status</th>
                <th className="py-3 px-3 text-gray-700">Created At</th>
                <th className="py-3 px-3 text-gray-700">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className={`py-2 px-3 font-medium ${getTypeColor(p.paymentType)}`}>
                    {p.paymentType || "bKash"}
                  </td>
                  <td className="py-2 px-3 font-mono">{p.trxID}</td>
                  <td className="py-2 px-3">{p.price}৳</td>
                  <td
                    className={`py-2 px-3 font-semibold ${
                      p.status === "verified" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {p.status === "verified" ? "Confirmed" : "Pending"}
                  </td>
                  <td className="py-2 px-3">{formatDateTime(p.createdAt)}</td>
                  <td className="py-2 px-3">{formatDateTime(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
