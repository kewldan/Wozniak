import { mockJobs } from "@/lib/mocks";

export default function Home() {
  return (
    <main>
      <ul>
        {mockJobs.items.map((job) => (
          <li key={job.id}>
            {job.name} — {job.state === "succeeded" ? "успешно" : job.state}
          </li>
        ))}
      </ul>
    </main>
  );
}