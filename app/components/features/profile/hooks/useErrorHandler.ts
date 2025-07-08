import { useState, useCallback } from "react";
interface ErrorHandler {
  error: string | null;
  setError: (error: string | null) => void;
  handleError: (error: unknown) => void;
  clearError: () => void;
}
export function useErrorHandler(): ErrorHandler {
  const [error, setError] = useState<string | null>(null);
  const handleError = useCallback((error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    setError(errorMessage);
  }, []);
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  return {
    error,
    setError,
    handleError,
    clearError,
  };
}
