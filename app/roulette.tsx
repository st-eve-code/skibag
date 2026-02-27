import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { hp, wp, fontScale } from '@/lib/responsive';
import { playRoulette, recordRouletteWin, getUserPointsAndCoins } from '@/lib/firestoreService';

const ROULETTE_SEGMENTS = [
  { label: '0', multiplier: 0, color: '#22c55e' },
  { label: '2x', multiplier: 2, color: '#3b82f6' },
  { label: '0', multiplier: 0, color: '#ef4444' },
  { label: '1.5x', multiplier: 1.5, color: '#8b5cf6' },
  { label: '0', multiplier: 0, color: '#f59e0b' },
  { label: '3x', multiplier: 3, color: '#3b82f6' },
  { label: '0', multiplier: 0, color: '#ef4444' },
  { label: '5x', multiplier: 5, color: '#22c55e' },
];

export default function RouletteGame() {
  const router = useRouter();
  const [betAmount, setBetAmount] = useState(10);
  const [coins, setCoins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ label: string; multiplier: number } | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Load user coins
  React.useEffect(() => {
    loadCoins();
  }, []);

  const loadCoins = async () => {
    const { coins: userCoins } = await getUserPointsAndCoins();
    setCoins(userCoins);
  };

  const spin = async () => {
    if (betAmount > coins) {
      Alert.alert('Insufficient Coins', 'You do not have enough coins to place this bet.');
      return;
    }

    if (betAmount <= 0) {
      Alert.alert('Invalid Bet', 'Please enter a valid bet amount.');
      return;
    }

    try {
      setSpinning(true);
      setResult(null);

      // Deduct bet amount from backend
      await playRoulette(betAmount);
      setCoins(prev => prev - betAmount);

      // Random result
      const randomIndex = Math.floor(Math.random() * ROULETTE_SEGMENTS.length);
      const winningSegment = ROULETTE_SEGMENTS[randomIndex];

      // Calculate rotation
      const segmentAngle = 360 / ROULETTE_SEGMENTS.length;
      const targetRotation = 360 * 5 + (randomIndex * segmentAngle); // 5 full spins + target

      // Animate
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: targetRotation,
        duration: 3000,
        useNativeDriver: true,
      }).start(async () => {
        setSpinning(false);
        setResult(winningSegment);

        if (winningSegment.multiplier > 0) {
          const winAmount = Math.floor(betAmount * winningSegment.multiplier);
          
          // Record win in backend
          await recordRouletteWin(winAmount, winningSegment.multiplier);
          setCoins(prev => prev + winAmount);

          Alert.alert(
            '🎉 You Won!',
            `You won ${winAmount} coins! (${winningSegment.multiplier}x)`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            '😔 Better Luck Next Time',
            'You didn\'t win this time. Try again!',
            [{ text: 'OK' }]
          );
        }
      });
    } catch (error: any) {
      setSpinning(false);
      Alert.alert('Error', error.message || 'Failed to spin roulette');
    }
  };

  const rotate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground
      source={require('@/assets/images/bg4.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={fontScale(24)} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Roulette</Text>
            <View style={styles.coinsDisplay}>
              <Ionicons name="logo-bitcoin" size={fontScale(20)} color="#f59e0b" />
              <Text style={styles.coinsText}>{coins}</Text>
            </View>
          </View>

          {/* Roulette Wheel */}
          <View style={styles.wheelContainer}>
            <Animated.View style={[styles.wheel, { transform: [{ rotate }] }]}>
              {ROULETTE_SEGMENTS.map((segment, index) => {
                const rotation = (360 / ROULETTE_SEGMENTS.length) * index;
                return (
                  <View
                    key={index}
                    style={[
                      styles.segment,
                      {
                        transform: [{ rotate: `${rotation}deg` }],
                        backgroundColor: segment.color,
                      },
                    ]}
                  >
                    <Text style={styles.segmentText}>{segment.label}</Text>
                  </View>
                );
              })}
            </Animated.View>
            
            {/* Pointer */}
            <View style={styles.pointer}>
              <Ionicons name="caret-down" size={fontScale(40)} color="#ffffff" />
            </View>
          </View>

          {/* Result Display */}
          {result && !spinning && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                {result.multiplier > 0
                  ? `🎉 ${result.label} - You won!`
                  : '😔 Better luck next time'}
              </Text>
            </View>
          )}

          {/* Bet Controls */}
          <View style={styles.betContainer}>
            <Text style={styles.betLabel}>Bet Amount</Text>
            <View style={styles.betControls}>
              <TouchableOpacity
                style={styles.betButton}
                onPress={() => setBetAmount(Math.max(10, betAmount - 10))}
                disabled={spinning}
              >
                <Ionicons name="remove" size={fontScale(24)} color="#ffffff" />
              </TouchableOpacity>
              
              <View style={styles.betDisplay}>
                <Text style={styles.betAmount}>{betAmount}</Text>
                <Text style={styles.betUnit}>coins</Text>
              </View>
              
              <TouchableOpacity
                style={styles.betButton}
                onPress={() => setBetAmount(Math.min(coins, betAmount + 10))}
                disabled={spinning}
              >
                <Ionicons name="add" size={fontScale(24)} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Quick Bet Buttons */}
            <View style={styles.quickBets}>
              {[10, 25, 50, 100].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickBetButton,
                    betAmount === amount && styles.quickBetButtonActive,
                  ]}
                  onPress={() => setBetAmount(amount)}
                  disabled={spinning || amount > coins}
                >
                  <Text
                    style={[
                      styles.quickBetText,
                      betAmount === amount && styles.quickBetTextActive,
                      amount > coins && styles.quickBetTextDisabled,
                    ]}
                  >
                    {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Spin Button */}
          <TouchableOpacity
            style={[styles.spinButton, spinning && styles.spinButtonDisabled]}
            onPress={spin}
            disabled={spinning}
          >
            <Text style={styles.spinButtonText}>
              {spinning ? 'Spinning...' : 'SPIN'}
            </Text>
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🎰 Spin to win up to 5x your bet!
            </Text>
            <Text style={styles.infoText}>
              💰 Use coins earned from referral points
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  container: { flex: 1, paddingHorizontal: wp(5) },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#ffffff',
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(5),
    gap: wp(1),
  },
  coinsText: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: '#ffffff',
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(3),
    position: 'relative',
  },
  wheel: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(35),
    backgroundColor: '#1a1a1f',
    borderWidth: 8,
    borderColor: '#3b48b9',
    position: 'relative',
  },
  segment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    top: '50%',
    left: '50%',
    transformOrigin: '0% 0%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: hp(1),
  },
  segmentText: {
    fontSize: fontScale(14),
    fontWeight: '700',
    color: '#ffffff',
  },
  pointer: {
    position: 'absolute',
    top: -hp(3),
    zIndex: 10,
  },
  resultContainer: {
    backgroundColor: 'rgba(59, 72, 185, 0.3)',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderRadius: wp(3),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#3b48b9',
  },
  resultText: {
    fontSize: fontScale(18),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  betContainer: {
    backgroundColor: 'rgba(26, 26, 31, 0.8)',
    borderRadius: wp(3),
    padding: wp(5),
    marginBottom: hp(2),
  },
  betLabel: {
    fontSize: fontScale(16),
    color: '#b0b0b0',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  betControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(5),
    marginBottom: hp(2),
  },
  betButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#3b48b9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  betDisplay: {
    alignItems: 'center',
  },
  betAmount: {
    fontSize: fontScale(32),
    fontWeight: '700',
    color: '#ffffff',
  },
  betUnit: {
    fontSize: fontScale(14),
    color: '#b0b0b0',
  },
  quickBets: {
    flexDirection: 'row',
    gap: wp(2),
    justifyContent: 'center',
  },
  quickBetButton: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: wp(2),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickBetButtonActive: {
    backgroundColor: '#3b48b9',
    borderColor: '#3b48b9',
  },
  quickBetText: {
    fontSize: fontScale(14),
    color: '#b0b0b0',
    fontWeight: '600',
  },
  quickBetTextActive: {
    color: '#ffffff',
  },
  quickBetTextDisabled: {
    color: '#555',
  },
  spinButton: {
    backgroundColor: '#3b48b9',
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  spinButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  spinButtonText: {
    fontSize: fontScale(20),
    fontWeight: '700',
    color: '#ffffff',
  },
  infoContainer: {
    alignItems: 'center',
    gap: hp(0.5),
  },
  infoText: {
    fontSize: fontScale(12),
    color: 'rgba(180, 180, 180, 0.7)',
    textAlign: 'center',
  },
});
