The Strategy: Critical User Journeys (CUJs) We only test the paths that, if broken, cause us to lose money or users.

10% Unit Tests (Pure Logic Only):

Test your api-validation-table.md logic. This is a pure function: Input (Google signals) -> Output (Status). It has edge cases. Write a test for this. Do not test the UI components.

90% Integration/E2E (The "Does it work?" Test):

Use Playwright. It is fast and reliable.

Test 1 (Happy Path): User adds item -> Enters valid address -> Address Auto-confirms -> Stripe Checkout loads.

Test 2 (The "Fix" Path): User enters "Garbage" -> UI shows "FIX" status -> User corrects it -> Status changes.

Test 3 (Network Fail): Mock the API returning 500. Does the UI show a nice error message, or does it crash white?

That’s it. 3-4 robust tests are worth 1,000 unit tests.
