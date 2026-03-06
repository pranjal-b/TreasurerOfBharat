import OnboardingForm from "./onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="mb-2 text-2xl font-semibold text-default-800">
        Welcome to Treasurers of Bharat
      </h1>
      <p className="mb-8 text-default-500">
        Complete this short survey so we can personalize your experience.
      </p>
      <OnboardingForm />
    </div>
  );
}
