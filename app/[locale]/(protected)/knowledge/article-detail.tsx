"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/components/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Article = {
  id: string;
  title: string;
  abstract: string;
  body: string;
  status: string;
  industry: string | null;
  tags: string[];
  createdAt: string;
};

export default function ArticleDetail({ id }: { id: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-default-500">Loading...</p>;
  if (!article) {
    return (
      <div className="py-8">
        <p className="text-default-500">Article not found.</p>
        <Button variant="link" onClick={() => router.push(`/${locale}/knowledge`)}>
          Back to Knowledge Library
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push(`/${locale}/knowledge`)}
      >
        Back to Knowledge Library
      </Button>
      <article>
        <h1 className="mb-2 text-2xl font-semibold text-default-800">{article.title}</h1>
        <p className="mb-4 text-sm text-default-500">
          {new Date(article.createdAt).toLocaleDateString()}
          {article.industry && ` · ${article.industry}`}
        </p>
        <p className="mb-6 text-default-600">{article.abstract}</p>
        <div className="prose max-w-none text-default-700 whitespace-pre-wrap">
          {article.body}
        </div>
        {article.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-default-200 px-2 py-1 text-sm text-default-600"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
