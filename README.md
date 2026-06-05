# Momentum — Habit Tracker (Portfolio Demo)

A small, polished **universal React Native app (Expo)** built to demonstrate senior/lead-level engineering for a subscription DTC company. Runs on **iOS, Android, and Web from one codebase**, with a real **subscription paywall** flow.

> This README documents *why* each decision was made — which is the part a CTO actually reads.

---

## 1. Why this project exists (context)

I'm interviewing for a Senior/Lead React Native role at a company that ships **B2C subscription products (eCommerce / DTC) as connected web + mobile apps**, one after another. My real production work is under NDA or no longer live on the stores, so this is a clean-room demo that proves I can build **exactly their stack**: Expo, TypeScript, universal codebase, subscriptions, clean architecture, and a real release artifact they can run.

**Goal:** a CTO can (a) run an iOS build on the simulator, (b) read clean, well-architected code, and (c) watch a short video of a real purchase flow — and conclude "this person operates at senior/lead level on our stack."

---

## 2. Business perspective — what this proves and why it matters

This is the framing for the one-page write-up I send with the project. Each technical choice maps to a business outcome:

- **Universal codebase (one RN codebase → iOS + Android + Web):** lower cost per product, faster time-to-market, consistent UX across platforms — directly relevant to a company shipping many products back-to-back.
- **Subscription paywall + entitlements:** subscriptions are the company's entire revenue model. Demonstrating a correct purchase + entitlement flow (no double-charging, restore support, server-side-truth mindset) shows I understand their core business risk, not just UI.
- **Clean feature-based architecture + shared layer:** scales across a *portfolio* of apps, not just one — shows I think about reuse and team velocity, which is what "shipped one after another" demands.
- **Release-ready (simulator build + release pipeline awareness):** I can ship, not just code — provisioning, builds, OTA, staged rollout are part of how I think.
- **Production-health mindset (crash reporting, performance):** I own apps in production, not just in dev.

**The honesty line:** the purchase flow uses a local StoreKit Configuration File (no App Store publishing). Where something is mocked for the demo, the README and code say so explicitly. Senior reviewers respect "real architecture + honest about the demo boundary" far more than a polished lie.

---

## 3. "Expo vs React Native" — the framing

The employer leans React Native in conversation. Key point I lead with: **an Expo app IS a React Native app** — Expo is RN plus tooling/SDK, not a separate framework. I discuss everything in RN terms (New Architecture, JSI, native layer, state, performance). If asked, I can run `npx expo prebuild` to show the real `ios/`/`android/` projects, and (stretch goal) I include one **custom native module written with the Expo Modules API** (real Swift/Kotlin) to prove native-level depth.

---

## 4. Tech stack (RN-framed)

| Concern | Choice | Why |
|---|---|---|
| Framework | React Native via Expo (default `create-expo-app`, New Architecture on by default) | Current best practice; full native access via CNG/prebuild |
| Language | TypeScript | Type safety, senior expectation |
| Navigation | Expo Router (file-based, built on React Navigation) | Universal routing + automatic deep linking + web URLs |
| Server state | React Query (TanStack Query) over an async data service | Server/client state split; caching, the right pattern |
| Client state | Zustand + local `useState` | Lightweight; no Redux ceremony for a small app |
| Persistence | AsyncStorage (or expo-sqlite if time) behind a data service | Local-first; React Query wraps it as a swappable async source |
| Secure storage | expo-secure-store (Keychain/Keystore) | Session token stored correctly, not in AsyncStorage |
| Animation | react-native-reanimated (UI-thread worklets) | My strength; smooth check-offs, streaks, transitions |
| Subscriptions | StoreKit Configuration File + entitlement service abstraction (RevenueCat OR expo-iap behind it) | Real local purchase flow, no publishing required |
| Theming | Design tokens + ThemeProvider | Components read tokens, never hardcode — portfolio-of-apps mindset |

---

## 5. Architecture decisions (the part to read)

