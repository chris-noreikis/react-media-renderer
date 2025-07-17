## Testing Guideslines
1. Use `jest` to run unit tests
2. Example command: `npm test -- src/index.test.tsx`

## Coding Style

1. Focus on new code being as simple as possible.  Do not add features that were not explicitly asked for

## Testing Style
1. Prefer testing methods that lead for to a single assertion per test
2. If there is duplication in unit tests, use methods like extract variables, beforeEach, or a parameterized setup method to perform deduplication