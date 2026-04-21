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

export async function getSubjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  return prisma.subject.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
}

export async function createSubject(data: { name: string; color: string; icon: string }) {
  const user = await getUser();
  await prisma.subject.create({ data: { userId: user.id, ...data } });
  revalidatePath("/subjects");
}

export async function updateSubject(id: string, data: { name: string; color: string; icon: string }) {
  const user = await getUser();
  await prisma.subject.updateMany({ where: { id, userId: user.id }, data });
  revalidatePath("/subjects");
  revalidatePath("/tasks");
}

export async function deleteSubject(id: string) {
  const user = await getUser();
  await prisma.subject.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/subjects");
  revalidatePath("/tasks");
}
