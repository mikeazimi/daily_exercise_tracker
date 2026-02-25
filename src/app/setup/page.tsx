"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROGRAM_TEMPLATES, type ProgramTemplate } from "@/lib/data/program-templates";
import { useUserProgram } from "@/hooks/use-user-program";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useBodyMeasurements } from "@/hooks/use-body-measurements";
import { cn } from "@/lib/utils";

// ── Feature toggle definitions ───────────────────────────────────────

interface FeatureOption {
  key: string;
  label: string;
  description: string;
  icon: string;
}

const FEATURES: FeatureOption[] = [
  {
    key: "enableNutrition",
    label: "Nutrition Tracking",
    description: "Log daily calories, protein, carbs, and fat",
    icon: "🍎",
  },
  {
    key: "enableWater",
    label: "Water Intake",
    description: "Track daily hydration with a personalized target",
    icon: "💧",
  },
  {
    key: "enableBodyMeasurements",
    label: "Body Measurements",
    description: "Log weight and body fat percentage over time",
    icon: "⚖️",
  },
  {
    key: "enableProgressPhotos",
    label: "Progress Photos",
    description: "Capture front, side, and back photos to track changes",
    icon: "📷",
  },
  {
    key: "enableDeload",
    label: "Deload Reminders",
    description: "Get reminded to reduce intensity for recovery",
    icon: "🔔",
  },
];

// ── Step components ──────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === current ? "w-6 bg-primary" : i < current ? "w-1.5 bg-primary/50" : "w-1.5 bg-muted"
          )}
        />
      ))}
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="space-y-2">
        <div className="text-5xl">💪</div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Exercise</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Your personal workout companion. Let&apos;s set things up so the app works exactly how you want.
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full max-w-xs py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Get Started
      </button>
    </div>
  );
}

