# Momentum — Habit Tracker

A small, polished **universal React Native app (Expo)** demonstrating a production-grade subscription flow, feature-based architecture, and smooth Reanimated animations. Runs on **iOS, Android, and Web from one codebase**.

> This README documents *why* each decision was made, not just what was built.

---

## 1. What this project is

Momentum is a habit tracker with a freemium subscription model. The goal was to build something genuinely complete — correct entitlement logic, persistent local data, per-user isolation, polished animations, and a real release artifact — rather than a toy UI demo.

**Free tier:** track up to 3 habits, daily check-off, current streak.  
**Pro tier:** unlimited habits, stats screen with animated charts, custom theme.

The purchase flow uses a local StoreKit Configuration File (no App Store publishing required). Where something is mocked for the demo, the README and code say so explicitly.

---

## 2. Why these technical choices

Each decision maps to a concrete outcome:

- **Universal codebase (iOS + Android + Web from one repo):** lower maintenance surface, consistent UX, faster iteration.
- **Subscription paywall + entitlements abstracted behind a service interface:** UI code never talks directly to StoreKit or RevenueCat. Swapping implementations (mock ↔ real) is a one-line config change.
- **Feature-based architecture + shared layer:** each feature is self-contained; `shared/` and `services/` are extractable into a monorepo package.
- **React Query over local async data:** the data service is async and swappable — the same query/mutation code works whether the source is AsyncStorage or a remote API.
- **Secure token storage:** session token in `expo-secure-store` (Keychain/Keystore), never AsyncStorage.

---

## 3. Expo and React Native

**An Expo app is a React Native app.** Expo is RN plus a managed toolchain and SDK — not a separate framework. Running `npx expo prebuild` ejects to a real `ios/`/`android/` project. The `momentum-haptics` native module in `modules/` (real Swift + Kotlin, built with the Expo Modules API) demonstrates that native-layer work is fully accessible.

---

## 4. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | React Native via Expo (New Architecture on by default) | Current best practice; full native access via CNG/prebuild |
| Language | TypeScript strict | Type safety throughout |
| Navigation | Expo Router (file-based, built on React Navigation) | Universal routing + automatic deep linking + web URLs |
| Server state | React Query (TanStack Query) over an async data service | Correct server/client state split; caching; swappable backend |
| Client state | Zustand + local `useState` | Lightweight; no Redux ceremony |
| Persistence | AsyncStorage behind a data service | Local-first; React Query wraps it as a swappable async source |
| Secure storage | expo-secure-store (Keychain/Keystore) | Session token stored correctly, not in AsyncStorage |
| Animation | react-native-reanimated (UI-thread worklets) | Smooth check-offs, streaks, transitions without JS-thread jank |
| Subscriptions | StoreKit Configuration File + entitlement service abstraction | Real local purchase flow; no publishing required |
| Theming | Design tokens + ThemeProvider | Components read tokens, never hardcode — supports multiple themes |
| Native module | Expo Modules API (Swift + Kotlin) | Demonstrates native-layer depth |

---

## 5. Architecture

**Feature-based, not type-based folders.** Each feature owns its components, hooks, API, and types. `shared/` holds truly reusable pieces; `services/` holds external integrations behind a single interface.

```
src/
  app/                      # Expo Router — file-based routes
    (auth)/
      welcome.tsx           # onboarding carousel (entry point)
      sign-in.tsx
    (tabs)/
      index.tsx             # habit list
      stats.tsx             # premium-gated
      settings.tsx
    habit/[id].tsx          # add/edit (dynamic route)
    paywall.tsx             # modal
    _layout.tsx
  features/
    habits/                 # components, hooks, API, and types
    subscription/           # useEntitlement hook
    auth/                   # store, useAuth, useAvatar, AvatarPicker
    stats/                  # WeeklyChart, StatCard, useStats
  shared/
    ui/                     # Button, Text, Card, Screen — token-driven
    storage/                # AsyncStorage + SecureStore wrappers
    api/                    # queryClient + habitsService (CRUD over AsyncStorage)
    lib/                    # date utilities, cross-platform alert
  services/
    purchases/              # PurchasesService interface + mock + storekit impls
    theme/                  # tokens, ThemeProvider, themeStore
  config/                   # DEMO_MODE flag
modules/
  momentum-haptics/         # custom native module (Swift + Kotlin)
```

**Server vs client state split.** React Query manages all data (habits, stats) — even though the source is local, it sits behind an async service so the pattern is identical to a real backend. Zustand handles session/UI state. `useState` stays local. This avoids the anti-pattern of dumping everything in one global store.

**Entitlement abstraction.** The paywall talks to a `PurchasesService` interface (`getEntitlement()`, `purchase()`, `restore()`), never directly to StoreKit or RevenueCat. Two implementations sit behind it:
1. **`storekit.ts`** — real StoreKit Configuration File flow (run via `npx expo run:ios`).
2. **`mock.ts`** — a local toggle that flips entitlement instantly; used in the handed-over simulator build so the purchase flow is demonstrable without an App Store account.

