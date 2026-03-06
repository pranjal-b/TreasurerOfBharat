import TimelineFeed from "./timeline-feed";

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-default-800">
        Treasury Intelligence
      </h1>
      <TimelineFeed />
    </div>
  );
}
