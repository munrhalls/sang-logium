"use client";

import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("Error occurred:", error);
    console.error("Error digest:", error.digest);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
          {error.digest && (
            <p className="text-gray-600 mb-4">Error: {error.digest}</p>
          )}
          <NextError statusCode={500} />
        </div>
      </body>
    </html>
  );
}
