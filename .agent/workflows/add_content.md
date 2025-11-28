---
description: How to add new curriculum content
---

1. Open `frontend/constants.ts`.
2. Locate the `CURRICULUM` constant.
3. Add a new `Unit` object to the array.
   - Assign a unique `id`.
   - Provide a `title` and `description`.
   - Define `levels` array.
4. For each `Level`:
   - Assign a unique `id` (e.g., UnitId * 100 + LevelIndex).
   - Define `learnableConcepts` with English terms (`type: 'Inglês'`) and Logic concepts (`type: 'Lógica'`).
   - Add `questions` of various types (`THEORY`, `MULTIPLE_CHOICE`, `CODE_BUILDER`, etc.).
   - Ensure `THEORY` questions include `englishWord` and `phonetic` fields.
5. Save the file.
6. Run `npm run build` in `frontend` to verify.
