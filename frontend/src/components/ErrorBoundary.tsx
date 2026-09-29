import React, { Component } from "react";
import type { ErrorInfo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional custom fallback UI. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
  /** Scope label shown in the default fallback (e.g. "Product List") */
  scope?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─── Default Fallback UI ─────────────────────────────────────────────────────

interface DefaultFallbackProps {
  error: Error;
  onReset: () => void;
  scope?: string;
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({
  error,
  onReset,
  scope,
}) => (
  <div className="error-boundary-wrapper">
    <div className="error-boundary-card">
      {/* Icon */}
      <div className="error-boundary-icon-ring">
        <svg
          className="error-boundary-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="error-boundary-title">
        {scope ? `${scope} — Something went wrong` : "Something went wrong"}
      </h2>

      {/* Subtext */}
      <p className="error-boundary-subtitle">
        An unexpected error occurred. You can try refreshing this section or
        navigate back to continue shopping.
      </p>

      {/* Error details (collapsed by default) */}
      <details className="error-boundary-details">
        <summary>Error details</summary>
        <pre className="error-boundary-pre">{error.message}</pre>
      </details>

      {/* Actions */}
      <div className="error-boundary-actions">
        <button
          id="error-boundary-retry-btn"
          className="error-boundary-btn error-boundary-btn--primary"
          onClick={onReset}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
          </svg>
          Try Again
        </button>
        <button
          id="error-boundary-home-btn"
          className="error-boundary-btn error-boundary-btn--secondary"
          onClick={() => (window.location.href = "/")}
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
);

// ─── Error Boundary Class Component ─────────────────────────────────────────

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you'd forward this to an error-reporting service (e.g. Sentry).
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, scope } = this.props;

    if (hasError && error) {
      if (fallback) return fallback(error, this.handleReset);
      return (
        <DefaultFallback error={error} onReset={this.handleReset} scope={scope} />
      );
    }

    return children;
  }
}
