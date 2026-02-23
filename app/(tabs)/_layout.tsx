import { View, Text, StatusBar, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Stack, Tabs } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '@/constant/theme'

export default function _layout() {
  return (
    <ImageBackground 
      source={require('@/assets/images/bg1.jpg')} // Update with your image path
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Optional: Add a semi-transparent overlay for better readability */}
      <View style={styles.overlay}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <Tabs screenOptions={{
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                paddingVertical: 20,
                backgroundColor: 'transparent',
              },
              headerTintColor: theme.colors.headertext,
              headerTitleStyle: {
                fontWeight: "bold",
                textAlign: "center",
              },
              tabBarActiveTintColor: theme.colors.active,
              tabBarInactiveTintColor: theme.colors.inactive,
              tabBarShowLabel: true,
              tabBarStyle: {
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
                height: 90,
                backgroundColor: 'rgba(26, 26, 31, 0.95)',
                paddingTop: 17,
                borderTopStartRadius: 40,
                borderTopEndRadius: 40,
                position: 'absolute',
              },
              tabBarLabelStyle: {
                fontSize: 12,
              },
              headerShadowVisible: false,
              headerShown: false
            }}>
              <Tabs.Screen
                name="index"
                options={{
                  tabBarLabel: "Home",
                  tabBarIcon: ({ size, color, focused }) => {
                    return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
                  },
                }}
              />
              <Tabs.Screen
                name="games"
                options={{
                  tabBarLabel: "Games",
                  tabBarIcon: ({ size, color, focused }) => {
                    return <Ionicons name={focused ? "game-controller" : "game-controller-outline"} size={size} color={color} />;
                  },
                }}
              />
              <Tabs.Screen
                name="wallet"
                options={{
                  tabBarLabel: () => null,
                  tabBarButton: (props) => (
                    <TouchableOpacity
                      {...props}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{
                        position: 'absolute',
                        top: -30,
                        backgroundColor: '#4d5aee',
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#4557fc',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.5,
                        shadowRadius: 8,
                        elevation: 10,
                        borderWidth: 4,
                        borderColor: 'rgba(26, 26, 31, 0.95)',
                      }}>
                        <Ionicons name="wallet" size={30} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  ),
                }}
              />
              <Tabs.Screen
                name="events"
                options={{
                  tabBarLabel: "Events",
                  tabBarIcon: ({ size, color, focused }) => {
                    return <Ionicons name={focused ? "trophy" : "trophy-outline"} size={size} color={color} />;
                  },
                }}
              />
              <Tabs.Screen
                name="profile" 
                options={{
                  tabBarLabel: "Profile",
                  tabBarIcon: ({ size, color, focused }) => {
                    return <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />;
                  },
                }}
              />
            </Tabs>
          </SafeAreaView>
        </SafeAreaProvider>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(14, 14, 15, 0.85)', // Adjust opacity: 0 = fully transparent, 1 = fully opaque
  },
});