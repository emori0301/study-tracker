import { PageHeader } from "@/components/layout/page-header";
import { TimerPageClient } from "@/components/timer/timer-page-client";
import { getSubjects } from "@/lib/actions/subjects";

export default async function TimerPage() {
  const subjects = await getSubjects();

  return (
    <>
      <PageHeader title="タイマー" description="ポモドーロタイマーで集中学習" />
      <div className="flex justify-center py-6">
        <TimerPageClient subjects={subjects} />
      </div>
    </>
  );
}
