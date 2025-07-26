import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [userProfile, setUserProfile] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock user profile data
      setUserProfile({
        name: 'Adventure Seeker',
        location: 'Cape Town, South Africa',
        tripsCompleted: 3,
        connectionsLead: 12
      });

      // Mock potential travel matches
      setPotentialMatches([
        {
          id: '1',
          name: 'Sarah Kenya Explorer',
          destination: 'Masai Mara, Kenya',
          travelDates: 'March 15-25, 2024',
          sharedInterests: ['Safari', 'Photography'],
          profileImage: '🦁'
        },
        {
          id: '2', 
          name: 'Marcus Culture Fan',
          destination: 'Marrakech, Morocco',
          travelDates: 'April 5-15, 2024',
          sharedInterests: ['Culture', 'Food'],
          profileImage: '🕌'
        },
        {
          id: '3',
          name: 'Zara Adventure',
          destination: 'Victoria Falls, Zambia',
          travelDates: 'May 10-20, 2024', 
          sharedInterests: ['Adventure', 'Nature'],
          profileImage: '🌊'
        }
      ]);

      // Mock popular African destinations
      setPopularDestinations([
        {
          id: '1',
          name: 'Serengeti National Park',
          country: 'Tanzania',
          image: '🦓',
          description: 'Witness the Great Migration',
          rating: 4.9
        },
        {
          id: '2',
          name: 'Table Mountain',
          country: 'South Africa', 
          image: '⛰️',
          description: 'Iconic Cape Town landmark',
          rating: 4.8
        },
        {
          id: '3',
          name: 'Pyramids of Giza',
          country: 'Egypt',
          image: '🏺',
          description: 'Ancient wonders of the world',
          rating: 4.7
        },
        {
          id: '4',
          name: 'Okavango Delta',
          country: 'Botswana',
          image: '🦛',
          description: 'UNESCO World Heritage wetland',
          rating: 4.9
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const mockDestinations = [
    { id: 1, name: 'Serengeti National Park', country: 'Tanzania', image: '🦁' },
    { id: 2, name: 'Victoria Falls', country: 'Zimbabwe/Zambia', image: '💧' },
    { id: 3, name: 'Sahara Desert', country: 'Morocco', image: '🐪' },
    { id: 4, name: 'Cape Town', country: 'South Africa', image: '🏔️' },
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {userProfile?.firstName || user?.attributes?.given_name || 'Explorer'}! 🌍
        </Text>
        <Text style={styles.subtitle}>Ready for your next African adventure?</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Destinations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Planned Trips</Text>
        </View>
      </View>

      {/* Featured Destinations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Trending in Africa</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockDestinations.map((destination) => (
            <TouchableOpacity key={destination.id} style={styles.destinationCard}>
              <View style={styles.destinationImage}>
                <Text style={styles.destinationEmoji}>{destination.image}</Text>
              </View>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <Text style={styles.destinationCountry}>{destination.country}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Travel Matches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Your Travel Matches</Text>
        {potentialMatches.length > 0 ? (
          potentialMatches.map((match, index) => (
            <TouchableOpacity key={index} style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>Travel Buddy #{index + 1}</Text>
                <Text style={styles.matchDetails}>
                  Shared interests: Safari, Culture, Adventure
                </Text>
                <Text style={styles.matchLocation}>Planning: Kenya, Tanzania</Text>
              </View>
              <View style={styles.matchScore}>
                <Text style={styles.scoreText}>92%</Text>
                <Text style={styles.scoreLabel}>Match</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤝</Text>
            <Text style={styles.emptyTitle}>No matches yet!</Text>
            <Text style={styles.emptySubtitle}>
              Complete your profile and create trip plans to find travel companions
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>📅</Text>
            <Text style={styles.actionText}>Plan Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>🔍</Text>
            <Text style={styles.actionText}>Find Buddies</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionEmoji}>⭐</Text>
            <Text style={styles.actionText}>Reviews</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
  },
  destinationCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  destinationEmoji: {
    fontSize: 30,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 5,
  },
  destinationCountry: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  matchDetails: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  matchLocation: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  matchScore: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
});
