import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";
import { PirateNavigation } from "./PirateNavigation";
import { PirateFooter } from "./PirateFooter";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import { ShipWheel } from "../svg/ShipWheel";

export function DeckLoading() {
  return (
    <div className="deck-loading" role="status">
      <ShipWheel size={70} spinning />
      <p>Hoisting the next deck… (the rope is wet)</p>
    </div>
  );
}

/** The shared shell for every normal and secret deck. */
export function UniversityLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <div className={`app-shell ${isHome ? "is-home-deck" : "lg:pl-72"}`}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <PirateNavigation isHome={isHome} />
      <main id="main" tabIndex={-1} className="app-main">
        <RouteErrorBoundary key={pathname}>
          <Suspense fallback={<DeckLoading />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>
      <PirateFooter />
    </div>
  );
}
