# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`app-amip` is the AMIP athletes' mobile app: Expo SDK 53 / React Native 0.79.6 / React 19.0.0. It is the client counterpart to `api-ibra`'s player-facing endpoints (`ensurePlayerAuthenticated` routes: `/players`, `/authenticate_player`, `/notifications`, etc). The admin staff panel is a separate repo (`admin-web-amip`) and is not related to this app.

Mid-migration off Expo SDK 52 (5 major versions behind at the time, driven by Google Play/App Store toolchain deadlines): only the 52→53 jump is done so far, one version at a time (53→54→55→56→57 still pending, each gets its own session — see the app's own commit history for the jump-by-jump notes, e.g. New Architecture becoming mandatory at 55, `@expo/vector-icons` needing to become a direct dependency before 56).

Bundle identifier (both platforms): `br.com.argilatecnologia.amiptm`. Current version: `1.0.0` (build/versionCode `1`) — early-stage app.

## Commands

- `npm start` — `expo start --dev-client` (note: `expo-dev-client` is not currently listed in `package.json`/`node_modules` despite the script referencing it — check this before relying on the dev client flow locally).
- EAS build: `eas build --profile preview --platform android` (internal distribution) or `--profile production`. Only these two profiles exist in `eas.json`; there is no `development` profile.
- `android/` and `ios/` native directories are committed to the repo (the project has been through `expo prebuild`, or is managed with native dirs checked in) — keep this in mind before adding any Expo config plugin that requires a fresh prebuild, since it may need to be reconciled with existing native customizations.

Environment variables (`react-native-dotenv`, injected via `.env` locally and via `eas.json` `env` blocks for builds): `API_URL` (points to the production backend, `https://api.amiptdm.com`, in both `preview` and `production` profiles — no separate staging URL) and `WHATSAPP_PHONE_NUMBER`.

## Architecture

### Directory layout (`src/`)

```
src/
  assets/       # images/fonts
  components/   # shared UI - Form/ (Input, InputMask, SelectPicker, Button),
                # Header, HeaderApp, FallbackImage, ChooseTakePhotoModal, etc
  config/       # toast-config.tsx, upload config
  dtos/
  hooks/        # auth.tsx (AuthProvider), theme.tsx (ThemeModeProvider)
  routes/       # index.tsx (navigation), app.routes.tsx, app.bottom.tabs.routes.tsx
  screens/      # Championships, Contact, ForgotPassword, Museum, News,
                # Players, Profile, SignIn, SignUp, Subscription
  services/     # api.ts (axios client)
  storage/      # auth-token-storage.ts, theme-storage.ts (both AsyncStorage)
  themes/       # light.ts, dark.ts, index.ts (re-exports both + shared ITheme type)
  @types/
  utils/        # rf-value.ts (local RFValue reimplementation, see below)
```

Two unmaintained dependencies were replaced (don't reintroduce them): `react-native-responsive-fontsize` → `src/utils/rf-value.ts` (same formula, copied in directly); `react-native-keyboard-aware-scroll-view` → `react-native-keyboard-controller`'s `KeyboardAwareScrollView` (needs `KeyboardProvider` mounted once at the root, already wired in `App.tsx`).

### HTTP client and auth

- `src/services/api.ts`: single `axios` instance, `baseURL: API_URL`. Has a response interceptor that, on `401`, attempts `POST /authenticate_player/refresh_token` and signs the user out if that also fails.
- `src/hooks/auth.tsx`: `AuthProvider` — `signIn` (`POST /authenticate_player/session`), `signOut`, `loadData` (`GET /players/me`), `updatePlayerProfile`. This is the natural place to hook future device-token registration (send the push token to the backend right after a successful `signIn`/`loadData`).
- `src/storage/auth-token-storage.ts`: persists `{ token, refresh_token }` in `AsyncStorage` under key `AUTH_TOKEN_STORAGE`. No device/push token concept exists yet anywhere in the app.
- **Auth gating**: `src/routes/app.routes.tsx` conditionally registers `profileScreen`/`editProfileInformationScreen`/`editPasswordScreen`/`deleteProfileScreen` only when `player.id` is truthy — the official React Navigation pattern for auth flows (https://reactnavigation.org/docs/auth-flow/), so navigating to them while logged out isn't just blocked, the route doesn't exist. `News`/`Championships`/`Museum`/`Contact`/`Subscription` stay registered unconditionally (intentionally public, including anonymous championship subscriptions with `player_id: null`). `src/routes/index.tsx` holds a `navigationRef` and resets to `appBottomTabs` (no toast) if the session drops while the current route is one of the four gated screens — `app.routes.tsx` only decides which routes exist, not what happens if you're already inside one when it disappears.

### Theming (light/dark)

- `src/themes/light.ts` and `dark.ts` share the same brand-color keys (`blue-dark-color`, `primary-color`, `green-color`, etc. — fixed across both themes, used as literal accents on buttons/headers) plus five theme-aware tokens that actually differ: `background`, `surface`, `text`, `text-secondary`, `border`. `surface` is for anything that needs to read as a distinct layer from the screen background (form field fills, avatar/photo placeholder circles) — using `background` there would make it blend into the screen behind it. `src/themes/index.ts` re-exports both plus `ITheme` (the shared type: `as const` on `light`/`dark` gives each incompatible literal color types otherwise) and default-exports `light` only for legacy direct imports (e.g. `src/config/toast-config.tsx`, which reads it statically on purpose — its toast box never adopts a theme background, so its text color is deliberately fixed too, not a bug to "fix").
- `src/hooks/theme.tsx`: `ThemeModeProvider`/`useThemeMode` — defaults to `dark` for anyone who hasn't chosen yet, persists the choice via `src/storage/theme-storage.ts` (`AsyncStorage`), and owns both the styled-components `ThemeProvider` and the native `StatusBar` (`barStyle` has to flip with the theme or the status bar icons go illegible). Toggled from a moon/sun icon in `HeaderApp` (`toggleTheme`, one tap, no confirmation).
- Any new color usage should go through a theme token (`theme.COLORS.text`, etc.) via `useTheme()`/styled-components — a literal `'#000'`/`'black-color'`/`'white-color'` on genuine UI chrome (as opposed to a deliberately fixed brand accent) will read fine in light mode and break in dark mode.

### Notifications — not yet implemented

No notification/push code, dependencies (`expo-notifications`, `expo-device`, `expo-constants`, Firebase/`@react-native-firebase/*`), or config exists anywhere in this app. The backend (`api-ibra`) already exposes a ready-to-consume notifications inbox API (all under `ensurePlayerAuthenticated`):
- `GET /notifications/` (paginated, `only_unread` filter)
- `GET /notifications/show/:id`
- `PATCH /notifications/read-all`
- `PATCH /notifications/read/:id`
- `DELETE /notifications/:id`

There is no screen in this app consuming these endpoints yet, and no push-notification setup (Expo push token registration, permission prompts, `app.json` plugin config, Android `POST_NOTIFICATIONS` permission) — this is greenfield work.

## Related repos

- **Backend**: `../api-ibra` — see its own `CLAUDE.md`. Player-facing auth (`ensurePlayerAuthenticated`) and the notifications module this app is expected to consume live there.
- **Admin panel**: `../admin-web-amip` — staff-only Next.js panel, unrelated to this app's users (athletes).
