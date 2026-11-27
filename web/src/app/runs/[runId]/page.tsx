import { Suspense } from "react";
import { RunDetails } from "./run-details";

export default function RunPage({ params }: PageProps<"/runs/[runId]">) {
  return (
    <Suspense fallback={<p role="status">Загрузка деталей запуска…</p>}>
      <RunPageContent params={params} />
    </Suspense>
  );
}

async function RunPageContent({
  params,
}: Pick<PageProps<"/runs/[runId]">, "params">) {
  const { runId } = await params;
  return <RunDetails runId={runId} />;
}
