"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getWeeklyStats() {
  const userId = await getUserId();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return startOfDay(d);
  });

  const since = days[0];
  const sessions = await prisma.session.findMany({
    where: { userId, date: { gte: since } },
    include: { subject: true },
  });

  return days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const daySessions = sessions.filter((s: typeof sessions[number]) => s.date >= day && s.date < next);
    const totalMinutes = daySessions.reduce((sum: number, s: typeof sessions[number]) => sum + s.duration, 0);
    return {
      date: day.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }),
      minutes: totalMinutes,
    };
  });
}

export async function getSubjectStats() {
  const userId = await getUserId();
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const sessions = await prisma.session.findMany({
    where: { userId, date: { gte: since } },
    include: { subject: true },
  });

  const map = new Map<string, { name: string; color: string; icon: string; minutes: number }>();
  for (const s of sessions) {
    const existing = map.get(s.subjectId);
    if (existing) {
      existing.minutes += s.duration;
    } else {
      map.set(s.subjectId, {
        name: s.subject.name,
        color: s.subject.color,
        icon: s.subject.icon,
        minutes: s.duration,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.minutes - a.minutes);
}

export async function getSummaryStats() {
  const userId = await getUserId();
  const todayStart = startOfDay(new Date());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  const [todaySessions, weekSessions, allSessions] = await Promise.all([
    prisma.session.findMany({ where: { userId, date: { gte: todayStart } } }),
    prisma.session.findMany({ where: { userId, date: { gte: weekStart } } }),
    prisma.session.findMany({ where: { userId } }),
  ]);

  const sum = (s: { duration: number }[]) => s.reduce((a, b) => a + b.duration, 0);

  return {
    todayMinutes: sum(todaySessions),
    weekMinutes: sum(weekSessions),
    totalMinutes: sum(allSessions),
    totalSessions: allSessions.length,
  };
}

export async function getStreak() {
  const userId = await getUserId();
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  if (sessions.length === 0) return 0;

  const activeDays = new Set(
    sessions.map((s) => startOfDay(new Date(s.date)).toISOString())
  );

  let streak = 0;
  const cursor = startOfDay(new Date());

  while (activeDays.has(cursor.toISOString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getCalendarData() {
  const userId = await getUserId();
  const since = new Date();
  since.setDate(since.getDate() - 364);

  const sessions = await prisma.session.findMany({
    where: { userId, date: { gte: since } },
  });

  const map = new Map<string, number>();
  for (const s of sessions) {
    const key = startOfDay(new Date(s.date)).toISOString();
    map.set(key, (map.get(key) ?? 0) + s.duration);
  }

  return Object.fromEntries(map);
}
