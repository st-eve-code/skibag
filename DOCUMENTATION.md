# Skibag — Gaming Platform App Documentation

## Overview

Skibag is a cross-platform mobile gaming application built with React Native and Expo. It is a competitive gaming hub where users can browse and play games, join tournaments, track their rank and streaks, manage an in-app wallet, and compete on a global leaderboard. The app targets iOS, Android, and Web.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo ~54.0.33 / React Native 0.81.5 |
| Language | TypeScript |
| Navigation | Expo Router (file-based routing) |
| Primary Backend | Supabase (auth, database, storage) |
| Secondary Backend | Firebase (auth fallback, Firestore) |
| State Management | React Context API |
| UI | React Native Paper, Expo Vector Icons, Lottie, Expo Linear Gradient |
| Real-time | Socket.IO client |
| Build | EAS Build |
| Platforms | iOS, Android, Web |

---

## Project Structure

```
skibag/
├── app/                            # All screens (Expo Router file-based routing)
│   ├── (auth)/                     # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Auth landing
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── callback.tsx            # OAuth redirect handler
│   ├── (onboardScreen)/            # First-launch onboarding
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── (tabs)/                     # Main bottom-tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Home dashboard
│   │   ├── games.tsx               # Game browser
│   │   ├── events.tsx              # Tournaments & match history
│   │   ├── wallet.tsx              # In-app wallet
│   │   └── profile.tsx             # User profile & settings
│   ├── (screens)/                  # Secondary/feature screens (route group)
│   │   ├── all-games.tsx           # Full game catalog
│   │   ├── leaderboard.tsx         # Global leaderboard
│   │   ├── match-history.tsx       # Full match history log
│   │   ├── notifications.tsx       # Notification center
│   │   ├── roulette.tsx            # Free spin reward wheel
│   │   ├── transactions.tsx        # Full transaction history
│   │   ├── language.tsx            # Language settings
│   │   ├── language-selection.tsx  # Language picker
│   │   ├── privacy-policy.tsx      # Privacy policy
│   │   ├── terms-of-use.tsx        # Terms of use
│   │   └── splashscreen.tsx        # Animated splash/loading screen
│   ├── game/                       # Game session screens
│   │   ├── [id].tsx                # Dynamic game screen by ID
│   │   └── chess.tsx               # Chess game screen
│   ├── tournament/
│   │   └── [id].tsx                # Tournament detail screen
│   ├── components/                 # Shared UI components
│   │   ├── chess/
│   │   │   └── ChessRoom.tsx
│   │   ├── BackButton.tsx
│   │   ├── CategoryFilterBar.tsx
│   │   ├── GameCard.tsx
│   │   ├── MatchCard.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── OrDivider.tsx
│   │   ├── ScreenBackground.tsx
│   │   ├── SocialAuthButton.tsx
│   │   └── TransactionCard.tsx
│   ├── screens/                    # Legacy standalone screen helpers
│   │   ├── AppNavigator.tsx
│   │   ├── ChessGameScreen.tsx
│   │   └── ChessLobbyScreen.tsx
│   ├── _layout.tsx                 # Root layout / navigation shell
│   └── index.tsx                   # App entry point
├── lib/                            # Core services, contexts, and utilities
│   ├── services/                   # Backend service integrations
│   │   ├── supabase.ts             # Supabase client initialization
│   │   ├── supabaseAuthService.ts  # Username/password auth, streaks, referrals
│   │   ├── supabaseFeedbackService.ts # Feedback submission
│   │   ├── firestoreService.ts     # Firestore read/write (points, coins, roulette)
│   │   ├── storageService.ts       # File/image storage helpers
│   │   └── notificationService.ts  # Push & in-app notification logic
│   ├── context/                    # React Context providers
│   │   ├── userContext.tsx         # Global user state (UserContext)
│   │   ├── authContext.tsx         # Firebase auth context
│   │   ├── authService.tsx         # Google / Apple OAuth helpers
│   │   ├── supabaseAuthContext.tsx # Supabase session context
│   │   └── I18nContext.tsx         # Internationalization context
│   └── responsive.ts               # wp(), hp(), fontScale() utilities
├── assets/                         # Static assets
│   ├── animations/                 # Lottie animation files
│   ├── badges/                     # Achievement badge images
│   ├── fonts/                      # Custom fonts (Poppins, Montserrat)
│   ├── gameicons/                  # Game thumbnail images
│   ├── images/                     # Background and UI images
│   ├── logos/                      # Brand and social logos
│   └── ranks/                      # Rank tier icons
├── constant/                       # Static app data
│   ├── Avatar.ts                   # Avatar definitions
│   ├── games.ts                    # Game catalog data
│   ├── onboardSlides.ts            # Onboarding slide content
│   └── theme.ts                    # Color and spacing theme
├── types/                          # TypeScript type definitions
├── i18n/                           # Translation files
├── server/
│   └── routes/game.js              # Chess lobby / game session route
├── sql/                            # Supabase SQL schema and migration files
├── docs/                           # Additional documentation and notes
├── app.json                        # Expo app configuration
├── eas.json                        # EAS Build configuration
├── package.json                    # Dependencies
└── tsconfig.json                   # TypeScript configuration
```

