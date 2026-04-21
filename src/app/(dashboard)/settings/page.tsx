import { PageHeader } from "@/components/layout/page-header";
import { GoalSettingsForm } from "@/components/settings/goal-settings-form";
import { TimerSettingsForm } from "@/components/settings/timer-settings-form";
import { getGoal } from "@/lib/actions/goals";

export default async function SettingsPage() {
  const goal = await getGoal();

  return (
    <>
      <PageHeader title="設定" description="タイマー・目標の設定" />
      <div className="max-w-xl space-y-6">
        <GoalSettingsForm currentMinutes={goal?.dailyMinutes ?? 120} />
        <TimerSettingsForm />
      </div>
    </>
  );
}
