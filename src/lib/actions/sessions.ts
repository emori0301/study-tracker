"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function createSession({
  subjectId,
  taskId,
  duration,
}: {
  subjectId: string;
  taskId?: string;
  duration: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.session.create({
    data: {
      userId: user.id,
      subjectId,
      taskId: taskId ?? null,
      duration,
      date: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/stats");
}