---

## Navigation & Screens

### Authentication — `app/(auth)/`

Entry point for unauthenticated users.

| Screen | File | Description |
|---|---|---|
| Auth Index | `index.tsx` | Landing screen, routes to login or signup |
| Login | `login.tsx` | Username/password login + Google/Apple OAuth |
| Signup | `signup.tsx` | Account creation with password strength validation and optional referral code |
| OAuth Callback | `callback.tsx` | Handles OAuth redirect after Google/Apple sign-in |

Authentication supports two paths:
- Username + password via Supabase (`lib/services/supabaseAuthService.ts`)
- OAuth (Google on all platforms, Apple on iOS only) via Firebase (`lib/context/authService.tsx`)

After successful login or signup, the user is redirected to `/(tabs)` and a welcome notification is added.

---

### Onboarding — `app/(onboardScreen)/`

Shown on first launch before authentication. Presents animated slides introducing the app's features. Content is defined in `constant/onboardSlides.ts`.

---

### Main Tabs — `app/(tabs)/`

The core of the app, accessible after authentication. Uses a bottom tab navigator.

#### Home — `index.tsx`
The main dashboard. On load it fetches the authenticated user's data from Supabase (with a fallback to local storage), checks and updates the daily streak, and renders:
- Header with avatar initial, coin balance, rank icon, notification bell, and streak counter
- Free Spin card linking to the roulette screen
- Auto-rotating promotional banner (cycles every 5 seconds)
- Bonus Games horizontal scroll section
- Full game grid filterable by category (all, casino, action, football, board, puzzles, arcade, fighting, adventure)

#### Games — `games.tsx`
A dedicated game browser. Features:
- Featured banner at the top showing the currently selected game's image, name, category, rating, and a Play Now button
- Scrollable grid of all games; tapping a card updates the featured banner
- Selected game highlighted with a blue border and checkmark indicator
- Navigates to `game/[id]` on Play Now

#### Events — `events.tsx`
Tournaments and match history hub. Contains:
- Header with a Leaderboard shortcut button
- Live Tournaments horizontal scroll — cards showing tournament name, game, prize pool, player count, status (Live / Starting Soon), and entry fee. Tapping navigates to `tournament/[id]`
- Match History list showing recent results (Win/Loss/Draw), opponent, game, score, and time. Links to the full match history screen

#### Wallet — `wallet.tsx`
In-app financial management. Features:
- Balance card with gradient design showing available balance in XAF, bonus balance, masked card ID (copyable), and a show/hide toggle
- Quick Actions grid: Deposit, Withdraw, History, Transfer — each opens an inline modal
- Deposit modal: select MTN or Orange Money, enter phone number and amount
- Withdraw modal: enter amount
- Transfer modal: enter recipient account ID and amount
- History shortcut navigates to the full transactions screen
- Recent Transactions list with type icons, color-coded amounts, and status badges (completed / pending)

