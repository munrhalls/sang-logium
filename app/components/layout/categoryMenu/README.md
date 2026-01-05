# [Feature Name]

## 1. The Problem
* **Pain Point:** [What was difficult, slow, or broken before?]
* **Impact:** [Why did it matter? e.g., "caused 200ms lag" or "spaghetti code"]

## 2. The Solution
* **Strategy:** [One sentence summary of the fix]
* **Tech Stack:** [List libs, e.g., `nuqs`, `React Context`]

## 3. Architecture

## 4. Key Trade-offs

- **Decision:** Catalogue is made at build time via script that fetches and processes latest data, then stores it in static json file + run automatic re-build daily.


- **Reasoning:**Alternative was to use webhook for Sanity database catalogue changes -> trigger re-validation in the receiving /api/revalidate -> which would invalidate storefront catalogue component -> cause re-fetch of catalogue due to invalid cache -> cache fresh catalogue.
The trade off would be "in theory" cleaner "by the book" Next solution - but in reality, it would introduce 1-2 seconds lag every time catalogue was changed.
Why? The entire point of this design is that catalogue is lightning fast, with O(1) lookup for any user action possible (instant) - BUT it requires one-time script to run at build time, to generate pathways mapping. That script can take 1-2 seconds to execute. User would have to wait (witness skeleton or loader), when someone changed catalogue in database.
Key criteria: 1) I chose to prioritize the UX NEVER lagging for the end user., 2) Sang-logium is audio gear store - the catalogue doesn't change that often. It's okay if the update happens via daily automatic re-build.
