"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Article = {
  id: string;
  title: string;
  abstract: string;
  status: string;
  industry: string | null;
  tags: string[];
  createdAt: string;
};

export default function KnowledgeList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?status=approved")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => setArticles(json.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-default-500">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/knowledge/new">
          <Button>Submit article</Button>
        </Link>
      </div>
      {articles.length === 0 ? (
        <p className="rounded-lg border border-default-200 bg-default-50 p-6 text-center text-default-600">
          No approved articles yet.
        </p>
      ) : (
        articles.map((a) => (
          <Link key={a.id} href={`/knowledge/${a.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <h2 className="text-lg font-medium text-default-800">{a.title}</h2>
                {a.industry && (
                  <span className="text-xs text-default-500">{a.industry}</span>
                )}
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-default-600">{a.abstract}</p>
                {a.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {a.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-default-200 px-2 py-0.5 text-xs text-default-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
