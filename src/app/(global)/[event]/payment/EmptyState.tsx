import { Folder } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  onCreatePayment: () => void
}

export default function EmptyState({ onCreatePayment }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-[#FFF1F7] flex items-center justify-center mb-6">
        <img src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743371866/marrygold/upload_irnsej.png" alt="" />
      </div>
      <h3 className="text-lg font-medium text-[#252525] mb-2">
        Drag your file(s) to start uploading
      </h3>
      <p className="text-sm text-[#8F8F8F] mb-6">OR</p>
      <div className="mt-2">
                  <label className="cursor-pointer">
                    <div className="bg-[#D10562] hover:bg-[#C10452] transition-colors text-white font-['Inter'] font-semibold px-6 py-3 rounded-lg flex items-center justify-center">
                      Browse files
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
              
                      />
                    </div>
                  </label>
                </div>
    </div>
  )
} 