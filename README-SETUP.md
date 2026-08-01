# Setup — remaining steps

The Vite + React scaffold is in place. Still to do:

1. **Add the real application component.**
   `src/App.jsx` is currently a placeholder. Save the original
   `gestao-artistas-concerto-*.jsx` as a real file and copy it over
   `src/App.jsx`, preserving the two base64 logo data URIs
   (`LOGO_YME_DARK`, `LOGO_YME_LIGHT`) exactly.

2. **Install dependencies.**

   ```sh
   npm install
   ```

3. **Run the dev server.**

   ```sh
   npm run dev
   ```

## Notes

- The original component calls `window.storage.get/set(key, value, flag)`, which
  is not a browser API. `src/storageShim.js` provides a `localStorage`-backed
  implementation and is imported in `src/main.jsx`, so the component works
  unmodified.
- Dependencies used by the component: `react`, `react-dom`, `xlsx`,
  `lucide-react`.
