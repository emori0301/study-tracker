import { PageHeader } from "@/components/layout/page-header";
import { DailyProgress } from "@/components/dashboard/daily-progress";
import { PendingTasks } from "@/components/dashboard/pending-tasks";
import { TodaySessions } from "@/components/dashboard/today-sessions";
import { StatsSummary } from "@/components/stats/stats-summary";
import { getTasks } from "@/lib/actions/tasks";
import { getGoal } from "@/lib/actions/goals";
import { getSummaryStats, getStreak } from "@/lib/actions/stats";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getTodaySessions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.session.findMany({
    where: { userId: user.id, date: { gte: today } },
    include: { subject: true },
    orderBy: { date: "desc" },
  });
}

export default async function DashboardPage() {
  const [tasks, goal, summary, streak, todaySessions] = await Promise.all([
    getTasks(),
    getGoal(),
    getSummaryStats(),
    getStreak(),
    getTodaySessions(),
  ]);

  const goalMinutes = goal?.dailyMinutes ?? 120;

  return (
    <>
      <PageHeader title="ダッシュボード" description="今日の学習状況" />
      <div className="space-y-6">
        <StatsSummary {...summary} streak={streak} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DailyProgress todayMinutes={summary.todayMinutes} goalMinutes={goalMinutes} />
          <PendingTasks tasks={tasks} />
          <TodaySessions sessions={todaySessions} />
        </div>
      </div>
    </>
  );
}
