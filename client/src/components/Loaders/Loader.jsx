import React from "react";
import { LoaderTwo } from "./ui/LoaderAnimation.jsx";
import { motion } from "framer-motion";

export function LoaderTwoDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full">
      <LoaderTwo />
      <motion.p 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-slate-500 font-medium tracking-wide animate-pulse"
      >
        Loading your dashboard...
      </motion.p>
    </div>
  );
}
