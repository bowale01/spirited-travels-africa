import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function TripsScreen({ user, client }) {
  const [trips, setTrips] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('current'); // current, past, planned
  const [newTrip, setNewTrip] = useState({
    title: '',
    country: '',
    city: '',
    startDate: '',
    endDate: '',
    description: '',
    budget: '',
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const result = await client.models.Trip.list({
        filter: { userId: { eq: user.userId } }
      });
      setTrips(result.data);
    } catch (error) {
      console.error('Error loading trips:', error);
      // Use mock data for demo
      setTrips(generateMockTrips());
    }
  };

  const generateMockTrips = () => [
    {
      id: '1',
      title: 'Serengeti Safari Adventure',
      country: 'Tanzania',
      city: 'Serengeti',
      startDate: '2024-08-15',
      endDate: '2024-08-25',
      status: 'Planning',
      budget: 2500,
      description: 'Experience the Great Migration and Big Five',
      activities: ['Safari', 'Wildlife Photography', 'Cultural Tours'],
      groupSize: 2,
    },
    {
      id: '2',
      title: 'Cape Town & Wine Route',
      country: 'South Africa',
      city: 'Cape Town',
      startDate: '2024-06-10',
      endDate: '2024-06-20',
      status: 'Active',
      budget: 1800,
      description: 'Explore the Mother City and famous wine regions',
      activities: ['Wine Tasting', 'Mountain Hiking', 'City Tours'],
      groupSize: 1,
    },
    {
      id: '3',
      title: 'Moroccan Desert Experience',
      country: 'Morocco',
      city: 'Marrakech',
      startDate: '2024-03-05',
      endDate: '2024-03-12',
      status: 'Completed',
      budget: 1200,
      description: 'Desert camping and imperial cities tour',
      activities: ['Desert Camping', 'Camel Trekking', 'Medina Tours'],
      groupSize: 4,
    },
  ];

  const createTrip = async () => {
    try {
      await client.models.Trip.create({
        userId: user.userId,
        title: newTrip.title,
        country: newTrip.country,
        city: newTrip.city,
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        description: newTrip.description,
        budget: parseFloat(newTrip.budget) || 0,
        status: 'Planning',
        isPublic: true,
        groupSize: 1,
        activities: [],
      });
      
      Alert.alert('Success', 'Trip created successfully!');
      setShowCreateModal(false);
      setNewTrip({
        title: '',
        country: '',
        city: '',
        startDate: '',
        endDate: '',
        description: '',
        budget: '',
      });
      loadTrips();
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    }
  };

  const deleteTrip = (tripId) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await client.models.Trip.delete({ id: tripId });
              loadTrips();
            } catch (error) {
              console.error('Error deleting trip:', error);
            }
          }
        },
      ]
    );
  };

  const getFilteredTrips = () => {
    const now = new Date();
    return trips.filter(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      switch (selectedTab) {
        case 'current':
          return startDate <= now && endDate >= now;
        case 'planned':
          return startDate > now;
        case 'past':
          return endDate < now;
        default:
          return true;
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return '#3498DB';
      case 'Active': return '#2ECC71';
      case 'Completed': return '#95A5A6';
      case 'Cancelled': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderTripCard = (trip) => (
    <TouchableOpacity key={trip.id} style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripInfo}>
          <Text style={styles.tripTitle}>{trip.title}</Text>
          <Text style={styles.tripLocation}>📍 {trip.city}, {trip.country}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>
      </View>
      
      <Text style={styles.tripDescription} numberOfLines={2}>
        {trip.description}
      </Text>
      
      <View style={styles.tripDetails}>
        <Text style={styles.tripDate}>
          📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </Text>
        <Text style={styles.tripBudget}>💰 ${trip.budget}</Text>
      </View>
      
      <View style={styles.tripFooter}>
        <View style={styles.tripActivities}>
          {trip.activities?.slice(0, 2).map((activity, index) => (
            <View key={index} style={styles.activityTag}>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
          {trip.activities?.length > 2 && (
            <Text style={styles.moreActivities}>+{trip.activities.length - 2} more</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteTrip(trip.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['planned', 'current', 'past'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText, 
              selectedTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Trip Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createButtonText}>✈️ Plan New Trip</Text>
      </TouchableOpacity>

      {/* Trips List */}
      <ScrollView style={styles.tripsList}>
        {getFilteredTrips().length > 0 ? (
          getFilteredTrips().map(renderTripCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✈️</Text>
            <Text style={styles.emptyTitle}>No trips found</Text>
            <Text style={styles.emptySubtitle}>
              Start planning your African adventure!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Trip Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Plan New Trip</Text>
            <TouchableOpacity onPress={createTrip}>
              <Text style={styles.saveButton}>Create</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Trip Title</Text>
              <TextInput
                style={styles.input}
                value={newTrip.title}
                onChangeText={(text) => setNewTrip({...newTrip, title: text})}
                placeholder="e.g., Serengeti Safari Adventure"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.country}
                  onChangeText={(text) => setNewTrip({...newTrip, country: text})}
                  placeholder="e.g., Tanzania"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.city}
                  onChangeText={(text) => setNewTrip({...newTrip, city: text})}
                  placeholder="e.g., Serengeti"
                />
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.startDate}
                  onChangeText={(text) => setNewTrip({...newTrip, startDate: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.endDate}
                  onChangeText={(text) => setNewTrip({...newTrip, endDate: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Budget (USD)</Text>
              <TextInput
                style={styles.input}
                value={newTrip.budget}
                onChangeText={(text) => setNewTrip({...newTrip, budget: text})}
                placeholder="e.g., 2500"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newTrip.description}
                onChangeText={(text) => setNewTrip({...newTrip, description: text})}
                placeholder="Describe your trip plans..."
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#4ECDC4',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 5,
  },
  tripLocation: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tripDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 10,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tripDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  tripBudget: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripActivities: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  activityTag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  activityText: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  moreActivities: {
    fontSize: 10,
    color: '#7F8C8D',
    alignSelf: 'center',
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  cancelButton: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  saveButton: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    width: (width - 60) / 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
