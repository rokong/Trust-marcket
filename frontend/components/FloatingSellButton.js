import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function FloatingSellButton() {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl z-50"
      onClick={() => router.push('/sell')}
    >
      Sell Item
    </motion.button>
  );
}
