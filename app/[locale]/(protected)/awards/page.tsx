import AwardsList from "./awards-list";

export default function AwardsPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-default-800">Awards</h1>
      <AwardsList />
    </div>
  );
}
