"use client";
import { LayoutTextFlip } from "./TextFlip";
import { motion } from "motion/react";
import { useAuth } from "../../../../../contexts/AuthContext";

export function LayoutTextFlipDemo() {
  const {currentUser, setCurrentUser} = useAuth();
  return (
    <div>
      <motion.div
        className="relative mx-4 my-1 flex flex-col items-center justify-center gap-2 text-center sm:mx-0 sm:mb-0 sm:flex-row sm:ml-10">
        <LayoutTextFlip
          text="Hello, "
          words={[currentUser?.name || "User"]} />
      </motion.div>
    </div>
  );
}
