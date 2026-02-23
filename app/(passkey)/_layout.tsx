import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <View style={{flex:1, backgroundColor: 'rgba(237, 149, 41, 0.73)'}}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name='index' options={{headerShown:false}} />
        <Stack.Screen name='create_key' />
        <Stack.Screen name='verifykey' />
      </Stack>
    </View>
  )
}