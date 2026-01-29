import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClickButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  colorClass?: string;
  index: number;
}

export function ClickButton({ label, onClick, disabled, colorClass, index }: ClickButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full h-32 rounded-2xl p-6 flex flex-col items-center justify-center gap-2",
        "border border-transparent hover:border-black/5 transition-all duration-300",
        "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10",
        "text-lg font-display font-semibold tracking-wide",
        disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer",
        colorClass
      )}
    >
      <span className="text-3xl font-bold">{index + 1}</span>
      <span className="uppercase text-xs tracking-widest opacity-80 font-sans">{label}</span>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.button>
  );
}
