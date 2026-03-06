"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TimelineItem = {
  id: string;
  title: string;
  source: string;
  summary: string;
  link: string | null;
  type: string;
  createdAt: string;
};

export default function TimelineFeed() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (cursor?: string) => {
    const url = cursor
      ? `/api/timeline?cursor=${cursor}&limit=20`
      : "/api/timeline?limit=20";
    const res = await fetch(url);
    if (!res.ok) return;
    const json = await res.json();
    if (cursor) {
      setItems((prev) => [...prev, ...json.data]);
    } else {
      setItems(json.data);
    }
    setNextCursor(json.nextCursor);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-default-500">Loading timeline...</p>;
  }

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-default-200 bg-default-50 p-6 text-center text-default-600">
        No timeline items yet. Check back later for treasury news and updates.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase text-default-500">
                {item.type}
              </span>
              <span className="text-xs text-default-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg font-medium text-default-800">{item.title}</h2>
            <p className="text-sm text-default-500">{item.source}</p>
          </CardHeader>
          <CardContent>
            <p className="text-default-600">{item.summary}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-primary-500 hover:underline"
              >
                Read more
              </a>
            )}
          </CardContent>
        </Card>
      ))}
      {nextCursor && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => load(nextCursor)}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
