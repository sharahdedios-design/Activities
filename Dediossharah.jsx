import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Profile Section */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👧🏻</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.username}>Sharah</Text>
          </View>
        </View>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>🏆 Mythic</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Banner Card */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTitle}>Season 32 Active</Text>
          <Text style={styles.bannerSubtitle}>Win 3 more matches to claim your exclusive skin reward!</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Queue Up</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Battle Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>68.4%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>7.8</Text>
            <Text style={styles.statLabel}>Avg KDA</Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <Text style={styles.sectionTitle}>Recent Matches</Text>
        <View style={styles.matchCard}>
          <View>
            <Text style={styles.matchHero}>Miya (Marksman)</Text>
            <Text style={styles.matchResultWin}>Victory • 12/2/5</Text>
          </View>
          <Text style={styles.matchTime}>10m ago</Text>
        </View>

        <View style={styles.matchCard}>
          <View>
            <Text style={styles.matchHero}>Tigreal (Tank)</Text>
            <Text style={styles.matchResultLoss}>Defeat • 2/5/14</Text>
          </View>
          <Text style={styles.matchTime}>2h ago</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setActiveTab('Home')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeNavText]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Market')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'Market' && styles.activeNavText]}>🛒 Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Profile')} style={styles.navItem}>
          <Text style={[styles.navText, activeTab === 'Profile' && styles.activeNavText]}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  welcomeText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  username: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rankBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bannerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerTitle: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginVertical: 8,
  },
  bannerButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  bannerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#1e293b',
    flex: 1,
    marginHorizontal: 4,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  matchCard: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  matchHero: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  matchResultWin: {
    color: '#4ade80',
    fontSize: 12,
    marginTop: 2,
  },
  matchResultLoss: {
    color: '#f87171',
    fontSize: 12,
    marginTop: 2,
  },
  matchTime: {
    color: '#64748b',
    fontSize: 11,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  navText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  activeNavText: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
});