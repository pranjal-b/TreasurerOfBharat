"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  experienceRequired: string | null;
  description: string | null;
  applicationLink: string | null;
};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setJobs(j.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-default-500">Loading...</p>;
  if (jobs.length === 0) {
    return (
      <p className="rounded-lg border border-default-200 bg-default-50 p-6 text-center text-default-600">
        No jobs posted yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((j) => (
        <Card key={j.id}>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium text-default-800">{j.title}</h2>
            <p className="text-sm text-default-500">{j.company} · {j.location}</p>
            {j.experienceRequired && (
              <p className="text-xs text-default-500">{j.experienceRequired}</p>
            )}
          </CardHeader>
          <CardContent>
            {j.description && (
              <p className="line-clamp-2 text-default-600">{j.description}</p>
            )}
            {j.applicationLink && (
              <Button variant="link" className="mt-2 p-0" asChild>
                <a href={j.applicationLink} target="_blank" rel="noopener noreferrer">
                  Apply
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
