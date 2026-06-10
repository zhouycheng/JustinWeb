export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--page-background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--page-muted)] [animation-delay:0ms]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--page-muted)] [animation-delay:150ms]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--page-muted)] [animation-delay:300ms]" />
        </div>
        <span className="font-home-mono text-xs tracking-[0.16em] uppercase text-[var(--page-muted)]">
          Loading
        </span>
      </div>
    </div>
  );
}
