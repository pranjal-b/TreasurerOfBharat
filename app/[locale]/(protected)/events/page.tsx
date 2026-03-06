import EventsList from "./events-list";

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-default-800">Events</h1>
      <EventsList />
    </div>
  );
}
