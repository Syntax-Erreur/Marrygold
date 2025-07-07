"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

interface ChatbotButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatbotButton({ onClick, isOpen }: ChatbotButtonProps) {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: isOpen ? 0 : 1,
        opacity: isOpen ? 0 : 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
    >
      <Button
        onClick={onClick}
        size="lg"
        className="w-14 h-14 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600 transition-all"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </motion.div>
  )
}

