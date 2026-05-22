"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { OnboardingData, BusinessMode } from "@/lib/types";
import StepProgress from "./StepProgress";
import Step0Mode from "./Step0Mode";
import Step1BusinessName from "./Step1BusinessName";
import Step2Category from "./Step2Category";
import Step3Country from "./Step3Country";
import Step4City from "./Step4City";
import Step5Website from "./Step5Website";
import Step6CTA from "./Step6CTA";
import { C } from "@/lib/design";
import MovingBackground from "@/components/shared/MovingBackground";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({ categories: [], businessMode: "" as BusinessMode });

  const mode = data.businessMode as BusinessMode | "";
  // For new_launch we skip the website step (step index 5), giving 6 steps total.
  // For existing we include it, giving 7 steps total.
  const totalSteps = mode === "new_launch" ? 6 : 7;

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };

  const next = () => {
    let target = step + 1;
    // Skip website step (index 5) for new_launch
    if (mode === "new_launch" && target === 5) target = 6;
    go(Math.min(target, totalSteps - 1));
  };

  const back = () => {
    let target = step - 1;
    // Skip website step (index 5) when going back in new_launch
    if (mode === "new_launch" && target === 5) target = 4;
    go(Math.max(target, 0));
  };

  const update = (patch: Partial<OnboardingData>) => setData((d) => ({ ...d, ...patch }));

  const handleAnalyze = () => {
    sessionStorage.setItem("stratiq_onboarding", JSON.stringify(data));
    router.push("/loading");
  };

  // step index → component
  const stepComponents: React.ReactNode[] = [
    /* 0 */ <Step0Mode key={0} value={mode} onChange={(v) => update({ businessMode: v })} onNext={next} />,
    /* 1 */ <Step1BusinessName key={1} mode={mode || "existing"} value={data.businessName || ""} onChange={(v) => update({ businessName: v })} onNext={next} onBack={back} />,
    /* 2 */ <Step2Category key={2} value={data.categories || []} onChange={(v) => update({ categories: v })} onNext={next} onBack={back} />,
    /* 3 */ <Step3Country key={3} value={data.country || ""} onChange={(v) => update({ country: v, city: "" })} onNext={next} onBack={back} />,
    /* 4 */ <Step4City key={4} country={data.country || ""} value={data.city || ""} onChange={(v) => update({ city: v })} onNext={next} onBack={back} />,
    /* 5 */ <Step5Website key={5} value={data.website || ""} onChange={(v) => update({ website: v })} onNext={next} onBack={back} />,
    /* 6 */ <Step6CTA key={6} data={data as OnboardingData} onAnalyze={handleAnalyze} onBack={back} />,
  ];

  // Human-visible step number (1-based, not counting the mode step as a numbered step)
  const displayStep = step;
  const displayTotal = totalSteps;

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <MovingBackground variant="light" motif="onboarding" intensity={1.1} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <StepProgress current={displayStep} total={displayTotal} />

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ width: "100%", maxWidth: 540 }}>
            <div style={{ background: "white", borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: "0 8px 40px rgba(0,0,0,0.07)", padding: "40px 36px", overflow: "hidden" }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {stepComponents[step]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
