import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect } from 'expo-router'
import * as ExpoSplashScreen from 'expo-splash-screen'

export default function Index() {
  useEffect(() => {
    // Hide the native splash screen immediately
    ExpoSplashScreen.hideAsync();
  }, []);

  return (
    <Redirect href="/(tabs)" />
  )
}