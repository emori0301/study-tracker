import { PageHeader } from "@/components/layout/page-header";
import { TaskList } from "@/components/tasks/task-list";
import { getTasks } from "@/lib/actions/tasks";
import { getSubjects } from "@/lib/actions/subjects";

export default async function TasksPage() {
  const [tasks, subjects] = await Promise.all([getTasks(), getSubjects()]);

  return (
    <>
      <PageHeader title="タスク" description="学習タスクの管理" />
      {subjects.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          まず<a href="/subjects" className="text-primary hover:underline">科目</a>を登録してください
        </p>
      ) : (
        <TaskList tasks={tasks} subjects={subjects} />
      )}
    </>
  );
}
