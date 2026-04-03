"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type WaitlistValues = z.infer<typeof schema>;

export function WaitlistForm() {
  const [isPending, startTransition] = React.useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const onSubmit = (data: WaitlistValues) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const payload = (await res.json()) as { ok?: boolean; message?: string };

        if (!res.ok || !payload.ok) {
          toast.error(payload.message ?? "Could not join the waitlist.");
          return;
        }

        toast.success(payload.message ?? "You’re on the list.");
        reset();
      } catch {
        toast.error(
          "Could not join the waitlist. Check your connection and try again."
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start w-full">
      <div className="space-y-2">
        <Label htmlFor="waitlist-email">Email</Label>
        <Input
          id="waitlist-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email?.message ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
            Joining…
          </>
        ) : (
          "Join the waitlist"
        )}
      </Button>
    </form>
  );
}
