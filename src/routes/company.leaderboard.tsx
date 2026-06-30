import { createFileRoute } from "@tanstack/react-router";
import { useCompanyProfile } from "@/lib/companyApi";
import { useCompany, readStoredCompany } from "@/context/CompanyContext";
import { CompanyPreparationTracker } from "@/components/CompanyPreparationTracker";
import { CompanyLeaderboard } from "@/components/CompanyLeaderboard";

export const Route = createFileRoute("/company/leaderboard")({
  head: () => ({
    meta: [
      { title: "Company Leaderboard — KITS Placement Hub" },
      { name: "description", content: "Aspirants leaderboard for this company." },
    ],
  }),
  component: CompanyLeaderboardPage,
});

function CompanyLeaderboardPage() {
  const { selected } = useCompany();
  const stored = selected ?? readStoredCompany();
  const companyId = stored?.companyId ?? 1;

  // We fetch the profile just to ensure valid context or we can skip it.
  const { data: profile } = useCompanyProfile(companyId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6 pb-24">
      {/* ── Preparation Tracker ─────────────────────────────────── */}
      <CompanyPreparationTracker companyId={companyId} />

      {/* ── Company Aspirants Leaderboard ───────────────────────── */}
      <CompanyLeaderboard companyId={companyId} />
    </div>
  );
}