Switching between them is one line in `src/config/index.ts`:
```ts
export const DEMO_MODE = true; // false → real StoreKit
```

---

## 6. Feature scope

**Free tier:** up to 3 habits, daily check-off, current streak.  
**Pro tier:** unlimited habits, statistics screen (animated charts), custom theme.

**Screens:** onboarding carousel → sign-in → habit list → add/edit habit → stats (gated) → paywall → settings (avatar, restore, demo-mode toggle, sign out).

**Reanimated:** spring check-off, streak badge, swipe-to-delete row, paywall entrance, onboarding pagination dots.

**Explicitly out of scope:** real backend, social features, push reminders, multiple themes. Small and polished beats large and half-finished.

---

## 7. Build timeline

**Day 1 — Foundation + core feature**
- Scaffold with `create-expo-app`, set up folders, TypeScript, Expo Router with `(auth)`/`(tabs)`.
- Design tokens + ThemeProvider + `shared/ui` component library (Button, Text, Card, Screen).
- Habit data service (AsyncStorage) + React Query wrapper.
- Habit list + add/edit habit, fully persistent, running on simulator AND web.

**Day 2 — Subscription + auth + gating**
- `purchases` entitlement service: `PurchasesService` interface + demo-mode mock + StoreKit skeleton.
- Paywall screen with annual/monthly offerings; premium-gate the stats screen.
- Mocked auth flow with token in expo-secure-store; per-user data isolation.
- Settings screen (restore, demo toggle, sign out, avatar upload).

**Day 3 — Polish + package**
- Reanimated animations: spring check-off, streak badge, swipe-to-delete, paywall entrance, onboarding dots.
- Stats screen: animated weekly bar chart + streak leaderboard.
- Onboarding carousel + polished sign-in with context-aware copy.
- `momentum-haptics` native module (Expo Modules API, Swift + Kotlin).
- `eas build -p ios --profile preview` simulator build for handover.

---

## 8. Running & testing

### Start the app

```bash
# Web (fastest for browsing the UI)
npx expo start --web

# iOS simulator — local dev (hot reload, Metro bundler)
npx expo run:ios
```

### Build a simulator artifact (EAS)

The `preview` profile in `eas.json` produces a `.app` bundle that can be dragged onto any iOS Simulator — no signing, no device, no App Store account needed.

```bash
# One-time setup
npm install -g eas-cli
eas login
eas init       # links the project; writes projectId into app.json

# Build (~5 min on EAS servers)
eas build -p ios --profile preview
```

EAS emails a download link when the build finishes. Unzip it, then drag the `.app` onto an open Simulator window to install.

### Test accounts

Any email address works — sign-in is mocked. Habits, streaks, and stats are **isolated per email address**.

| Email | Suggested use |
|---|---|
| `alice@test.com` | Primary test account |
| `bob@test.com` | Second account — verify data isolation |
| `free@test.com` | Demo free-tier limits |
| `pro@test.com` | Demo pro features |

Sign out from **Settings → Account → Sign Out**, then sign in with a different email to confirm each account has its own data.

### Developer tools (Settings → Developer)

Visible only when `DEMO_MODE = true` (the default):

| Tool | What it does |
|---|---|
| **Set Free / Set Pro** | Flips the mock entitlement instantly |
| **3 Free habits** | Seeds 3 habits with varied streaks (7d, 3d, 0d) |
| **7 Pro habits** | Seeds 7 habits with streaks from 62 days down to 0 |

### Recommended walkthrough

1. Sign in as `alice@test.com`
2. Settings → Developer → **Set Pro** + **7 Pro habits**
3. Browse the habit list — swipe left to delete, tap a checkbox to see the spring animation
4. Open **Stats** — watch the weekly bar chart animate in and the streak leaderboard load
5. Sign out → sign in as `bob@test.com` → confirm empty habit list (data isolation)
6. Settings → Developer → **Set Free** + **3 Free habits**
7. Try adding a 4th habit — hits the free-tier limit → paywall opens
8. Tap **Get Pro** to see the purchase flow → unlock

---

## 9. Key constraints / gotchas

- **IAP needs a dev build, not Expo Go.** Use `npx expo run:ios`. Expo Go cannot load native IAP modules.
- **StoreKit Configuration File = no publishing, no paid developer account needed.** Define products locally in a `.storekit` file in Xcode; uncheck "Sync with App Store Connect."
- **The `.storekit` config is tied to the Xcode run scheme** — a handed-over `.app` won't auto-use it. Set `DEMO_MODE = true` for the handed-over build; run locally via `npx expo run:ios` to demonstrate the real purchase flow.
- **No localStorage / browser storage** — AsyncStorage and SecureStore everywhere.
