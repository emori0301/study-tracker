"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

export async function getGoal() {
  const userId = await getUserId();
  return prisma.goal.findUnique({ where: { userId } });
}

export async function upsertGoal(dailyMinutes: number) {
  const userId = await getUserId();
  await prisma.goal.upsert({
    where: { userId },
    update: { dailyMinutes },
    create: { userId, dailyMinutes },
  });
  revalidatePath("/");
  revalidatePath("/settings");
}