**Feature-based, not type-based folders.** Each feature owns its components, hooks, API, and types. `shared/` holds truly reusable pieces; `services/` holds external integrations behind a single interface. This scales to many features and to a team — and the `shared/` + `services/` layers are what you'd extract into a monorepo package to reuse across a portfolio of apps.

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
```

**Server vs client state split.** React Query manages all "data" (habits, stats) — even though the source is local for the demo, it's behind an async service so the pattern is identical to a real backend. Zustand handles session/UI state. `useState` stays local. This deliberately avoids the anti-pattern of dumping everything in one global store.

**Entitlement abstraction + demo-mode toggle.** The paywall talks to a `purchases` service interface (`getEntitlement()`, `purchase()`, `restore()`), never directly to StoreKit/RevenueCat. Two implementations sit behind it:
1. **Real:** StoreKit Configuration File flow (shown working in the video, run locally — no publishing).
2. **Demo-mode mock:** a local toggle that flips the entitlement so the *handed-over* simulator build also shows paywall → unlock visually.
The README/code state clearly which is active. This is honest, and it shows I understand the production architecture.

**Secure token storage.** Session token in `expo-secure-store` (Keychain/Keystore), never AsyncStorage. Auth is a simple mocked sign-in for the demo, but structured to swap in real OAuth/PKCE — noted in code.

**Theming via tokens.** Components read design tokens, never hardcode colors/spacing. One product = one theme override. This is the portfolio-of-apps mindset in miniature.

---

## 6. Feature scope — ruthlessly small (this is the whole point)

**Free tier:** up to 3 habits, daily check-off, current streak.
**Premium ("Momentum Pro"):** unlimited habits, statistics screen (simple charts), custom theme.

**MVP screens:** onboarding carousel → sign-in → habit list → add/edit habit → stats (gated) → paywall → settings (avatar, restore, demo-mode toggle, sign out).

**Reanimated touches:** spring check-off animation, streak indicator, swipe-to-delete row, paywall entrance.

**Out of scope (resist!):** social features, real backend, push reminders, onboarding flows, multiple themes beyond one. Polish the small thing; don't add features.

---

## 7. Three-day build plan

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

**Day 3 — Polish + package + ship**
- Reanimated animations: spring check-off, streak badge, swipe-to-delete, paywall entrance, onboarding dots.
- Stats screen: animated weekly bar chart + streak leaderboard.
- Onboarding carousel (welcome screen) + polished sign-in with context-aware copy.
- `eas build -p ios --profile preview` (simulator build for handover).
- Record 2–3 min video showing the real StoreKit purchase flow.
- *(Stretch: one custom native module via Expo Modules API.)*

---

## 8. Running & testing the app

### Start the app

```bash
# Web (fastest for browsing the UI)
npx expo start --web

# iOS simulator (required for real StoreKit / IAP testing)
npx expo run:ios
```

### Test accounts

Any email address works — the sign-in is mocked. Habits, streaks, and stats are **isolated per email address**, so switching accounts gives a clean slate.

| Email | Suggested use |
|---|---|
| `alice@test.com` | Primary test account |
| `bob@test.com` | Second account — verify data isolation |
| `free@test.com` | Demo free-tier limits |
| `pro@test.com` | Demo pro features |

Sign out from **Settings → Account → Sign Out**, then sign in with a different email to confirm each account has its own data.

### Developer tools (Settings → Developer)

These tools are only visible when `DEMO_MODE = true` (the default shipped config):

| Tool | What it does |
|---|---|
| **Set Free / Set Pro** | Flips the mock entitlement instantly — no paywall needed |
| **3 Free habits** | Seeds 3 habits with varied streaks (7d, 3d, 0d) so the habit list is populated |
| **7 Pro habits** | Seeds 7 habits with streaks from 62 days down to 0 — makes the stats screen and charts meaningful |

### Recommended demo flow

1. Sign in as `alice@test.com`
2. Settings → Developer → **Set Pro** + **7 Pro habits**
3. Browse the habit list (swipe a card left to delete, tap the checkbox to see the spring animation)
4. Open **Stats** — see the weekly bar chart animate in and the streak leaderboard
5. Sign out → sign in as `bob@test.com` → confirm empty habit list (data isolation)
6. Settings → Developer → **Set Free** + **3 Free habits**
7. Try adding a 4th habit — hits the free-tier limit → paywall opens
8. On the paywall, tap **Get Pro** to see the purchase flow → unlock

---

## 9. Key constraints / gotchas

- **IAP needs a dev build, NOT Expo Go.** Use `npx expo run:ios`. Expo Go can't run native IAP code.
- **StoreKit Configuration File = no publishing, no paid account needed.** Define products locally in a `.storekit` file in Xcode; uncheck "Sync with App Store Connect."
- **The `.storekit` config applies via the Xcode run scheme** — a standalone handed-over `.app` won't auto-use it. So: show the *real* purchase in the video (run locally), and rely on the *demo-mode toggle* for the handed-over build.
- **Simulator build for handover:** `eas build -p ios --profile preview` with `"ios": { "simulator": true }` → unzip → drag `.app` onto the simulator. No signing needed.
- **No localStorage / browser storage assumptions** — use AsyncStorage/SecureStore.
- **Scope creep is the only real risk.** Finish-first mentality.

---

## 10. Deliverable package to send the CTO

- [ ] EAS **iOS simulator build** (`.app` they can run themselves)
- [ ] Public **GitHub repo** (clean architecture, this README)
- [ ] **2–3 min video** showing the real StoreKit purchase → unlock flow
- [ ] **One-page doc**: what I built here + written write-ups of MEV (real-time video, 16 concurrent streams, Twilio/WebSocket) and effie> (camera + TensorFlow/OpenCV)

