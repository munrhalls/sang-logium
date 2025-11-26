THE STRATEGY

- Filter by Granularity First: If it's not a building (NO), it's immediate garbage. FIX.
- Filter by Country Integrity: If it is a building, but the country doesn't match input, it's a hallucination. FIX.
- Check Completeness: If it's a building and country matches, but missing unit number. CONFIRM.
- Success: If it passes all above. ACCEPT.

# Address Validation Decision Table

| Case | Input Type    | Granularity | Country Match | Has Replaced | Missing Subpremise | Action  |
| ---- | ------------- | ----------- | ------------- | ------------ | ------------------ | ------- |
| 1    | Perfect Match | PREMISE     | Yes           | No           | No                 | ACCEPT  |
| 2    | Messy / Typo  | PREMISE     | Yes           | No / Minor   | No                 | CONFIRM |
| 3    | Missing Apt # | PREMISE     | Yes           | No           | Yes                | CONFIRM |
| 4    | Wrong Country | PREMISE     | No            | Yes          | —                  | REJECT  |
| 5    | Street Only   | ROUTE       | —             | —            | —                  | REJECT  |
| 6    | Invalid Input | OTHER       | —             | —            | —                  | REJECT  |

## Definitions

**Granularity**

- `PREMISE` — Specific building found
- `ROUTE` — Street level only
- `OTHER` — General area or not found

**Country Match**

- Compares Google's country code with user's selected country

**Has Replaced**

- Google replaced major address components (city, postal code)

**Missing Subpremise**

- Building requires unit/apt number but none provided
