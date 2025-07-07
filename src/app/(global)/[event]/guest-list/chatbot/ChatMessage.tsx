"use client"

import { motion } from "framer-motion"
import { SparklesIcon, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === "bot"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.2, 0.65, 0.3, 0.9],
      }}
      className={`flex ${isBot ? "flex-row" : "flex-row-reverse"} items-start gap-3`}
    >
      {/* Avatar */}
      <motion.div
        className="flex-shrink-0 mt-1"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {isBot ? (
          <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center shadow-sm">
            <SparklesIcon className="h-4 w-4 text-pink-500" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        )}
      </motion.div>

  
      <div className={`max-w-[85%] ${isBot ? "mr-auto" : "ml-auto"}`}>
     
        <motion.div
          className="text-xs text-gray-500 mb-1 font-medium pl-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          {isBot ? "AI Assistant" : "You"}
        </motion.div>

 
        <motion.div
          className={`px-4 py-3 rounded-2xl ${
            isBot ? "bg-white border border-gray-100 shadow-sm" : "bg-pink-500 text-white shadow-sm"
          }`}
          initial={{ opacity: 0, scale: 0.9, x: isBot ? -20 : 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.175, 0.885, 0.32, 1.1],
          }}
          whileHover={{ scale: 1.01 }}
        >
          {message.content.split("\n").map((line, i) => (
            <div key={`line-${message.id}-${i}`} className={i > 0 ? "mt-2" : ""}>
              {line}
            </div>
          ))}
        </motion.div>

 
        <motion.div
          className="text-xs text-gray-400 mt-1 pl-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}

