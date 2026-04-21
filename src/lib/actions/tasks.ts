"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function getTasks() {
  const user = await getUser();
  return prisma.task.findMany({
    where: { userId: user.id },
    include: { subject: true },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTask(data: {
  title: string;
  subjectId: string;
  dueDate?: string;
}) {
  const user = await getUser();
  await prisma.task.create({
    data: {
      userId: user.id,
      title: data.title,
      subjectId: data.subjectId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
  revalidatePath("/tasks");
}

export async function updateTask(id: string, data: {
  title?: string;
  subjectId?: string;
  dueDate?: string | null;
  completed?: boolean;
}) {
  const user = await getUser();
  await prisma.task.updateMany({
    where: { id, userId: user.id },
    data: {
      ...data,
      dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
  revalidatePath("/tasks");
}

export async function deleteTask(id: string) {
  const user = await getUser();
  await prisma.task.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/tasks");
}
