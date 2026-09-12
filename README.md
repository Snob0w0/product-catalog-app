# Product Catalog App

A small product catalog app built against the [DummyJSON](https://dummyjson.com/docs/products) API: browse products, paginate, search, and view product details.

## Stack

**React Native + Expo, plain JavaScript (no TypeScript).**

I have no prior React Native/mobile experience. My background is 3D/technical game art and game development, plus web front-end (HTML/CSS/JavaScript, Bootstrap) and C#. React Native was the most natural bridge from that web background — component-based UI and Flexbox styling carry over almost directly — and Expo removes the need for Android Studio/Xcode to get something running and testable quickly.

## Running it

```bash
npm install
npx expo start
```

Then either:
- Scan the QR code with the **Expo Go** app on your phone (iOS or Android), or
- Press `w` in the terminal to open it in a browser, or
- Press `a` / `i` for an Android/iOS emulator if you have one set up.

Run the unit tests with:

```bash
npm test
```

## Architecture

The code is split into three layers so each piece has one job:

```
src/
  api/         data layer      — talks to DummyJSON, nothing else
  hooks/       business logic  — pagination, search, loading/error/empty state
  screens/     presentation    — screens, wired to hooks
  components/  presentation    — dumb, reusable UI pieces
  navigation/  wiring          — the two-screen stack (list -> detail)
```

- **`src/api`** (`client.js`, `productsApi.js`) is a thin `fetch` wrapper plus three functions (`fetchProducts`, `fetchProductById`, `searchProducts`) that map 1:1 to the three endpoints in the brief. It knows nothing about React.
- **`src/hooks`** (`useProducts.js`, `useProductDetail.js`) owns all state: the current items, `loading | error | success` status, pagination cursor (`skip`), and the debounced search term. Screens don't manage any of this themselves — they just call the hook and render what it gives them. Because these hooks don't import anything from React Native, they're plain, testable JS.
- **`src/screens` + `src/components`** are presentation-only: given the hook's state, decide which of Loading/Error/Empty/the actual list to show. `StateViews.js` centralizes those three non-happy-path visuals so both screens render them identically instead of each screen reinventing them.

### Search: server-side via `/products/search`, debounced client-side

I used the dedicated search endpoint rather than filtering the already-loaded list client-side, because:
- The full catalog is much larger than one page (20 items) — filtering client-side would either require fetching everything up front (defeats the point of pagination) or would only search within whatever page happened to be loaded, which is misleading.
- The search endpoint is what a real product catalog backend would expose, and DummyJSON's own relevance ordering comes for free.

The debounce (400ms, in `useProducts.js`) is a plain `setTimeout` that resets on every keystroke and fires the request only once typing pauses — no debounce library, since a single `useEffect` covers it.

### State handling

`useProducts` exposes a single `status: 'loading' | 'error' | 'success'`, plus the `items` array. The screen derives what to show:
- `status === 'loading'` → full-screen spinner
- `status === 'error'` → error view with the message and a **Retry** button (calls the same load function again)
- `status === 'success'` **and** `items.length === 0` → empty view
- otherwise → the list

Pull-to-refresh is a separate, "silent" path (`refresh()`) that re-fetches without flipping `status`, so refreshing doesn't blank out the list the user is already looking at — only the native `RefreshControl` spinner shows.

### Race conditions

Search re-triggers a request on every debounce firing, and a slow response for an old query could in theory arrive after a newer one. `useProducts` guards against this with a request counter (`requestId` ref) — a response only gets applied if it's still the most recent request in flight.

### Images

Thumbnails and detail images use `expo-image` instead of the built-in `Image`, for its built-in blurhash placeholder and crossfade transition — free "loading placeholder" handling without hand-rolling it.

## What I chose not to build (given the ~2-3h time box)

- **Search results aren't paginated further** — only the first batch (up to 20) from `/products/search` is shown; `skip`-based infinite scroll only applies to the unfiltered list. A real version would extend `useProducts` to track `skip`/`total` for the search branch too.
- **A failed "load more" during pagination fails silently** (the existing list just stops growing) rather than surfacing a toast/inline retry — the initial load and search both have full error+retry treatment, this one path doesn't yet.
- **No offline caching** — every screen refetches on mount; there's no persisted cache for previously-seen products.
- **No automated navigation/component tests** — only the data layer (`src/api`) has unit tests; the hooks and screens are verified manually (see below).
- **Verified via Expo's web target, not a physical device/simulator** during development — I don't have a simulator set up on this machine yet. Before submitting, I still need to run it through Expo Go on an actual phone to confirm touch/gesture behavior (pull-to-refresh in particular) matches what web showed.

## AI usage

I used Claude for technical guidance, implementation assistance, debugging, and reviewing alternative approaches while building the application. I iteratively reviewed and tested the generated code and made the final decisions around the application structure, state management, API integration, and UI behaviour.
