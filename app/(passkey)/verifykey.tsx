import { View, Text, ImageBackground, TouchableOpacity, Image, StyleSheet} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper'
import { router } from 'expo-router'

export default function verifykey() {
 
  return (
    <ImageBackground
    source={require('@/assets/images/star.jpeg')}
    resizeMode='cover'
    style={{flex:1}}
    >
      <LinearGradient
      colors={['rgba(66, 126, 148, 0.07)','rgba(37, 60, 103, 0.36)','rgba(7, 22, 55, 0.83)','rgb(7, 12, 40)']}
      start={{ x: 0.2, y: 0.3 }}
      end={{ x: 0.1, y: 1 }}
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      >
        <SafeAreaView 
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          paddingHorizontal: 10,
          justifyContent: "center",
        }}>
        <View 
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: 'center',
          paddingBottom: 2,
          marginTop: 50,
          paddingHorizontal: 20,
          flexDirection: 'column'
        }}>
          <Text 
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 18,
            textAlign: 'center',
            
          }}
          >
             Let us give it another shot
          </Text>
          <Text 
          style={{
            fontSize: 16,
            fontWeight: 'medium',
            color: '#ffffff',
            marginBottom: 20,
            textAlign: 'center',
          }}
          >
            Kindly use the same passkey you created during the signup process to log in. 
            Please ensure your passkey meets the required passkey format (e.g nameXXX237)

          </Text>
          <View 
          style={{
            width: '100%',
            marginTop: 10,
          }}
          >
            <TextInput
              // label={'Passkey'}
              placeholder="juniorXXX237"
              autoCapitalize="none"
              mode="outlined"
              style={{
                width: "100%",
                marginBottom: 20,
                backgroundColor: "#ffffff",
              }}
              outlineColor="#ffffff"
              activeOutlineColor="#0c499e"
              textColor="#000000"
            />

            {/* if user inputs a valid passkey format (nameXXX237) with no space , 
            then the system sends an alert to the user saying that passkey is valid */}
            {/* once the passkey has been verified the user is sent to the homepage */}
            <Button  
                mode="contained" 
                buttonColor="#3d579a"
                textColor="#ffffff"
                style={{
                  width: "100%",
                  paddingVertical: 8,
                  
                }} 
                onPress={() => router.push('/(tabs)')}
            >
              <Text 
              style={{
                fontSize: 15
            }}
              >
                Login with my passkey
              </Text>
            </Button>

            {/* OR Divider */}
            <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}> OR </Text>
                <View style={styles.line} />
            </View>

            {/* signup with google */}
            <TouchableOpacity style={{
                backgroundColor:'white',
                padding:15,
                borderRadius:100,
                width:'100%',
                alignItems:'center'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image 
                        source={require('@/assets/logos/google.png')} 
                        style={{ width: 30, height: 30, marginRight: 10 }} 
                    />
                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat-Regular' }}>
                        Continue with Google
                    </Text>
                </View>
            </TouchableOpacity>

            {/* signup with apple */}
            <TouchableOpacity style={{
                backgroundColor:'white',
                padding:15,
                borderRadius:100,
                width:'100%',
                alignItems:'center',
                marginTop:20
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image 
                        source={require('@/assets/logos/apple.png')} 
                        style={{ width: 30, height: 30, marginRight: 10 }} 
                    />
                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat-Regular' }}>
                        Continue with Apple
                    </Text>
                </View>
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ffffff76',
  },
  orCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  orText: {
    color: '#ffffffd0',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
});