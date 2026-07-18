import { clearTestData } from "./helpers";

// vitest-global-setup.ts
export default function setup() {
  console.log('--- Triggers BEFORE any test suite starts ---');

  // Return the teardown function
  return async () => {
    console.log('--- Triggers AFTER all test suites finish ---');
    // Place your global cleanup logic here (e.g., stopping a global database container)
    await clearTestData();

  };
}
