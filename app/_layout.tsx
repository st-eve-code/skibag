import { AuthProvider } from "@/lib/context/authContext";
import { I18nProvider } from "@/lib/context/I18nContext";
import { UserProvider } from "@/lib/context/userContext";
import { Stack } from "expo-router";

// Root layout — providers only, no auth-based navigation here.
// The splash screen (app/(screens)/splashscreen.tsx) handles all auth routing.
export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <UserProvider>
          <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(screens)" />
            <Stack.Screen name="(onboardScreen)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="game/[id]" />
            <Stack.Screen name="tournament/[id]" />
          </Stack>
        </UserProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
