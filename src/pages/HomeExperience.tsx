import { AnimatePresence, motion } from "motion/react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useActiveFirms } from "@/state/ConfigStore";
import { FirmLanding } from "@/components/landing/FirmLanding";
import { FirmWorkspace } from "@/components/workspace/FirmWorkspace";
import { accentOf } from "@/lib/accent";
import type { Firm } from "@/types";

export function HomeExperience() {
  const { firmSlug } = useParams();
  const firms = useActiveFirms();
  const navigate = useNavigate();

  const selectedFirm = firmSlug ? firms.find((f) => f.slug === firmSlug) : undefined;

  if (firmSlug && !selectedFirm) return <Navigate to="/" replace />;

  const accent = selectedFirm ? accentOf(selectedFirm) : null;

  return (
    <div className="relative">
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10"
        animate={{
          background: accent
            ? `radial-gradient(70% 55% at 85% -10%, color-mix(in oklab, ${accent.primary} 16%, transparent) 0%, transparent 60%), radial-gradient(55% 45% at 5% 30%, color-mix(in oklab, ${accent.secondary} 14%, transparent) 0%, transparent 65%)`
            : "radial-gradient(60% 40% at 15% 0%, transparent 0%, transparent 60%)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      <AnimatePresence initial={false}>
        {!selectedFirm ? (
          <FirmLanding key="landing" firms={firms} onSelect={(f: Firm) => navigate(`/firm/${f.slug}`)} />
        ) : (
          <FirmWorkspace
            key={selectedFirm.id}
            firm={selectedFirm}
            onBack={() => navigate("/")}
            onSwitchFirm={(f) => navigate(`/firm/${f.slug}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
