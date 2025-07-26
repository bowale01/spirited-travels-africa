import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function SimpleHomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to Spirited Travels Africa! 🌍</Text>
        <Text style={styles.subtitle}>Discover the beauty of Africa with like-minded travelers</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Destinations</Text>
        
        <TouchableOpacity style={styles.destinationCard}>
          <Text style={styles.destinationEmoji}>🦁</Text>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationName}>Serengeti National Park</Text>
            <Text style={styles.destinationCountry}>Tanzania</Text>
            <Text style={styles.destinationDesc}>Witness the Great Migration</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.destinationCard}>
          <Text style={styles.destinationEmoji}>⛰️</Text>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationName}>Table Mountain</Text>
            <Text style={styles.destinationCountry}>South Africa</Text>
            <Text style={styles.destinationDesc}>Iconic Cape Town landmark</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.destinationCard}>
          <Text style={styles.destinationEmoji}>🏺</Text>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationName}>Pyramids of Giza</Text>
            <Text style={styles.destinationCountry}>Egypt</Text>
            <Text style={styles.destinationDesc}>Ancient wonders of the world</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Travel Matches</Text>
        
        <TouchableOpacity style={styles.matchCard}>
          <Text style={styles.matchEmoji}>🦁</Text>
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>Sarah Kenya Explorer</Text>
            <Text style={styles.matchDestination}>Masai Mara, Kenya</Text>
            <Text style={styles.matchDates}>March 15-25, 2024</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.matchCard}>
          <Text style={styles.matchEmoji}>🕌</Text>
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>Marcus Culture Fan</Text>
            <Text style={styles.matchDestination}>Marrakech, Morocco</Text>
            <Text style={styles.matchDates}>April 5-15, 2024</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Trips Planned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8C42',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 15,
  },
  destinationCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  destinationEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  destinationCountry: {
    fontSize: 14,
    color: '#FF8C42',
    marginTop: 2,
  },
  destinationDesc: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  matchEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchDestination: {
    fontSize: 14,
    color: '#FF8C42',
    marginTop: 2,
  },
  matchDates: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  statCard: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8C42',
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
    textAlign: 'center',
  },
});
