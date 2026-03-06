import { AuthProvider, useAuth } from "@/lib/authContext";
import { initializeNotifications } from "@/lib/notificationService";
import { UserProvider } from "@/lib/userContext";
import { Stack, router } from "expo-router";
import { useEffect } from "react";

function RootNavigator() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/(tabs)");
      initializeNotifications().catch(console.error);
    } else {
      router.replace("/(auth)");
    }
  }, [user, loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="all-games" />
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
    <AuthProvider>
      <UserProvider>
        <RootNavigator />
      </UserProvider>
    </AuthProvider>
  );
}
