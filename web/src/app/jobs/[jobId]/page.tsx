import { Suspense } from "react";
import { JobDetails } from "./job-details";

export default function JobPage({ params }: PageProps<"/jobs/[jobId]">) {
  return (
    <Suspense fallback={<p role="status">Загрузка задачи…</p>}>
      <JobPageContent params={params} />
    </Suspense>
  );
}

async function JobPageContent({
  params,
}: Pick<PageProps<"/jobs/[jobId]">, "params">) {
  const { jobId } = await params;
  return <JobDetails jobId={jobId} />;
}
