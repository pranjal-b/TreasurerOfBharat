"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Award = {
  id: string;
  name: string;
  eligibilityCriteria: string | null;
  categories: string | null;
  applicationProcess: string | null;
};

export default function AwardsList() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/awards")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setAwards(j.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-default-500">Loading...</p>;
  if (awards.length === 0) {
    return (
      <p className="rounded-lg border border-default-200 bg-default-50 p-6 text-center text-default-600">
        No awards listed yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {awards.map((a) => (
        <Card key={a.id}>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium text-default-800">{a.name}</h2>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-default-600">
            {a.eligibilityCriteria && <p>{a.eligibilityCriteria}</p>}
            {a.categories && <p>Categories: {a.categories}</p>}
            {a.applicationProcess && <p>{a.applicationProcess}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
