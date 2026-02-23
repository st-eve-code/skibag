import { View, Text, ImageBackground, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function wallet() {
  const [balance] = useState(5000);
  const [bonusBalance] = useState(1200);
  const [userName] = useState('John'); // Replace with actual user name from auth

  // Transaction history
  const transactions = [
    { id: 1, type: 'win', game: 'Chess Battle', amount: 2500, date: '2 hours ago', status: 'completed' },
    { id: 2, type: 'deposit', game: 'MTN Mobile Money', amount: 5000, date: '5 hours ago', status: 'completed' },
    { id: 3, type: 'loss', game: 'Ludo Match', amount: -1000, date: '1 day ago', status: 'completed' },
    { id: 4, type: 'win', game: 'Puzzle Challenge', amount: 500, date: '1 day ago', status: 'completed' },
    { id: 5, type: 'withdraw', game: 'Orange Money', amount: -3000, date: '2 days ago', status: 'pending' },
    { id: 6, type: 'bonus', game: 'Referral Bonus', amount: 1200, date: '3 days ago', status: 'completed' },
  ];

  // Quick actions
  const quickActions = [
    { id: 1, title: 'Deposit', icon: 'add-circle', color: '#3a6fe9' },
    { id: 2, title: 'Withdraw', icon: 'cash', color: '#22c55e' },
    { id: 3, title: 'History', icon: 'time', color: '#f59e0b' },
    { id: 4, title: 'Transfer', icon: 'swap-horizontal', color: '#8b5cf6' },
  ];

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'win': return 'trophy';
      case 'loss': return 'close-circle';
      case 'deposit': return 'arrow-down-circle';
      case 'withdraw': return 'arrow-up-circle';
      case 'bonus': return 'gift';
      default: return 'cash';
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'win': return '#22c55e';
      case 'loss': return '#ef4444';
      case 'deposit': return '#3a6fe9';
      case 'withdraw': return '#f59e0b';
      case 'bonus': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/bg3.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={['top']}>
          
          {/* Header - Now with greeting */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingText}>Hello there, {userName} !</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            
            {/* Balance Card - Now with Wallet title inside */}
            <View style={styles.balanceCardContainer}>
              <LinearGradient
                colors={['#3a6fe9', '#5b8ef7', '#3a6fe9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}
              >
                {/* Decorative circles */}
                <View style={styles.circleDecor1} />
                <View style={styles.circleDecor2} />
                
                <View style={styles.balanceContent}>
                  {/* Header with wallet icon and eye button */}
                  <View style={styles.balanceHeader}>
                    <View style={styles.walletTitleContainer}>
                      <Ionicons name="wallet" size={28} color="#fff" />
                      <Text style={styles.walletTitle}>My Wallet</Text>
                    </View>
                    <TouchableOpacity style={styles.eyeButton}>
                      <Ionicons name="eye" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Balance label */}
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  
                  {/* Balance amount */}
                  <View style={styles.balanceAmount}>
                    <Text style={styles.balanceNumber}>{balance.toLocaleString()}</Text>
                    <Text style={styles.currencySymbol}>XAF</Text>
                  </View>
                  
                  {/* Bonus chip */}
                  <View style={styles.bonusRow}>
                    <View style={styles.bonusChip}>
                      <Ionicons name="gift" size={14} color="#fbbf24" />
                      <Text style={styles.bonusText}>Bonus: {bonusBalance} XAF</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity 
                    key={action.id} 
                    style={styles.actionCard}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                      <Ionicons name={action.icon} size={24} color={action.color} />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Transaction History */}
            <View style={styles.transactionsContainer}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              {transactions.map((transaction) => (
                <TouchableOpacity 
                  key={transaction.id} 
                  style={styles.transactionCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.transactionIcon, 
                      { backgroundColor: getTransactionColor(transaction.type) + '20' }
                    ]}>
                      <Ionicons 
                        name={getTransactionIcon(transaction.type)} 
                        size={20} 
                        color={getTransactionColor(transaction.type)} 
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionGame}>{transaction.game}</Text>
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.amount > 0 ? '#22c55e' : '#ef4444' }
                    ]}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} XAF
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: transaction.status === 'completed' ? '#22c55e20' : '#f59e0b20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: transaction.status === 'completed' ? '#22c55e' : '#f59e0b' }
                      ]}>
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom padding for tab bar */}
            <View style={{ height: 100 }} />
          </ScrollView>

        </SafeAreaView>
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
    backgroundColor: 'rgba(12, 12, 12, 0.75)',
  },
  container: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Balance Card
  balanceCardContainer: {
    marginBottom: 25,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 25,
    position: 'relative',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#3a6fe9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  circleDecor1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -40,
    right: -20,
  },
  circleDecor2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -20,
    left: -10,
  },
  balanceContent: {
    zIndex: 1,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  eyeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  balanceNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginRight: 8,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bonusRow: {
    flexDirection: 'row',
  },
  bonusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bonusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Quick Actions
  quickActionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'rgba(42, 42, 42, 0.6)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // Transactions
  transactionsContainer: {
    marginBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3a6fe9',
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: 'rgba(42, 42, 42, 0.6)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionGame: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
