# Skibag - Gaming Platform App 🎮

A cross-platform mobile gaming application built with React Native and Expo, featuring user authentication, game browsing, tournaments, leaderboards, and in-app wallet functionality.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Scripts](#-scripts)
- [Environment Setup](#-environment-setup)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

- **User Authentication**
  - Google Sign-In integration
  - Apple Sign-In (iOS only)
  - Passkey authentication support
  - Firebase Authentication backend

- **Gaming Platform**
  - Browse 11+ popular games across multiple categories
  - Game details with ratings and descriptions
  - Tournament participation
  - Match history tracking
  - Leaderboard system

- **User Profile**
  - Avatar customization with image cropping
  - Rank progression system (Beginner → Advanced → Pro → Legend)
  - User statistics and achievements
  - Language selection
  - Privacy settings

- **Wallet & Transactions**
  - In-app wallet management
  - Transaction history
  - Virtual currency system

- **Additional Features**
  - Events and notifications
  - Onboarding experience with animated slides
  - Responsive design for various screen sizes
  - Dark/light mode support
  - Haptic feedback

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev) (~54.0.33) with React Native (0.81.5)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase (Authentication, Firestore)
- **UI Components**: 
  - React Native Paper
  - Expo Vector Icons
  - Lottie animations
  - Expo Linear Gradient
- **State Management**: React Context API
- **Authentication Providers**:
  - Google Sign-In
  - Apple Authentication
- **Build Tool**: EAS Build
- **Platform Support**: iOS, Android, Web

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **iOS Development** (macOS only):
  - Xcode (latest version)
  - CocoaPods
- **Android Development**:
  - Android Studio
  - Android SDK

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skibag
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

## ⚙️ Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication methods (Google, Apple)
3. Enable Firestore Database
4. Download configuration files:
   - **Android**: `google-services.json` → place in project root
   - **iOS**: `GoogleService-Info.plist` → place in project root

### Google Sign-In Configuration

Update the `webClientId` in `lib/authService.tsx`:
```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

### App Configuration

The app configuration is in `app.json`:
- Update `expo.name` for your app name
- Update `expo.slug` for your app slug
- Update bundle identifiers:
  - iOS: `expo.ios.bundleIdentifier`
  - Android: `expo.android.package`

## 🚀 Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
# or
npx expo start
```

### Platform-Specific Commands

**iOS Simulator**:
```bash
npm run ios
# or
npx expo run:ios
```

**Android Emulator**:
```bash
npm run android
# or
npx expo run:android
```

**Web Browser**:
```bash
npm run web
# or
expo start --web
```

### Development Build

For features requiring native code (Firebase, Google Sign-In):
```bash
npx expo run:ios
npx expo run:android
```

## 📁 Project Structure

```
skibag/
├── app/                      # Expo Router file-based routing
│   ├── (auth)/              # Authentication screens
│   ├── (onboardScreen)/     # Onboarding flow
│   ├── (passkey)/           # Passkey authentication
│   ├── (tabs)/              # Main app tabs (Home, Games, Events, Wallet, Profile)
│   ├── game/                # Game details
│   ├── tournament/          # Tournament details
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Entry point
│   └── [other screens]      # Standalone screens
├── assets/                   # Images, fonts, animations
│   ├── animations/          # Lottie animations
│   ├── badges/              # Achievement badges
│   ├── fonts/               # Custom fonts
│   ├── gameicons/           # Game thumbnails
│   ├── images/              # General images
│   ├── logos/               # Brand logos
│   └── ranks/               # Rank icons
├── constant/                 # App constants
│   ├── games.ts             # Game data
│   ├── onboardSlides.ts     # Onboarding content
│   └── theme.ts             # Theme configuration
├── lib/                      # Core utilities and services
│   ├── authContext.tsx      # Authentication context
│   ├── authService.tsx      # Authentication methods
│   ├── firestoreService.ts  # Firestore operations
│   ├── userContext.tsx      # User state management
│   └── responsive.ts        # Responsive design utilities
├── types/                    # TypeScript type definitions
├── app.json                  # Expo configuration
├── package.json              # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🎯 Key Features

### Authentication Flow
1. Splash screen with animation
2. Onboarding slides (4 screens)
3. Authentication options (Google/Apple)
4. Optional passkey setup
5. Main app navigation

### Main Tabs
- **Home**: Dashboard with quick access to features
- **Games**: Browse and search games by category
- **Events**: View upcoming tournaments and events
- **Wallet**: Manage virtual currency and transactions
- **Profile**: User settings, stats, and customization

### Game Categories
- Action & Strategy
- Racing
- Casino
- Fighting
- Physics-based
- Adventure

### Rank System
- Beginner (starting rank)
- Advanced
- Pro
- Legend

## 📜 Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
npm run postbuild  # Generate sitemap (runs after build)
```

## 🔐 Environment Setup

### Required Environment Variables

Firebase configuration is handled through:
- `google-services.json` (Android)
- `GoogleService-Info.plist` (iOS)

### EAS Build

This project uses EAS Build. Configuration is in `eas.json`.

To build:
```bash
eas build --platform ios
eas build --platform android
```

## 🎨 Customization

### Theme
Edit `constant/theme.ts` to customize colors, fonts, and spacing.

### Games
Add or modify games in `constant/games.ts`.

### Onboarding
Update onboarding slides in `constant/onboardSlides.ts`.

## 🐛 Troubleshooting

### Common Issues

**Firebase not working**:
- Ensure `google-services.json` and `GoogleService-Info.plist` are in the correct location
- Run `npx expo prebuild` to regenerate native directories

**Google Sign-In fails**:
- Verify `webClientId` is correct
- Check Firebase console for enabled authentication methods

**iOS build errors**:
- Run `cd ios && pod install && cd ..`
- Clean Xcode build folder

**Android build errors**:
- Clean Gradle cache: `cd android && ./gradlew clean && cd ..`

## 📱 Platform-Specific Notes

### iOS
- Requires Xcode for development
- Apple Sign-In only works on iOS devices
- Test on simulator or physical device

### Android
- Requires Android Studio and SDK
- Test on emulator or physical device
- Edge-to-edge UI enabled

### Web
- Limited features (no native authentication)
- Static site generation enabled
- Sitemap auto-generated after build

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For issues and questions:
- Check the [TODO.md](./TODO.md) for known issues
- Review Expo documentation: https://docs.expo.dev
- Firebase documentation: https://firebase.google.com/docs

---

**Built with ❤️ using Expo and React Native**
