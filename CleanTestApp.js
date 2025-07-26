import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// African sunset theme colors
const theme = {
  primary: '#FF8C42',      // Bright orange
  secondary: '#FFD700',    // Gold
  accent: '#FF6B35',       // Deep orange
  background: '#1A1A1A',   // Dark background
  surface: '#2A2A2A',      // Card background
  text: '#FFFFFF',         // White text
  textSecondary: '#CCCCCC', // Light gray text
};

export default function CleanTestApp() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>🌍 Spirited Travels Africa</Text>
        <Text style={styles.subtitle}>Your African Adventure Starts Here!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ App Features</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardEmoji}>🏺</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Discover Egypt</Text>
            <Text style={styles.cardDesc}>Explore ancient pyramids and rich culture</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardEmoji}>🦁</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Safari Adventures</Text>
            <Text style={styles.cardDesc}>Experience wildlife in Kenya & Tanzania</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardEmoji}>⛰️</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>South African Beauty</Text>
            <Text style={styles.cardDesc}>From Cape Town to Johannesburg</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Your Journey</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Destinations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Adventures</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>🚀 Start Your African Journey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.secondary,
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statsSection: {
    margin: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: theme.primary + '20',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: theme.primary,
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.background,
  },
});
