import { PageHeader } from "@/components/layout/page-header";
import { StatsSummary } from "@/components/stats/stats-summary";
import { WeeklyChart } from "@/components/stats/weekly-chart";
import { SubjectPie } from "@/components/stats/subject-pie";
import { CalendarHeatmap } from "@/components/stats/calendar-heatmap";
import { getWeeklyStats, getSubjectStats, getSummaryStats, getStreak, getCalendarData } from "@/lib/actions/stats";

export default async function StatsPage() {
  const [weekly, subjects, summary, streak, calendar] = await Promise.all([
    getWeeklyStats(),
    getSubjectStats(),
    getSummaryStats(),
    getStreak(),
    getCalendarData(),
  ]);

  return (
    <>
      <PageHeader title="統計" description="学習時間の分析" />
      <div className="space-y-6">
        <StatsSummary {...summary} streak={streak} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyChart data={weekly} />
          <SubjectPie data={subjects} />
        </div>
        <CalendarHeatmap data={calendar} />
      </div>
    </>
  );
}
