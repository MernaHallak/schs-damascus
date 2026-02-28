"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
