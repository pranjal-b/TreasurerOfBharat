import JobsList from "./jobs-list";

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-default-800">Treasury Jobs</h1>
      <JobsList />
    </div>
  );
}
