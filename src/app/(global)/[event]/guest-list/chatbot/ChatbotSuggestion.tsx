"use client"

import { motion } from "framer-motion"

interface ChatbotSuggestionProps {
  text: string
  onClick: (text: string) => void
  delay: number
}

export function ChatbotSuggestion({ text, onClick, delay }: ChatbotSuggestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay,
        ease: "easeOut",
      }}
      className="w-full"
    >
      <motion.button
        onClick={() => onClick(text)}
        whileHover={{
          scale: 1.02,
          backgroundColor: "rgba(253, 242, 248, 1)",
          borderColor: "rgba(249, 168, 212, 0.5)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        }}
        whileTap={{ scale: 0.98 }}
        className="text-left w-full px-4 py-3 rounded-xl border border-pink-100
                   bg-white shadow-sm
                   transition-all duration-200 ease-in-out text-sm"
      >
        {text}
      </motion.button>
    </motion.div>
  )
}

