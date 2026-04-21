import { PageHeader } from "@/components/layout/page-header";

export default function TimerPage() {
  return (
    <>
      <PageHeader title="タイマー" description="ポモドーロタイマーで集中学習" />
      <p className="text-muted-foreground">準備中...</p>
    </>
  );
}
