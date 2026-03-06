"use client";

import { useRouter } from "@/components/navigation";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  body: z.string().min(1, "Body is required"),
  industry: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ArticleForm() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      abstract: "",
      body: "",
      industry: "",
      tags: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        abstract: data.abstract,
        body: data.body,
        industry: data.industry || undefined,
        tags: data.tags ? data.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      form.setError("root", { message: err.error || "Failed to submit" });
      return;
    }
    router.push(`/${locale}/knowledge`);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input {...form.register("title")} className="mt-2" placeholder="Article title" />
        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.title.message}</p>
        )}
      </div>
      <div>
        <Label>Abstract</Label>
        <Textarea
          {...form.register("abstract")}
          className="mt-2 min-h-[100px]"
          placeholder="Short summary"
        />
        {form.formState.errors.abstract && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.abstract.message}</p>
        )}
      </div>
      <div>
        <Label>Full article</Label>
        <Textarea
          {...form.register("body")}
          className="mt-2 min-h-[200px]"
          placeholder="Article content"
        />
        {form.formState.errors.body && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.body.message}</p>
        )}
      </div>
      <div>
        <Label>Industry (optional)</Label>
        <Input {...form.register("industry")} className="mt-2" placeholder="e.g. Manufacturing" />
      </div>
      <div>
        <Label>Tags (comma-separated, optional)</Label>
        <Input {...form.register("tags")} className="mt-2" placeholder="cash, liquidity, RBI" />
      </div>
      {form.formState.errors.root && (
        <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
      )}
      <Button type="submit">Submit for review</Button>
    </form>
  );
}
