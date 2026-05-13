"use client";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <h2 className="text-xl font-bold text-white">Error inesperado</h2>
        <p className="text-white/50 mt-2 text-sm">
          Algo salió mal. Intentalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/80 transition-all"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
