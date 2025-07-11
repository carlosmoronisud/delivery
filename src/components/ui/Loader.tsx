import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-64 w-full">
      <motion.div
        className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
