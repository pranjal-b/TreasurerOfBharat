"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "@/components/navigation";
import { useParams } from "next/navigation";

const userRoles = [
  "Treasurer",
  "Treasury Analyst",
  "CFO",
  "Finance Professional",
  "Student",
];

const companySizes = ["1-50", "51-200", "201-500", "500+"];
const treasuryFunctionsOptions = [
  "Cash management",
  "Liquidity management",
  "FX risk management",
  "Debt management",
  "Investments",
  "Bank relationship management",
  "Payments management",
  "In-house banking",
];

const schema = z.object({
  userRole: z.string().min(1),
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  country: z.string().optional(),
  teamSize: z.string().optional(),
  reportingStructure: z.string().optional(),
  treasuryFunctions: z.array(z.string()).optional(),
  tmsName: z.string().optional(),
  bankConnectivityMethod: z.string().optional(),
  erpIntegration: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userRole: "",
      companyName: "",
      industry: "",
      companySize: "",
      country: "India",
      teamSize: "",
      reportingStructure: "",
      treasuryFunctions: [],
      tmsName: "",
      bankConnectivityMethod: "",
      erpIntegration: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userRole: data.userRole,
          companyName: data.companyName,
          industry: data.industry || undefined,
          companySize: data.companySize || undefined,
          country: data.country || undefined,
          teamSize: data.teamSize || undefined,
          reportingStructure: data.reportingStructure || undefined,
          treasuryFunctions: data.treasuryFunctions || [],
          tmsName: data.tmsName || undefined,
          bankConnectivityMethod: data.bankConnectivityMethod || undefined,
          erpIntegration: data.erpIntegration || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      router.replace(`/${locale}/timeline`);
    } catch (e) {
      form.setError("root", { message: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label>Your role</Label>
            <Select
              onValueChange={(v) => form.setValue("userRole", v)}
              value={form.watch("userRole")}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.userRole && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.userRole.message}
              </p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label>Company name</Label>
            <Input
              {...form.register("companyName")}
              className="mt-2"
              placeholder="Acme Corp"
            />
            {form.formState.errors.companyName && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>
          <div>
            <Label>Industry</Label>
            <Input
              {...form.register("industry")}
              className="mt-2"
              placeholder="e.g. Manufacturing"
            />
          </div>
          <div>
            <Label>Company size</Label>
            <Select
              onValueChange={(v) => form.setValue("companySize", v)}
              value={form.watch("companySize")}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Country</Label>
            <Input
              {...form.register("country")}
              className="mt-2"
              placeholder="India"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <Label>Treasury team size</Label>
            <Input
              {...form.register("teamSize")}
              className="mt-2"
              placeholder="e.g. 1-5"
            />
          </div>
          <div>
            <Label>Reporting structure</Label>
            <Input
              {...form.register("reportingStructure")}
              className="mt-2"
              placeholder="e.g. Reports to CFO"
            />
          </div>
          <div>
            <Label>Treasury functions (select all that apply)</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {treasuryFunctionsOptions.map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <Checkbox
                    id={opt}
                    checked={(form.watch("treasuryFunctions") || []).includes(opt)}
                    onCheckedChange={(checked) => {
                      const current = form.getValues("treasuryFunctions") || [];
                      if (checked) {
                        form.setValue("treasuryFunctions", [...current, opt]);
                      } else {
                        form.setValue(
                          "treasuryFunctions",
                          current.filter((x) => x !== opt)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={opt} className="font-normal">
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <Label>Treasury Management System</Label>
            <Input
              {...form.register("tmsName")}
              className="mt-2"
              placeholder="e.g. SAP, Kyriba"
            />
          </div>
          <div>
            <Label>Bank connectivity method</Label>
            <Input
              {...form.register("bankConnectivityMethod")}
              className="mt-2"
              placeholder="e.g. SWIFT, API"
            />
          </div>
          <div>
            <Label>ERP integration</Label>
            <Input
              {...form.register("erpIntegration")}
              className="mt-2"
              placeholder="e.g. SAP, Oracle"
            />
          </div>
        </div>
      )}

      {form.formState.errors.root && (
        <p className="text-sm text-red-500">
          {form.formState.errors.root.message}
        </p>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Back
        </Button>
        <Button type="submit" disabled={submitting}>
          {step < 4 ? "Next" : "Complete"}
        </Button>
      </div>
    </form>
  );
}
