"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h2>Something went wrong!</h2>
          {process.env.NODE_ENV === "development" && (
            <div>
              <p>Error Details: {error.message}</p>
              <p>Digest: {error.digest}</p>
            </div>
          )}
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
