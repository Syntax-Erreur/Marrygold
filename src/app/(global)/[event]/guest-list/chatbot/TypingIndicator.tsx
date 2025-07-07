"use client"

import { motion } from "framer-motion"
import { SparklesIcon } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
          <SparklesIcon className="h-4 w-4 text-pink-500" />
        </div>
      </div>

      <div className="max-w-[85%] mr-auto">
        <div className="text-xs text-gray-500 mb-1">AI Assistant</div>

        <motion.div
          className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-pink-400 rounded-full"
              animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="w-2 h-2 bg-pink-400 rounded-full"
              animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: 0.2,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="w-2 h-2 bg-pink-400 rounded-full"
              animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: 0.4,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        <div className="text-xs text-gray-400 mt-1">Typing...</div>
      </div>
    </div>
  )
}

