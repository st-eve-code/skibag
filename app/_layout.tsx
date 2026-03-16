import { AuthProvider, useAuth } from "@/lib/authContext";
import { I18nProvider } from "@/lib/I18nContext";
import { initializeNotifications } from "@/lib/notificationService";
import { UserProvider } from "@/lib/userContext";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";

function RootNavigator() {
  const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Wait for auth to be ready AND give splash screen time to display
  useEffect(() => {
    if (loading) return;

    // Give splash screen time to display (2 seconds minimum)
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  // Navigate once ready
  useEffect(() => {
    if (!isReady || hasNavigated) return;

    if (user) {
      setHasNavigated(true);
      router.replace("/(tabs)");
      initializeNotifications().catch(console.error);
    } else {
      setHasNavigated(true);
      router.replace("/");
    }
  }, [isReady, user, hasNavigated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="all-games" />
      <Stack.Screen name="language" />
      <Stack.Screen name="language-selection" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="game/[id]" />
      <Stack.Screen name="(onboardScreen)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="splashscreen" />
      <Stack.Screen name="(passkey)" />
      
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <UserProvider>
          <RootNavigator />
        </UserProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
