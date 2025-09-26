'use client';

import { motion } from "framer-motion";
import Image from "next/image";

export default function MyBabyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-white">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">My Mini Baby</h1>

      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="relative w-[280px] h-[280px]"
      >
        <Image
          src="/baby.png"
          alt="My Mini Baby"
          fill
          className="rounded-xl drop-shadow-2xl object-contain"
        />
      </motion.div>

      <p className="mt-6 text-gray-600 text-center">
        So real! So mini! So cute! 💖
      </p>
    </div>
  );
}
