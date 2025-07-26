import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
} from 'react-native';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    country: '',
    city: '',
    interests: [],
    travelStyle: '',
  });

  const travelStyles = ['Budget', 'Luxury', 'Backpacker', 'Cultural', 'Adventure'];
  const availableInterests = [
    'Safari', 'Wildlife', 'Culture', 'Adventure', 'Food', 'Music', 
    'Photography', 'History', 'Beach', 'Mountains', 'Desert', 'Cities'
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profiles = await client.models.UserProfile.list({
        filter: { userId: { eq: user.userId } }
      });
      
      if (profiles.data.length > 0) {
        const profile = profiles.data[0];
        setUserProfile(profile);
        setEditForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          bio: profile.bio || '',
          country: profile.country || '',
          city: profile.city || '',
          interests: profile.interests || [],
          travelStyle: profile.travelStyle || '',
        });
      } else {
        // Create initial profile
        createInitialProfile();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const createInitialProfile = async () => {
    try {
      const newProfile = {
        userId: user.userId,
        username: user.attributes?.preferred_username || 'traveler',
        email: user.attributes?.email,
        firstName: user.attributes?.given_name || '',
        lastName: user.attributes?.family_name || '',
        interests: [],
        travelStyle: 'Adventure',
        isVerified: false,
      };

      const result = await client.models.UserProfile.create(newProfile);
      setUserProfile(result.data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      if (userProfile) {
        await client.models.UserProfile.update({
          id: userProfile.id,
          ...editForm,
        });
        
        Alert.alert('Success', 'Profile updated successfully!');
        setShowEditModal(false);
        loadUserProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const toggleInterest = (interest) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: signOut
        },
      ]
    );
  };

  const getProfileCompleteness = () => {
    if (!userProfile) return 0;
    
    const fields = [
      userProfile.firstName,
      userProfile.lastName,
      userProfile.bio,
      userProfile.country,
      userProfile.city,
      userProfile.interests?.length > 0,
      userProfile.travelStyle,
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const renderProfileSection = (title, content, icon) => (
    <View style={styles.profileSection}>
      <Text style={styles.sectionTitle}>{icon} {title}</Text>
      <Text style={styles.sectionContent}>{content || 'Not set'}</Text>
    </View>
  );

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {userProfile.firstName?.[0] || user.attributes?.given_name?.[0] || '👤'}
          </Text>
          {userProfile.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.profileName}>
          {userProfile.firstName} {userProfile.lastName}
        </Text>
        <Text style={styles.profileEmail}>{userProfile.email}</Text>
        
        {/* Profile Completeness */}
        <View style={styles.completenessContainer}>
          <Text style={styles.completenessText}>
            Profile {getProfileCompleteness()}% complete
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getProfileCompleteness()}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfo}>
        {renderProfileSection('Location', 
          userProfile.city && userProfile.country 
            ? `${userProfile.city}, ${userProfile.country}`
            : null, 
          '📍'
        )}
        
        {renderProfileSection('Bio', userProfile.bio, '📝')}
        
        {renderProfileSection('Travel Style', userProfile.travelStyle, '✈️')}
        
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>🎯 Interests</Text>
          <View style={styles.interestsContainer}>
            {userProfile.interests?.length > 0 ? (
              userProfile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.sectionContent}>No interests set</Text>
            )}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.upgradeButton}
        >
          <Text style={styles.upgradeButtonText}>⭐ Upgrade to Premium</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={updateProfile}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Basic Info */}
            <View style={styles.inputSection}>
              <Text style={styles.inputSectionTitle}>Basic Information</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.firstName}
                    onChangeText={(text) => setEditForm({...editForm, firstName: text})}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.lastName}
                    onChangeText={(text) => setEditForm({...editForm, lastName: text})}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editForm.bio}
                  onChangeText={(text) => setEditForm({...editForm, bio: text})}
                  placeholder="Tell us about yourself and your travel experiences..."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Location */}
            <View style={styles.inputSection}>
              <Text style={styles.inputSectionTitle}>Location</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.country}
                    onChangeText={(text) => setEditForm({...editForm, country: text})}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.city}
                    onChangeText={(text) => setEditForm({...editForm, city: text})}
                  />
                </View>
              </View>
            </View>

            {/* Travel Style */}
            <View style={styles.inputSection}>
              <Text style={styles.inputSectionTitle}>Travel Style</Text>
              <View style={styles.optionsContainer}>
                {travelStyles.map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.optionChip,
                      editForm.travelStyle === style && styles.optionChipSelected
                    ]}
                    onPress={() => setEditForm({...editForm, travelStyle: style})}
                  >
                    <Text style={[
                      styles.optionText,
                      editForm.travelStyle === style && styles.optionTextSelected
                    ]}>
                      {style}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Interests */}
            <View style={styles.inputSection}>
              <Text style={styles.inputSectionTitle}>Interests</Text>
              <View style={styles.optionsContainer}>
                {availableInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.optionChip,
                      editForm.interests.includes(interest) && styles.optionChipSelected
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text style={[
                      styles.optionText,
                      editForm.interests.includes(interest) && styles.optionTextSelected
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 60,
    width: 120,
    height: 120,
    backgroundColor: '#FF6B35',
    borderRadius: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4ECDC4',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  completenessContainer: {
    width: '100%',
    alignItems: 'center',
  },
  completenessText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
  },
  profileInfo: {
    padding: 20,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  editButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  upgradeButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signOutButton: {
    borderWidth: 2,
    borderColor: '#E74C3C',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
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
  inputSection: {
    marginBottom: 30,
  },
  inputSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
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
    width: '48%',
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  optionChipSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
});
