"use client"

import { useState, type KeyboardEvent, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ChatbotInputProps {
  onSend: (message: string) => void
}

export function ChatbotInput({ onSend }: ChatbotInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (message.trim()) {
      setIsSending(true)
 
      setTimeout(() => {
        onSend(message.trim())
        setMessage("")
        setIsSending(false)

 
        inputRef.current?.focus()
      }, 150)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      className="flex items-center gap-2 relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about your event"
        className="pr-10 h-11 border-pink-100 focus-visible:ring-pink-200 focus-visible:ring-opacity-50 bg-white transition-all duration-200"
        disabled={isSending}
      />

      <AnimatePresence mode="wait">
        {isSending ? (
          <motion.div
            key="sending"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute right-3 text-pink-400"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Send className="h-5 w-5" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="send"
            whileHover={{ scale: 1.1, color: "#db2777" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="absolute right-3 text-pink-500 transition-all duration-200"
            aria-label="Send message"
            disabled={message.trim() === ""}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

