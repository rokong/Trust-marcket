import { motion } from 'framer-motion';

export default function ProductCard({ product, userLoggedIn }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 cursor-pointer transition-all duration-300 flex flex-col"
    >
      <img src={product.image} alt={product.title} className="rounded-lg mb-4 h-40 object-cover"/>
      <h2 className="text-lg font-semibold">{product.title}</h2>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-2 font-bold text-indigo-600">${product.price}</p>
      {!userLoggedIn && <p className="mt-2 text-red-500 text-sm">Login করতে হবে ক্রয় করতে</p>}
    </motion.div>
  );
}
