"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--page-background)] px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="rounded-full border border-[var(--page-line-strong)] p-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-8 w-8 text-[var(--page-muted)]"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <h2 className="font-home-system text-xl font-semibold text-[var(--page-heading)]">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-[var(--page-muted)]">
            An unexpected error occurred. Please try again.
          </p>
        </div>

        <button
          type="button"
          onClick={() => reset()}
          className="site-link-button font-home-mono text-xs tracking-[0.04em]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
