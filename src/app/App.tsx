import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { PirateExperienceProvider, useExperience } from "./PirateExperienceProvider";
import { UniversityLayout, DeckLoading } from "../components/layout/UniversityLayout";
import { PirateLoadingScreen } from "../components/layout/PirateLoadingScreen";
import { VisitTracker } from "../components/global/VisitTracker";
import { PirateAudioController } from "../components/global/PirateAudioController";
import { GlobalCompass } from "../components/global/GlobalCompass";
import { GlobalJarOfDirt } from "../components/global/GlobalJarOfDirt";
import { GlobalPirateChatbot } from "../components/global/GlobalPirateChatbot";
import { GlobalPopupLayer } from "../components/global/GlobalPopupLayer";
import { StormMode } from "../components/global/StormMode";
import { KonamiCodeListener } from "../components/interactions/KonamiCodeListener";
import { SwordCursor } from "../components/global/SwordCursor";
import { PirateLoginModal } from "../components/global/PirateLoginModal";
import PoopDeckPage from "../pages/PoopDeckPage";

const AdmissionsPage = lazy(() => import("../pages/AdmissionsPage"));
const BootyFeesPage = lazy(() => import("../pages/BootyFeesPage"));
const TreasureMapsPage = lazy(() => import("../pages/TreasureMapsPage"));
const ResultsPage = lazy(() => import("../pages/ResultsPage"));
const BrigPage = lazy(() => import("../pages/BrigPage"));
const LibraryPage = lazy(() => import("../pages/LibraryPage"));
const FacultyPage = lazy(() => import("../pages/FacultyPage"));
const AttendancePage = lazy(() => import("../pages/AttendancePage"));
const PlacementsPage = lazy(() => import("../pages/PlacementsPage"));
const HostelComplaintsPage = lazy(() => import("../pages/HostelComplaintsPage"));
const MutinyHotlinePage = lazy(() => import("../pages/MutinyHotlinePage"));
const SecretCodePage = lazy(() => import("../pages/SecretCodePage"));
const FacultyCabinMapPage = lazy(() => import("../pages/FacultyCabinMapPage"));
const PirateNotFoundPage = lazy(() => import("../pages/PirateNotFoundPage"));

function Ship() {
  const { introDone } = useExperience();
  return (
    <>
      <SwordCursor />
      <VisitTracker />
      <PirateAudioController />
      <KonamiCodeListener />
      <Routes>
        <Route element={<UniversityLayout />}>
          <Route index element={<PoopDeckPage />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="fees" element={<BootyFeesPage />} />
          <Route path="treasure-maps" element={<TreasureMapsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="brig" element={<BrigPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="placements" element={<PlacementsPage />} />
          <Route path="hostel/complaints" element={<HostelComplaintsPage />} />
          <Route path="mutiny-hotline" element={<MutinyHotlinePage />} />
          <Route path="the-code" element={<SecretCodePage />} />
          <Route path="faculty-cabin-map" element={<FacultyCabinMapPage />} />
        </Route>
        <Route
          path="*"
          element={
            <Suspense fallback={<DeckLoading />}>
              <PirateNotFoundPage />
            </Suspense>
          }
        />
      </Routes>
      <StormMode />
      <GlobalCompass />
      <GlobalJarOfDirt />
      <GlobalPirateChatbot />
      <GlobalPopupLayer />
      <PirateLoginModal />
      {!introDone && <PirateLoadingScreen />}
    </>
  );
}

export function App() {
  return (
    <PirateExperienceProvider>
      <Ship />
    </PirateExperienceProvider>
  );
}
