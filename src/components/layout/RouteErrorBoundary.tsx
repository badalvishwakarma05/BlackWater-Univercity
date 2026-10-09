import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  error: Error | null;
}

/**
 * If a deck collapses (a chunk fails to load, a component throws), show a
 * pirate error report with real recovery options instead of a white screen.
 */
export class RouteErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("A deck has collapsed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="page-wrap py-16">
        <div className="panel on-dark mx-auto max-w-xl p-8" role="alert">
          <div className="panel-bg tx-rust cracked" aria-hidden="true" />
          <p className="kicker text-parchment">Error report · deck collapsed</p>
          <h1 className="title-mid mt-2 text-[#ffb4a8]">The database has abandoned ship.</h1>
          <p className="mt-3">
            This page failed to load. It may be a dropped connection or a genuine bug. Either way, it is not your fault (it is the previous
            captain's).
          </p>
          <p className="mt-2 font-type text-sm opacity-80">Details: {this.state.error.message || "unknown sea monster"}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="crooked-btn cb-gold cb-sm" onClick={() => this.setState({ error: null })}>
              Try this deck again
            </button>
            <button type="button" className="crooked-btn cb-ghost cb-sm" onClick={() => window.location.reload()}>
              Reload the whole ship
            </button>
            <a href="/" className="crooked-btn cb-ghost cb-sm">
              Back to the Poop Deck
            </a>
          </div>
        </div>
      </div>
    );
  }
}
