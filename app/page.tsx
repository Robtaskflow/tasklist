"use client"

import { useEffect, useState } from "react"
import TaskCard from "../components/TaskCard"
import { AnimatePresence } from "framer-motion"

type Task = {
  id: number
  title: string
  completed: boolean
}

export default function Home() {
  const [task, setTask] = useState("")
  console.log(task)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const filteredTasks = tasks.filter(task => {
  if (filter === "active") return !task.completed
  if (filter === "completed") return task.completed
  return true
})
  console.log(filteredTasks)
  //  GET TASKS
  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    }

    fetchTasks()
  }, [])

  //  CREATE TASK
  async function addTask() {
    if (task.trim() === "") return

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: task }),
    })

    const newTask = await response.json()

    console.log ("ANTES:", tasks)
    console.log ("NUEVA:", newTask)
    setTasks(prev => [...prev, newTask])
    setTask("")
  }

  // 🔥 DELETE TASK
  async function deleteTask(id: number) {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })

    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // 🔥 TOGGLE TASK
  async function toggleTask(id: number) {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })

    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }
async function editTask(id: number, newTitle: string) {
  const response = await fetch("/api/tasks", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      title: newTitle,
    }),
  })

  const updated = await response.json()

  setTasks(prev =>
    prev.map(task =>
      task.id === id ? updated : task
    )
  )
}
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

      <div className="flex items-center gap-3 mb-3">
  <img
    src="/logo/logo.png"
    alt="TaskFlow logo"
    className="w-64 h-44 rounded-xl"
  />

  <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
    TaskFlow
  </h1>
</div>
      <p className="text-white/40 text-lg mb-10"></p>

      <div className="flex gap-3 mb-10">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Escribe una tarea..."
         className="flex-1 bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-2xl outline-none focus:border-white/30 transition placeholder:text-white/20"
        />

        <button
          onClick={addTask}
          className="bg-white text-black px-6 rounded-xl font-medium hover:opacity-80 transition"
        >
          Agregar
        </button>
      </div>
      </div>
<div className="flex gap-3 mb-6">
  <button
    onClick={() => setFilter("all")}
    className={`px-4 py-2 rounded-xl transition ${
      filter === "all"
        ? "bg-white text-black"
        : "bg-white/10 text-white"
    }`}
  >
    Todas
  </button>

  <button
    onClick={() => setFilter("active")}
    className={`px-4 py-2 rounded-xl transition ${
      filter === "active"
        ? "bg-white text-black"
        : "bg-white/10 text-white"
    }`}
  >
    Activas
  </button>

  <button
    onClick={() => setFilter("completed")}
    className={`px-4 py-2 rounded-xl transition ${
      filter === "completed"
        ? "bg-white text-black"
        : "bg-white/10 text-white"
    }`}
  >
    Completadas
  </button>
</div>
      <AnimatePresence mode="popLayout">
  <div className="space-y-4">

       {filteredTasks.map((t) => (
         <TaskCard
  key={t.id}
  title={t.title}
  completed={t.completed}
  onDelete={() => deleteTask(t.id)}
  onToggle={() => toggleTask(t.id)}
  onEdit={(newTitle) => editTask(t.id, newTitle)}
/>
        ))}
      </div>
      </AnimatePresence>
    </div>
  )
}