#### Profile — `profile.tsx`
User account and settings screen. Contains:
- Profile card with selected avatar, username, coin count, rank badge, and daily streak
- Avatar editor — opens a modal with a grid of all available avatars; selection is saved to Supabase
- Referrals & Achievements section showing referral count, referral points, and badge count. Displays a conversion button when the user has 100+ points (converts to coins)
- Referral Code section with a copy-to-clipboard button and sharing instructions
- Legal section with links to Privacy Policy and Terms of Use
- Rate Us section with a 1–5 star rating and free-text feedback form (submitted via `supabaseFeedbackService`)
- Account section with Logout and Delete Account (double-confirmed destructive action)

---

### Game Screens — `app/game/`

| Screen | File | Description |
|---|---|---|
| Game Detail | `[id].tsx` | Dynamic screen for any game by ID |
| Chess | `chess.tsx` | Dedicated chess game screen |

The chess lobby communicates with the backend API (`/api/game/chess/start`) to start a matchmaking or bot session, receiving a `sessionToken` and `sessionId` for the game.

---

### Tournament — `app/tournament/[id].tsx`

Dynamic tournament detail screen. Displays full information about a specific tournament based on its ID, navigated to from the Events tab.

---

### Feature Screens — `app/(screens)/`

These are secondary screens navigated to from the main tabs. The `(screens)` route group is transparent — URLs remain unchanged (e.g. `/leaderboard`, `/roulette`).

| Screen | File | Description |
|---|---|---|
| All Games | `all-games.tsx` | Full paginated game catalog with category filter |
| Leaderboard | `leaderboard.tsx` | Global leaderboard with top-3 podium and ranked list |
| Match History | `match-history.tsx` | Full match history log |
| Roulette | `roulette.tsx` | Free spin / reward roulette wheel |
| Transactions | `transactions.tsx` | Full transaction history |
| Notifications | `notifications.tsx` | In-app notification center |
| Language Selection | `language-selection.tsx` | UI language picker |
| Language | `language.tsx` | Language settings screen |
| Privacy Policy | `privacy-policy.tsx` | Legal privacy policy text |
| Terms of Use | `terms-of-use.tsx` | Legal terms of use text |
| Splash Screen | `splashscreen.tsx` | Animated splash/loading screen |

---

## Shared Components — `app/components/`

Purely presentational components with no internal state — all data and handlers are passed as props.

| Component | Description |
|---|---|
| `BackButton` | Styled back navigation button |
| `ScreenBackground` | Full-screen background image with dark overlay |
| `GameCard` | Game tile with variants: `featured`, `small`, `grid` |
| `MatchCard` | Match result card (win/loss/draw, opponent, score) |
| `TransactionCard` | Transaction row with type icon, amount, and status badge |
| `NotificationBell` | Bell icon with unread count badge |
| `SocialAuthButton` | Google / Apple OAuth button |
| `OrDivider` | "OR" divider line for auth screens |
| `CategoryFilterBar` | Horizontal scrollable category filter pills |

---

## Library Structure — `lib/`

### `lib/services/` — Backend Integrations

| File | Description |
|---|---|
| `supabase.ts` | Supabase client initialization (URL + anon key) |
| `supabaseAuthService.ts` | User auth, signup, login, streak tracking, referrals, account deletion |
| `supabaseFeedbackService.ts` | Feedback submission and daily submission check |
| `firestoreService.ts` | Firestore operations: points, coins, roulette play/win recording |
| `storageService.ts` | File upload/download helpers for Supabase Storage |
| `notificationService.ts` | Push notification initialization and in-app notification helpers |

### `lib/context/` — React Context Providers

| File | Description |
|---|---|
| `userContext.tsx` | Global user state — `UserData`, `setUserData`, avatar, rank, streak, notifications |
| `authContext.tsx` | Firebase auth session context |
| `authService.tsx` | Google and Apple OAuth flow helpers |
| `supabaseAuthContext.tsx` | Supabase session and user context provider |
| `I18nContext.tsx` | Internationalization — `t()` hook, language switching, locale persistence |

### `lib/responsive.ts`
Utility functions for responsive sizing:
- `wp(n)` — percentage of screen width
- `hp(n)` — percentage of screen height
- `fontScale(n)` — font size scaled to screen width

