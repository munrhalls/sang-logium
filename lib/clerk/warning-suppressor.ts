export function suppressSpamDevelopmentKeysClerkWarning() {
  if (typeof window === "undefined") return;
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Clerk has been loaded with development keys")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}
