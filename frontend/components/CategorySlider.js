import { motion } from 'framer-motion';

export default function CategorySlider({ categories }) {
  return (
    <div className="flex overflow-x-auto gap-4 p-4">
      {categories.map((cat, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.1 }}
          className="min-w-max bg-indigo-600 text-white px-6 py-2 rounded-full cursor-pointer"
        >
          {cat}
        </motion.div>
      ))}
    </div>
  );
}