---

## Key Features

### Authentication & Session Management
- Username/password auth stored and validated via Supabase
- Google OAuth (all platforms) and Apple OAuth (iOS only) via Firebase
- Session persisted in AsyncStorage via `supabaseAuthService`
- Auth state changes trigger automatic user data refresh on the Home screen

### Rank System
Users progress through ranks based on their coin score:

| Rank | Description |
|---|---|
| Beginner | Starting rank |
| Inter | Intermediate |
| Advanced | Advanced player |
| Pro | Professional |
| Legend | Elite |
| Crown 1 / Crown 2 | Top tier |

Rank icons are displayed on the Home header and Profile card.

### Daily Streak
Tracked via `checkAndUpdateStreak()` in `supabaseAuthService`. The streak increments when the user logs in on consecutive days. The current streak is shown on the Home header with a flame icon.

### Referral System
- Each user receives a unique referral code on signup
- Sharing the code with a new user awards 10 referral points to the referrer
- 100 referral points can be converted to in-app coins via the Profile screen
- Stats (referral count, points, badges) are fetched from Supabase on Profile load

### Wallet & Transactions
- In-app currency: XAF (Central African Franc)
- Supports deposit via MTN Mobile Money and Orange Money
- Supports withdrawal and peer-to-peer transfer by account ID
- Transaction types: win, loss, deposit, withdraw, transfer, bonus (referral)
- All transactions displayed with status (completed / pending)

### Leaderboard
- Global leaderboard with score and win count
- Top 3 players displayed in a visual podium with gold/silver/bronze styling
- Current user highlighted in the list

### Internationalization (i18n)
- Translation context provided by `lib/context/I18nContext.tsx`
- Translation files located in `i18n/`
- Language can be changed from the Language Selection screen
- All UI strings use the `t()` hook

### Notifications
- In-app notification system managed by `lib/services/notificationService.ts`
- Unread count badge shown on the notification bell in the Home header
- Notifications triggered on login, signup, and other key events

### Feedback System
- Users can submit a star rating (optional) and text feedback from the Profile screen
- Submitted via `lib/services/supabaseFeedbackService.ts` to Supabase
- One submission per user per day is enforced

---

## Backend

### Supabase
Primary backend. Handles:
- User authentication (username/password)
- User data storage (`users` table: username, coins, rank, streak, avatar, referral code)
- Referrals table
- Avatars bucket (storage)
- Feedback table

Key SQL files (see `sql/` folder) define the full schema including users, referrals, avatars, streaks, and RLS policies.

### Firebase
Secondary backend. Handles:
- Google and Apple OAuth flows
- Firestore for supplementary data (`lib/services/firestoreService.ts`)
- Storage (`lib/services/storageService.ts`)

### Game Server
The `server/routes/game.js` file contains the chess lobby integration. It calls `POST /api/game/chess/start` with a `matchType` of `matchmaking` or `bot`, and receives a `sessionToken` and `sessionId` to initialize the game session.

---

## Configuration & Setup

### Prerequisites
- Node.js v18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- For iOS: Xcode + CocoaPods
- For Android: Android Studio + SDK

### Installation
```bash
npm install
# iOS only
cd ios && pod install && cd ..
```

### Running the App
```bash
# Development server
npx expo start

# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start --web
```

### EAS Build
```bash
eas build --platform ios
eas build --platform android
```

### App Configuration
Key settings in `app.json`:
- App name: `game app`, slug: `skibag`
- Bundle ID (iOS): `com.gameapp.tech`
- Package (Android): `com.gameapp.tech`
- Scheme: `skibag` (used for deep linking / OAuth callbacks)
- New Architecture enabled
- Static web output enabled

### Environment Variables
Firebase is configured via:
- `google-services.json` (Android)
- `GoogleService-Info.plist` (iOS)

Supabase credentials are initialized in `lib/services/supabase.ts`.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web |
| `npm run lint` | Run ESLint |
| `npm run build:web` | Export static web build |
| `npm run postbuild` | Auto-generate sitemap after build |
