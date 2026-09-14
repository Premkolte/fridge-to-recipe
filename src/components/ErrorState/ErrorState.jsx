/**
 * ErrorState — structured error display with retry/reset.
 *
 * @param {Object} props
 * @param {{ message: string, code: string, retryable: boolean }} props.error
 * @param {function(): void} props.onRetry
 * @param {function(): void} props.onReset
 */
function ErrorState({ error, onRetry, onReset }) {
  const message = error?.message ?? 'Something went wrong.';
  const retryable = error?.retryable ?? true;

  return (
    <div className="flex flex-col items-center gap-4
      py-16 text-center animate-fade-in"
    >
      <div className="text-5xl">⚠️</div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-base font-semibold text-white">
          Something went wrong
        </h3>
        <p className="text-sm text-muted">{message}</p>
      </div>
      <div className="flex gap-3">
        {retryable && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-primary text-white
              text-sm font-medium hover:bg-accent
              transition-all duration-200"
          >
            Try again
          </button>
        )}
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl border border-border
            text-sm font-medium text-muted hover:text-white
            hover:border-white/20 transition-all duration-200"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

export default ErrorState;
