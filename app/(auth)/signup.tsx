import { View, Text, ImageBackground, StatusBar, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { useFonts } from 'expo-font'
import { router } from 'expo-router'
import { signInWithGoogle, signInWithApple } from '@/lib/authService'

export default function Signup() {
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.replace('/(tabs)'); // replace with your main screen route
    } catch (e: any) {
      Alert.alert('Google Sign-In Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    try {
      setLoading(true);
      await signInWithApple();
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Apple Sign-In Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('@/assets/images/domino.jpeg')}
        resizeMode='cover'
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(37, 16, 104, 0.78)', 'rgba(0, 0, 0, 0.99)']}
          start={{ x: 0.2, y: 0.3 }}
          end={{ x: 0.1, y: 1 }}
          style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <SafeAreaView style={{ flex: 1, width: "100%", paddingHorizontal: 10, justifyContent: "center" }}>
            <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 100, paddingHorizontal: 20 }}>

              {/* Loading Indicator */}
              {loading && (
                <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 20 }} />
              )}

              {/* Google */}
              <TouchableOpacity
                style={styles.whiteBtn}
                onPress={handleGoogle}
                disabled={loading}
              >
                <Image source={require('@/assets/logos/google.png')} style={styles.logo} />
                <Text style={styles.darkBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* Apple — iOS only */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.whiteBtn, { marginTop: 10 }]}
                  onPress={handleApple}
                  disabled={loading}
                >
                  <Image source={require('@/assets/logos/apple.png')} style={styles.logo} />
                  <Text style={styles.darkBtnText}>Continue with Apple</Text>
                </TouchableOpacity>
              )}

              {/* OR Divider */}
              <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}> OR </Text>
                <View style={styles.line} />
              </View>

              {/* Passkey */}
              <TouchableOpacity
                style={styles.purpleBtn}
                onPress={() => router.push('/(passkey)/create_key')}
                disabled={loading}
              >
                <Text style={styles.lightBtnText}>Create a one time passkey</Text>
              </TouchableOpacity>

              {/* Already have account */}
              <View style={{ alignItems: 'center', marginTop: 20, justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ color: '#f0f0f0d0', fontSize: 14, fontFamily: 'Montserrat-Regular' }}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={{ color: '#454ef3', fontSize: 14, fontWeight: 'bold' }}>Sign in</Text>
                </TouchableOpacity>
              </View>

            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  whiteBtn: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  purpleBtn: {
    backgroundColor: '#5929d4',
    padding: 15,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  logo: { width: 30, height: 30, marginRight: 10 },
  darkBtnText: { color: 'black', fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat-Regular' },
  lightBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins-Bold' },
  orContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#5a5a8076' },
  orText: { color: '#b6b6b6d0', fontSize: 12, fontWeight: 'bold', fontFamily: 'Poppins-Bold' },
});