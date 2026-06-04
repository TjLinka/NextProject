"use client";
import * as motion from "motion/react-client";

export default function DragGrid() {
  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        className="bg-red-600 w-10 h-10"
      />
      1
    </div>
  );
}
