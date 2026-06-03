# CLAUDE.md — Project context for Claude Code

> Read this fully before writing code. This is a **3-day portfolio demo** for a senior/lead React Native interview. The reviewer is a CTO at a subscription DTC company. Priorities, in order: **(1) finishable in 3 days, (2) clean architecture, (3) polish over feature count.** Resist scope creep aggressively.

## Project
**Momentum** — a small universal habit tracker (iOS + Android + Web from one Expo/React Native codebase) with a subscription paywall. See `README.md` for full rationale.

## Golden rules
- This is React Native (via Expo). Discuss/comment in RN terms. Expo = RN + tooling, not a separate framework.
- **Small and polished beats big and broken.** If a task risks blowing the timeline, propose the simpler version first.
- Never use `localStorage`/`sessionStorage` or browser-storage assumptions — use AsyncStorage / expo-secure-store.
- Components NEVER hardcode colors/spacing/typography — always read from design tokens.
- Keep functions and components small; prefer composition.
- TypeScript everywhere, strict mode. No `any` unless justified with a comment.
- Commit in small, meaningful chunks (commits are part of the portfolio).

## Stack (use these, don't substitute without asking)
- Expo (default `create-expo-app`, New Architecture ON by default) + TypeScript
- Expo Router (file-based navigation, built on React Navigation)
- React Query (TanStack Query) for server state
- Zustand for client/session state; `useState` for local
- AsyncStorage for persistence (behind a data service); expo-secure-store for the session token
- react-native-reanimated for animations
- Subscriptions: StoreKit Configuration File + an entitlement **service abstraction** (see below)

## Architecture (follow exactly)
Feature-based folders. Each feature owns its components/hooks/data/types. `shared/` = reusable; `services/` = external integrations behind one interface.

```
src/
  app/                      # Expo Router routes
    (auth)/sign-in.tsx
    (tabs)/index.tsx        # habit list
    (tabs)/stats.tsx        # premium-gated
    (tabs)/settings.tsx
    habit/[id].tsx          # add/edit (dynamic)
    paywall.tsx             # modal route
    _layout.tsx             # root layout (theme, query client, auth redirect)
  features/{habits,subscription,auth,stats}/
  shared/{ui,storage,api,lib}/
  services/{purchases,theme}/
  config/                   # env, feature flags, DEMO_MODE flag
```

### State rules (important — this signals seniority)
- **Server state** (habits, stats) → React Query, even though the source is local. Wrap the local data service in an async function and use `useQuery`/`useMutation`. Treat it as a swappable backend.
- **Client state** (session, UI, theme) → Zustand.
- **Local** (form inputs, toggles) → `useState`.
- Do NOT put server data in Zustand. Do NOT reach for Redux.

### Entitlement abstraction (the key pattern)
Create `services/purchases/` exposing an interface:
```ts
interface PurchasesService {
  getEntitlement(): Promise<'free' | 'pro'>;
  getOfferings(): Promise<Offering[]>;
  purchase(productId: string): Promise<PurchaseResult>;
  restore(): Promise<void>;
}
```
Two implementations behind it, selected by `config.DEMO_MODE`:
1. **`mock.ts`** (DEMO_MODE = true): flips entitlement locally so the handed-over simulator build shows paywall → unlock. Default for the shipped build.
2. **`storekit.ts`** (DEMO_MODE = false): real StoreKit Configuration File flow (RevenueCat or expo-iap). This is what gets recorded in the video, run locally via `npx expo run:ios`.
The paywall and gating code talk ONLY to the interface, never to StoreKit/RevenueCat directly. Add a clear code comment + README note about the demo boundary.

### Auth
Simple mocked sign-in (email → store a session token in expo-secure-store → redirect). Structure it so real OAuth/PKCE could swap in. Add a `// production: replace with OAuth/PKCE via expo-auth-session` comment. Don't build real auth — out of scope.

### Theming
`services/theme/tokens.ts` = single source of truth (colors, spacing, radii, typography). `ThemeProvider` provides them. `shared/ui` components consume tokens via a `useTheme()` hook. One theme override demonstrates per-product theming.

## Feature scope (do NOT exceed)
- Free: ≤3 habits, daily check-off, current streak.
- Pro: unlimited habits, stats screen, one custom theme.
- Screens: sign-in, habit list, add/edit habit, stats (gated), paywall, settings (restore, demo toggle, sign out).
- Reanimated: spring check-off, streak indicator, swipe-to-delete, paywall entrance.
- **Explicitly out of scope:** real backend, social, push reminders, onboarding, multi-theme. If asked to add these, push back and suggest deferring.

## Commands
- Dev (for IAP/StoreKit testing): `npx expo run:ios`
- Web: `npx expo start --web`
- Simulator build for handover: `eas build -p ios --profile preview` (ensure `eas.json` has `"preview": { "ios": { "simulator": true } }`)

## Ordered task list (work top to bottom; confirm each runs before moving on)

### Day 1 — Foundation + core feature
1. Scaffold project; configure TypeScript strict; set up folder structure above.
2. `services/theme`: tokens + ThemeProvider + `useTheme`. Build `shared/ui`: Button, Text, Card, Screen wrapper.
3. Expo Router: `_layout.tsx` (theme + QueryClientProvider + auth-redirect), `(auth)` and `(tabs)` groups.
4. `shared/storage`: AsyncStorage wrapper + expo-secure-store wrapper.
5. `shared/api`: QueryClient + async habit data service (CRUD over AsyncStorage).
6. `features/habits`: list screen + add/edit (`habit/[id].tsx`) using React Query. Persistent. Verify on simulator AND web.

### Day 2 — Subscription + auth + gating
7. `services/purchases`: interface + `mock.ts` + `config.DEMO_MODE`. Wire `storekit.ts` skeleton (RevenueCat or expo-iap) — real flow can be finished alongside the StoreKit config file.
8. `features/subscription`: paywall screen + `useEntitlement()` hook.
9. Gate `(tabs)/stats.tsx` behind entitlement → show paywall if free.
10. `features/auth`: mocked sign-in, token in SecureStore, redirect logic.
11. `(tabs)/settings.tsx`: restore purchases, demo-mode toggle, sign out.

### Day 3 — Polish + package
12. Reanimated: check-off spring, streak, swipe-to-delete, paywall entrance.
13. `features/stats`: simple charts (Pro only).
14. Cleanup, comments at demo boundaries, finalize README.
15. Configure `eas.json` preview (simulator) profile.
16. *(Stretch) one custom native module via Expo Modules API to demonstrate native depth.*

## When unsure
Ask before: adding a dependency not listed here, adding a feature beyond scope, or doing anything that risks the 3-day timeline. Always prefer the simplest version that demonstrates the skill.
