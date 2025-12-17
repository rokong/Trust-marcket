import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function Payment() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) setUserLoggedIn(true);
    }
  }, []);

  if(!userLoggedIn) return <div className="p-8">Login করতে হবে।</div>

  const gateways = ["bKash", "Nagad", "Rocket", "Bank Transfer"];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold p-4">Payment</h1>
      <div className="p-4 flex flex-col gap-4">
        {gateways.map(g => (
          <motion.button
            key={g}
            whileHover={{ scale:1.05 }}
            onClick={() => setSelectedGateway(g)}
            className={`p-3 rounded-lg shadow-lg ${selectedGateway===g ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800"}`}
          >
            {g}
          </motion.button>
        ))}
        {selectedGateway && (
          <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded">
            <p>Selected Gateway: {selectedGateway}</p>
            <p>Commission: 10%</p>
            <p>Escrow Status: Pending</p>
          </div>
        )}
      </div>
    </div>
  );
}