function ProgramStep({
  selectedTemplate,
  onSelect,
  onNext,
  onBack,
}: {
  selectedTemplate: ProgramTemplate | null;
  onSelect: (t: ProgramTemplate) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">How do you train?</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pick a program to start with. You can customize it later in Settings.
        </p>
      </div>

      <div className="space-y-2">
        {PROGRAM_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={cn(
              "w-full text-left rounded-xl border p-4 transition-all",
              selectedTemplate?.id === template.id
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{template.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {template.description}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                {template.daysPerWeek}x/wk
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 text-sm font-medium rounded-xl border border-border hover:bg-muted/50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTemplate}
          className={cn(
            "flex-1 py-3 text-sm font-semibold rounded-xl transition-all",
            selectedTemplate
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function FeaturesStep({
  features,
  onToggle,
  onNext,
  onBack,
}: {
  features: Record<string, boolean>;
  onToggle: (key: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What do you want to track?</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Turn off anything you don&apos;t need. You can always change this in Settings.
        </p>
      </div>

      <div className="space-y-2">
        {FEATURES.map((f) => {
          const enabled = features[f.key] !== false;
          return (
            <button
              key={f.key}
              onClick={() => onToggle(f.key)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border p-4 transition-all text-left",
                enabled
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card opacity-60"
              )}
            >
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
              <div
                className={cn(
                  "w-10 h-6 rounded-full p-0.5 transition-colors shrink-0",
                  enabled ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full bg-white shadow transition-transform",
                    enabled ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 text-sm font-medium rounded-xl border border-border hover:bg-muted/50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function BodyStatsStep({
  onSave,
  onSkip,
  onBack,
  saving,
}: {
  onSave: (weight: number | null, bodyFat: number | null) => void;
  onSkip: () => void;
  onBack: () => void;
  saving: boolean;
}) {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");

  function handleSave() {
    const w = weight ? parseFloat(weight) : null;
    const bf = bodyFat ? parseFloat(bodyFat) : null;
    onSave(w, bf);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Starting stats</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Optional — helps calculate water targets and track your progress over time.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Weight (lbs)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="185.0"
            className="w-full h-12 px-4 text-base bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Body Fat %</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="15.0"
            className="w-full h-12 px-4 text-base bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleSave}
          disabled={saving || (!weight && !bodyFat)}
          className={cn(
            "w-full py-3 text-sm font-semibold rounded-xl transition-all",
            weight || bodyFat
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 text-sm font-medium rounded-xl border border-border hover:bg-muted/50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onSkip}
            className="flex-1 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

function DoneStep({
  templateName,
  enabledFeatures,
  onFinish,
  finishing,
}: {
  templateName: string;
  enabledFeatures: string[];
  onFinish: () => void;
  finishing: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="space-y-3">
        <div className="text-5xl">✅</div>
        <h1 className="text-2xl font-bold">You&apos;re all set!</h1>
        <div className="space-y-2 text-sm text-muted-foreground max-w-xs mx-auto">
          <p>
            Program: <span className="text-foreground font-medium">{templateName}</span>
          </p>
          {enabledFeatures.length > 0 && (
            <p>
              Tracking: <span className="text-foreground font-medium">{enabledFeatures.join(", ")}</span>
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onFinish}
        disabled={finishing}
        className="w-full max-w-xs py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {finishing ? "Setting up..." : "Start Training"}
      </button>
    </div>
  );
}

// ── Main wizard ──────────────────────────────────────────────────────

type Step = "welcome" | "program" | "features" | "body" | "done";

const STEP_ORDER: Step[] = ["welcome", "program", "features", "body", "done"];

export default function SetupPage() {
  const router = useRouter();
  const { saveProgram } = useUserProgram();
  const { saving: settingsSaving, saveSettings } = useUserSettings();
  const { saving: bodySaving, saveMeasurement } = useBodyMeasurements();

  const [step, setStep] = useState<Step>("welcome");
  const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);
  const [features, setFeatures] = useState<Record<string, boolean>>({
    enableNutrition: true,
    enableWater: true,
    enableBodyMeasurements: true,
    enableProgressPhotos: true,
    enableDeload: true,
  });
  const [finishing, setFinishing] = useState(false);

  const stepIndex = STEP_ORDER.indexOf(step);

  function goNext() {
    const next = STEP_ORDER[stepIndex + 1];
    // Skip body stats step if measurements disabled
    if (next === "body" && !features.enableBodyMeasurements) {
      setStep("done");
    } else if (next) {
      setStep(next);
    }
  }

  function goBack() {
    const prev = STEP_ORDER[stepIndex - 1];
    if (prev) setStep(prev);
  }

  function toggleFeature(key: string) {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleBodySave(weight: number | null, bodyFat: number | null) {
    const today = new Date().toISOString().split("T")[0];
    await saveMeasurement(today, weight, bodyFat);
    setStep("done");
  }

  async function handleFinish() {
    setFinishing(true);

    // Save the selected program
    if (selectedTemplate) {
      await saveProgram({ ...selectedTemplate.schedule }, selectedTemplate.name);
    }

    // Save feature toggles + mark onboarding complete
    await saveSettings({
      ...features,
      onboardingCompleted: true,
    } as Record<string, boolean> & { onboardingCompleted: boolean });

    router.push("/");
  }

  const enabledFeatureLabels = FEATURES.filter((f) => features[f.key] !== false).map((f) => f.label);

  return (
    <div className="mx-auto max-w-lg px-5 py-8 min-h-screen">
      {/* Step indicator */}
      {step !== "welcome" && (
        <div className="mb-8">
          <StepIndicator current={stepIndex} total={STEP_ORDER.length} />
        </div>
      )}

      {/* Steps */}
      {step === "welcome" && <WelcomeStep onNext={goNext} />}
      {step === "program" && (
        <ProgramStep
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
          onNext={goNext}
          onBack={goBack}
        />
      )}
      {step === "features" && (
        <FeaturesStep
          features={features}
          onToggle={toggleFeature}
          onNext={goNext}
          onBack={goBack}
        />
      )}
      {step === "body" && (
        <BodyStatsStep
          onSave={handleBodySave}
          onSkip={goNext}
          onBack={goBack}
          saving={bodySaving}
        />
      )}
      {step === "done" && (
        <DoneStep
          templateName={selectedTemplate?.name || "Default A/B Rotation"}
          enabledFeatures={enabledFeatureLabels}
          onFinish={handleFinish}
          finishing={finishing || settingsSaving}
        />
      )}
    </div>
  );
}
