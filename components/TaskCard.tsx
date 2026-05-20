import { Trash2 } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

type TaskCardProps = {
  title: string
  completed: boolean
  onDelete: () => void
  onToggle: () => void
  onEdit: (newTitle: string) => void
}

export default function TaskCard({
  title,
  completed,
  onDelete,
  onToggle,
  onEdit,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)

  function handleSave() {
    const trimmed = editValue.trim()

    if (trimmed === "") {
      setEditValue(title)
      setIsEditing(false)
      return
    }

    onEdit(trimmed)
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-5 rounded-3xl flex items-center justify-between hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="mr-4"
        />

        {isEditing ? (
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
            }}
            autoFocus
            className="bg-gray-700 p-2 rounded-xl w-full mr-4 outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`cursor-pointer flex-1 ${
              completed
                ? "line-through text-white/30"
                : "text-white"
            }`}
          >
            {title}
          </span>
        )}
      </div>

      <button
        onClick={onDelete}
        className="text-red-500 hover:scale-110 transition ml-4"
      >
        <Trash2 size={20} />
      </button>
    </motion.div>
  )
}