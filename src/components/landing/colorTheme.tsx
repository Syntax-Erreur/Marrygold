"use client"

type ColorOption = {
  bgClass: string
  borderClass: string
  ringClass: string
}

type ColorThemeSelectorProps = {
  onSelectColor?: (colorIndex: number) => void
  selectedColorIndex: number | null
}

export default function ColorThemeSelector({ onSelectColor, selectedColorIndex }: ColorThemeSelectorProps) {
  const colorOptions: ColorOption[] = [
    { bgClass: "bg-yellow-50", borderClass: "border-yellow-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-indigo-100", borderClass: "border-indigo-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-sky-100", borderClass: "border-sky-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-lime-100", borderClass: "border-lime-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-teal-100", borderClass: "border-teal-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-pink-100", borderClass: "border-pink-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-red-100", borderClass: "border-red-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-cyan-100", borderClass: "border-cyan-200", ringClass: "ring-blue-500" },
    { bgClass: "bg-purple-200", borderClass: "border-purple-300", ringClass: "ring-blue-500" },
  ]

  const handleColorSelect = (index: number) => {
    onSelectColor?.(index)
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-normal text-gray-800">Select Theme Color</h3>
      <div className="flex flex-wrap gap-4">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            className="flex justify-center items-center w-8 h-8"
            onClick={() => handleColorSelect(index)}
            aria-label={`Select color option ${index + 1}`}
            aria-pressed={selectedColorIndex === index}
          >
            <div
              className={`w-7 h-7 rounded-full border ${color.borderClass} ${color.bgClass} ${
                selectedColorIndex === index ? `ring-2 ${color.ringClass}` : ""
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

