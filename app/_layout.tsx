import { Stack, router } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { UserProvider } from "@/lib/userContext";
import { useEffect } from "react";
import { initializeNotifications } from "@/lib/notificationService";

function RootNavigator() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait until auth state is known

    if (user) {
      router.replace('/(tabs)'); // authenticated → go to game
      // Initialize notifications after user is authenticated
      initializeNotifications().catch(console.error);
    } else {
      router.replace('/(auth)'); // not authenticated → go to login
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

export default function _layout() {
  return (
    <AuthProvider>
      <UserProvider>
        <RootNavigator />
      </UserProvider>
    </AuthProvider>
  );
}