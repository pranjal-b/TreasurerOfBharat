"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Event = {
  id: string;
  name: string;
  organizer: string;
  location: string;
  date: string;
  description: string | null;
  registrationLink: string | null;
  type: string;
};

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setEvents(j.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-default-500">Loading...</p>;
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-default-200 bg-default-50 p-6 text-center text-default-600">
        No events listed yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((e) => (
        <Card key={e.id}>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium text-default-800">{e.name}</h2>
            <p className="text-sm text-default-500">{e.organizer} · {e.location}</p>
            <p className="text-sm text-default-500">
              {new Date(e.date).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            {e.description && <p className="text-default-600">{e.description}</p>}
            {e.registrationLink && (
              <a
                href={e.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-primary-500 hover:underline"
              >
                Register
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
