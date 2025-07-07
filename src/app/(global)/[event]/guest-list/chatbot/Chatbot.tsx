"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SparklesIcon, X, RefreshCw } from "lucide-react"
import { ChatbotSuggestion } from "./ChatbotSuggestion"
import { ChatbotInput } from "./ChatbotInput"
import { ChatMessage } from "./ChatMessage"
import { TypingIndicator } from "./TypingIndicator"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const mockResponses: Record<string, string> = {
  "How to manage guest preferences smoothly?":
    "To manage guest preferences smoothly, I recommend:\n\n1. Create a digital preference form that guests can fill out in advance\n2. Use a centralized database to track preferences for recurring events\n3. Categorize preferences (dietary, accessibility, seating) for easier implementation\n4. Send follow-up emails confirming their preferences were received\n5. Train staff to discreetly accommodate special requests",

  "Tips for organizing seating arrangements effectively?":
    "For effective seating arrangements:\n\n1. Create digital seating charts using tools like AllSeated or Social Tables\n2. Consider relationships and dynamics between guests\n3. Place people with similar interests near each other\n4. Create clear table markers and place cards\n5. Keep a digital backup of your seating chart for last-minute changes",

  "Best way to follow up with guests?":
    "Best practices for guest follow-up:\n\n1. Send a thank-you email within 24-48 hours after the event\n2. Include personalized highlights from the event\n3. Share photos or a highlight reel if available\n4. Request feedback through a brief survey\n5. Provide information about upcoming events they might enjoy",

  "How to handle last-minute cancellations?":
    "For handling last-minute cancellations:\n\n1. Maintain a waitlist of guests who wanted to attend\n2. Have flexible catering arrangements that can scale up or down\n3. Create a cancellation policy and communicate it clearly\n4. Consider a non-refundable deposit for events with high demand\n5. Follow up with people who canceled to maintain the relationship",
}

interface ChatbotProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  suggestions?: string[]
}

export function Chatbot({ isOpen, onOpenChange, suggestions = [] }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const defaultSuggestions = [
    "How to manage guest preferences smoothly?",
    "Tips for organizing seating arrangements effectively?",
    "Best way to follow up with guests?",
    "How to handle last-minute cancellations?",
  ]

  const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions

   const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

   const getRandomTypingDuration = () => {
    return Math.floor(Math.random() * 2000) + 1000
  }

   const handleBotReply = (text: string) => {
    setIsTyping(true)

     setTimeout(() => {
      setIsTyping(false)

       setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: text,
          sender: "bot",
          timestamp: new Date(),
        },
      ])

       if (showSuggestions) {
        setShowSuggestions(false)
      }
    }, getRandomTypingDuration())
  }

  const handleSuggestionClick = (text: string) => {
     setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
      },
    ])

     if (mockResponses[text]) {
      handleBotReply(mockResponses[text])
    } else {
      handleBotReply("I don't have specific information about that yet, but I'm learning!")
    }
  }

  const handleSendMessage = (message: string) => {
     setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      },
    ])

     const matchedSuggestion = allSuggestions.find((suggestion) => suggestion.toLowerCase() === message.toLowerCase())

    if (matchedSuggestion && mockResponses[matchedSuggestion]) {
      handleBotReply(mockResponses[matchedSuggestion])
    } else {
       handleBotReply(
        "Thanks for your question! That's a great query about event planning. I'll need more specific information to provide a detailed response, but I'm here to help with any aspect of your event planning needs.",
      )
    }
  }

   useEffect(() => {
    if (isOpen) {
      setMessages([])
      setShowSuggestions(true)
    }
  }, [isOpen])

   const handleClearChat = () => {
    setMessages([])
    setShowSuggestions(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => onOpenChange(false)}
          />

           <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="fixed bottom-4 right-4 w-[90vw] sm:w-[450px] h-[600px] max-h-[85vh] rounded-2xl overflow-hidden shadow-xl z-50 flex flex-col"
          >
            <div className="h-full flex flex-col bg-white">
               <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-100">
                    <SparklesIcon className="h-4 w-4 text-pink-500" />
                  </div>
                  <h3 className="font-medium text-lg">Ask our AI</h3>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <motion.button
                      onClick={handleClearChat}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(229, 231, 235, 1)" }}
                      whileTap={{ scale: 0.95 }}
                      className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-200"
                      title="Clear chat"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => onOpenChange(false)}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(229, 231, 235, 1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>

               <motion.div
                ref={messagesContainerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 overflow-y-auto scrollbar-thin bg-[#f9f5ff]"
              >
                <div className="p-5">
                  {messages.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="text-center text-gray-500 text-sm mb-6"
                    >
                      Ask our AI anything you can get help in AI
                    </motion.p>
                  )}

                   <div className="space-y-6 mb-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}

                     {isTyping && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <TypingIndicator />
                      </motion.div>
                    )}

                     <div ref={messagesEndRef} />
                  </div>

                   {showSuggestions && messages.length === 0 && (
                    <div className="space-y-3 mb-6">
                      {allSuggestions.map((suggestion, index) => (
                        <ChatbotSuggestion
                          key={`suggestion-${suggestion}`}
                          text={suggestion}
                          onClick={handleSuggestionClick}
                          delay={0.2 + index * 0.05}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

               <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                className="p-4 border-t border-gray-100 bg-white"
              >
                <ChatbotInput onSend={handleSendMessage} />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

