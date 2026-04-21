import { PageHeader } from "@/components/layout/page-header";
import { SubjectGrid } from "@/components/subjects/subject-grid";
import { getSubjects } from "@/lib/actions/subjects";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <>
      <PageHeader
        title="科目"
        description="学習科目の管理"
      />
      <SubjectGrid subjects={subjects} />
    </>
  );
}
