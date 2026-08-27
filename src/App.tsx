import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { IntroScreen } from "@/components/brand/IntroScreen";
import { AppShell } from "@/components/layout/AppShell";
import { HomeExperience } from "@/pages/HomeExperience";
import { SearchPage } from "@/pages/SearchPage";
import { LaunchPage } from "@/pages/LaunchPage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminOverview } from "@/pages/admin/AdminOverview";
import { AdminFirms } from "@/pages/admin/AdminFirms";
import { AdminApplications } from "@/pages/admin/AdminApplications";
import { OfflinePage } from "@/pages/OfflinePage";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <IntroScreen onDone={() => setIntroDone(true)} />
      <div aria-hidden={!introDone} style={{ visibility: introDone ? "visible" : "hidden" }}>
        <Routes>
          <Route path="/launch/:appId" element={<LaunchPage />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<HomeExperience />} />
            <Route path="/firm/:firmSlug" element={<HomeExperience />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/offline" element={<OfflinePage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="firms" element={<AdminFirms />} />
              <Route path="applications" element={<AdminApplications />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}
