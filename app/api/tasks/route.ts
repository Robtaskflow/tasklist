import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET
export async function GET() {
  const tasks = await prisma.task.findMany()
  return NextResponse.json(tasks)
}

// POST
export async function POST(request: Request) {
  const body = await request.json()

  const newTask = await prisma.task.create({
    data: {
      title: body.title,
      completed: false,
    },
  })

  return NextResponse.json(newTask)
}

// DELETE
export async function DELETE(request: Request) {
  const body = await request.json()
  const id = body.id

  const deleted = await prisma.task.delete({
    where: { id: Number(id) },
  })

  return NextResponse.json(deleted)
}

// PATCH
export async function PATCH(request: Request) {
  const body = await request.json()

  const { id, title } = body

  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  })

  if (!task) {
    return new Response("Task not found", { status: 404 })
  }

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: {
      completed: body.completed ?? task.completed,
      title: title ?? task.title,
    },
  })

  return Response.json(updated)
}