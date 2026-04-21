import { PageHeader } from "@/components/layout/page-header";
import { TimerContainer } from "@/components/timer/timer-container";
import { getSubjects } from "@/lib/actions/subjects";
import type { TimerSettings } from "@/types";

const DEFAULT_SETTINGS: TimerSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

export default async function TimerPage() {
  const subjects = await getSubjects();

  return (
    <>
      <PageHeader title="タイマー" description="ポモドーロタイマーで集中学習" />
      <div className="flex justify-center py-6">
        <TimerContainer subjects={subjects} settings={DEFAULT_SETTINGS} />
      </div>
    </>
  );
}
