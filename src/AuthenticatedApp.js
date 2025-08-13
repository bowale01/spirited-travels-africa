import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
  Dimensions,
  ImageBackground,
  StatusBar,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { generateClient } from 'aws-amplify/data';
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp } from 'aws-amplify/auth';

const { width, height } = Dimensions.get('window');

// Initialize Amplify Data client
const client = generateClient();

export default function AuthenticatedApp() {
  console.log('🚀 AuthenticatedApp component is mounting... [REFRESH TRIGGERED]');
  console.log('🌐 Platform:', Platform.OS);
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    console.log('🌐 Current URL:', window.location.href);
  } else {
    console.log('🌐 Running on mobile platform:', Platform.OS);
  }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('signup');
  const [currentScreen, setCurrentScreen] = useState('discover'); // discover, trips, messages, profile
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmationCode: '',
  });
  const [trips, setTrips] = useState([]);
  const [debugInfo, setDebugInfo] = useState('App starting...');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Enhanced African destinations data for travel discovery
  const sampleDestinations = [
    {
      id: 1,
      name: 'Victoria Falls',
      location: 'Zambia/Zimbabwe',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      description: 'Experience the thundering majesty of "Mosi-oa-Tunya" - the smoke that thunders',
      activities: ['Bungee Jumping', 'White Water Rafting', 'Helicopter Tours', 'Devil\'s Pool'],
      budget: '$1,200 - $2,500',
      duration: '5-7 days',
      bestTime: 'April - June',
      highlights: ['World\'s largest waterfall curtain', 'Adrenaline adventures', 'UNESCO World Heritage'],
      difficulty: 'Moderate',
      groupSize: '2-12 people',
    },
    {
      id: 2,
      name: 'Serengeti Safari',
      location: 'Tanzania',
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800',
      description: 'Witness the Great Migration - 2 million wildebeest crossing the endless plains',
      activities: ['Game Drives', 'Hot Air Balloon', 'Maasai Cultural Tours', 'Night Safari'],
      budget: '$2,000 - $4,000',
      duration: '7-10 days',
      bestTime: 'June - October',
      highlights: ['Great Migration', 'Big Five sightings', 'Maasai culture'],
      difficulty: 'Easy',
      groupSize: '4-8 people',
    },
    {
      id: 3,
      name: 'Kilimanjaro Trek',
      location: 'Tanzania',
      image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=800',
      description: 'Conquer Africa\'s highest peak - the Roof of Africa at 19,341 feet',
      activities: ['Mountain Trekking', 'Summit Attempt', 'Wildlife Spotting', 'Photography'],
      budget: '$1,800 - $3,500',
      duration: '6-9 days',
      bestTime: 'January - March, June - October',
      highlights: ['Uhuru Peak summit', 'Multiple climate zones', 'Glacial views'],
      difficulty: 'Challenging',
      groupSize: '6-12 people',
    },
    {
      id: 4,
      name: 'Sahara Desert',
      location: 'Morocco',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
      description: 'Sleep under a blanket of stars in the world\'s largest hot desert',
      activities: ['Camel Trekking', 'Desert Camping', 'Berber Culture', 'Sandboarding'],
      budget: '$600 - $1,200',
      duration: '3-5 days',
      bestTime: 'October - April',
      highlights: ['Erg Chebbi dunes', 'Nomadic culture', 'Stargazing'],
      difficulty: 'Easy',
      groupSize: '4-15 people',
    },
    {
      id: 5,
      name: 'Cape Town Adventure',
      location: 'South Africa',
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
      description: 'The Mother City where oceans meet mountains and cultures blend',
      activities: ['Table Mountain Hike', 'Wine Tours', 'Penguin Colony', 'Shark Cage Diving'],
      budget: '$800 - $1,800',
      duration: '4-6 days',
      bestTime: 'November - March',
      highlights: ['Table Mountain views', 'Cape Winelands', 'African penguins'],
      difficulty: 'Easy',
      groupSize: '2-10 people',
    },
    {
      id: 6,
      name: 'Okavango Delta',
      location: 'Botswana',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      description: 'Navigate the pristine waterways of Africa\'s last Eden',
      activities: ['Mokoro Trips', 'Game Drives', 'Walking Safari', 'Bird Watching'],
      budget: '$2,500 - $5,000',
      duration: '5-8 days',
      bestTime: 'May - September',
      highlights: ['Water-based safari', 'Pristine wilderness', 'Luxury lodges'],
      difficulty: 'Easy',
      groupSize: '2-8 people',
    },
    {
      id: 7,
      name: 'Gorilla Trekking',
      location: 'Rwanda/Uganda',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
      description: 'Meet our closest relatives in the misty mountains of Central Africa',
      activities: ['Gorilla Trekking', 'Golden Monkey Trek', 'Cultural Villages', 'Canopy Walk'],
      budget: '$2,000 - $4,500',
      duration: '4-7 days',
      bestTime: 'June - September, December - February',
      highlights: ['Mountain gorillas', 'Volcanoes National Park', 'Conservation experience'],
      difficulty: 'Moderate',
      groupSize: '8 people max',
    },
    {
      id: 8,
      name: 'Zanzibar Spice Island',
      location: 'Tanzania',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      description: 'Pristine beaches meet ancient Swahili culture on the Spice Island',
      activities: ['Spice Tours', 'Stone Town Exploration', 'Dhow Sailing', 'Snorkeling'],
      budget: '$700 - $1,500',
      duration: '4-7 days',
      bestTime: 'June - October, December - February',
      highlights: ['UNESCO Stone Town', 'Pristine beaches', 'Spice plantations'],
      difficulty: 'Easy',
      groupSize: '2-12 people',
    },
  ];

  useEffect(() => {
    console.log('AuthenticatedApp mounted - checking user...');
    setDebugInfo('AuthenticatedApp mounted - checking user...');
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking for authenticated user...');
      setDebugInfo('Checking for authenticated user...');
      const currentUser = await getCurrentUser();
      console.log('Found user:', currentUser);
      setDebugInfo(`Found user: ${currentUser.username}`);
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      }
    } catch (error) {
      console.log('No authenticated user found:', error.message);
      setDebugInfo(`No user found: ${error.message}`);
      // Clear any stale credentials
      try {
        await signOut();
      } catch (signOutError) {
        console.log('No active session to sign out from');
      }
    }
    setLoading(false);
  };

  const fetchData = async () => {
    // Simplified data fetching - no complex profile management needed
    try {
      const tripsResponse = await client.models.Trip.list();
      setTrips(tripsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { user } = await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName,
            family_name: formData.lastName,
          },
        },
      });
      console.log('Sign up successful:', user);
      setAuthMode('confirm');
      Alert.alert('Success! 🎉', 'Account created successfully! Please check your email for the confirmation code.');
    } catch (error) {
      console.error('Sign up error:', error);
      let errorMessage = error.message || 'An error occurred during sign up';
      
      // Handle specific error cases
      if (error.code === 'UsernameExistsException') {
        errorMessage = 'Account already exists with this email. Please sign in instead.';
      } else if (error.code === 'InvalidPasswordException') {
        errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, number and symbol.';
      } else if (error.code === 'InvalidParameterException') {
        errorMessage = 'Please check all fields are filled correctly.';
      }
      
      Alert.alert('Sign Up Error', errorMessage);
    }
    setLoading(false);
  };

  const handleConfirmSignUp = async () => {
    try {
      setLoading(true);
      await confirmSignUp({
        username: formData.email,
        confirmationCode: formData.confirmationCode,
      });
      Alert.alert('Success', 'Account confirmed! Please sign in.');
      setAuthMode('signin');
    } catch (error) {
      console.error('Confirmation error:', error);
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      
      // Clear any cached credentials first
      console.log('🔐 Attempting sign in for:', formData.email);
      console.log('🔧 Amplify configured check...');
      
      const { user } = await signIn({
        username: formData.email,
        password: formData.password,
      });
      
      console.log('✅ Sign in successful:', user);
      setUser(user);
      await checkUser();
    } catch (error) {
      console.error('❌ Sign in error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      let errorMessage = error.message || 'An error occurred during sign in';
      
      // Handle specific error cases
      if (error.code === 'UserNotFoundException' || error.message.includes('User does not exist')) {
        errorMessage = 'Account not found. Please sign up first or check your email address.';
      } else if (error.code === 'NotAuthorizedException' || error.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (error.code === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your account first. Check your email for confirmation code.';
        setAuthMode('confirm');
      } else if (error.message.includes('Unknown') || error.message.includes('unknown error')) {
        errorMessage = 'Authentication service unavailable. Please check your internet connection or try creating a new account.';
      } else if (error.message.includes('Network') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'InvalidParameterException') {
        errorMessage = 'Invalid email or password format. Please check your credentials.';
      }
      
      Alert.alert('Sign In Error', errorMessage);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setTrips([]);
      setCurrentCardIndex(0); // Reset to first card
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.debugText}>Debug: {debugInfo}</Text>
        <Text style={styles.debugText}>Loading State: TRUE</Text>
        <Text style={styles.debugText}>User: {user ? 'EXISTS' : 'NULL'}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#FF6B35', '#FF8C42', '#FFD700']}
          style={styles.gradientBackground}
        >
          <View style={styles.authContent}>
            {/* Tinder-like Logo Section */}
            <View style={styles.tinderLogoContainer}>
              <Text style={styles.tinderLogo}>🌍</Text>
              <Text style={styles.tinderAppName}>spirited</Text>
            </View>

            {/* Terms and Privacy Text */}
            <Text style={styles.termsText}>
              By tapping Log In or Continue, you agree to our{' '}
              <Text style={styles.linkText}>Terms</Text>. Learn how we process your data in our{' '}
              <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
              <Text style={styles.linkText}>Cookies Policy</Text>.
            </Text>

            {/* Social Login Buttons - Tinder Style */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => setAuthMode('signup')}>
                <View style={styles.socialButtonContent}>
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text style={styles.socialButtonText}>CONTINUE WITH GOOGLE</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={() => setAuthMode('signup')}>
                <View style={styles.socialButtonContent}>
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.socialButtonText}>LOG IN WITH FACEBOOK</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={() => setAuthMode('phone')}>
                <View style={styles.socialButtonContent}>
                  <Ionicons name="call-outline" size={20} color="#333" />
                  <Text style={styles.socialButtonText}>LOG IN WITH PHONE NUMBER</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Trouble Logging In */}
            <TouchableOpacity style={styles.troubleButton} onPress={() => setAuthMode('signup')}>
              <Text style={styles.troubleText}>Trouble Logging In?</Text>
            </TouchableOpacity>

            {/* Hidden form for actual authentication - shows when user taps any option */}
            {(authMode === 'signup' || authMode === 'signin' || authMode === 'phone') && (
              <View style={styles.actualAuthContainer}>
                <BlurView intensity={20} style={styles.authCard}>
                  <View style={styles.authModeSelector}>
                    <TouchableOpacity 
                      style={[styles.authTab, authMode === 'signin' && styles.authTabActive]}
                      onPress={() => setAuthMode('signin')}
                    >
                      <Text style={[styles.authTabText, authMode === 'signin' && styles.authTabTextActive]}>
                        Sign In
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.authTab, authMode === 'signup' && styles.authTabActive]}
                      onPress={() => setAuthMode('signup')}
                    >
                      <Text style={[styles.authTabText, authMode === 'signup' && styles.authTabTextActive]}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {authMode === 'signup' && (
                    <View style={styles.formContainer}>
                      <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#FF8C42" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="First Name"
                          value={formData.firstName}
                          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#FF8C42" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#FF8C42" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Email"
                          value={formData.email}
                          onChangeText={(text) => setFormData({ ...formData, email: text })}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#FF8C42" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Password"
                          value={formData.password}
                          onChangeText={(text) => setFormData({ ...formData, password: text })}
                          secureTextEntry
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                      </View>
                      <TouchableOpacity style={styles.modernButton} onPress={handleSignUp}>
                        <LinearGradient
                          colors={['#FF6B35', '#FF8C42']}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.buttonText}>Create Account</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}

                  {authMode === 'signin' && (
                    <View style={styles.formContainer}>
                      <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#FF8C42" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Email"
                          value={formData.email}
                          onChangeText={(text) => setFormData({ ...formData, email: text })}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#FF8C42" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Password"
                          value={formData.password}
                          onChangeText={(text) => setFormData({ ...formData, password: text })}
                          secureTextEntry
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                      </View>
                      <TouchableOpacity style={styles.modernButton} onPress={handleSignIn}>
                        <LinearGradient
                          colors={['#FF6B35', '#FF8C42']}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.buttonText}>Sign In</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}

                  {authMode === 'phone' && (
                    <View style={styles.formContainer}>
                      <Text style={styles.comingSoonText}>📱 Phone authentication coming soon!</Text>
                      <Text style={styles.comingSoonSubtext}>For now, please use email sign up above.</Text>
                      <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => setAuthMode('signup')}
                      >
                        <Text style={styles.backButtonText}>← Back to Sign Up</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {authMode === 'confirm' && (
                    <View style={styles.formContainer}>
                      <Text style={styles.confirmText}>
                        We sent a code to {formData.email}
                      </Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#FF8C42" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Confirmation Code"
                          value={formData.confirmationCode}
                          onChangeText={(text) => setFormData({ ...formData, confirmationCode: text })}
                          keyboardType="numeric"
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                      </View>
                      <TouchableOpacity style={styles.modernButton} onPress={handleConfirmSignUp}>
                        <LinearGradient
                          colors={['#FF6B35', '#FF8C42']}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.buttonText}>Verify Account</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </BlurView>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Enhanced Tinder-like Card Component
  const TravelCard = ({ destination, index, onSwipe }) => {
    return (
      <View style={[styles.card, { zIndex: sampleDestinations.length - index }]}>
        <ImageBackground
          source={{ uri: destination.image }}
          style={styles.cardImage}
          imageStyle={styles.cardImageStyle}
        >
          <LinearGradient
            colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{destination.name}</Text>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{destination.difficulty}</Text>
                </View>
              </View>
              
              <Text style={styles.cardLocation}>
                <Ionicons name="location-outline" size={16} color="#FFD700" />
                {destination.location}
              </Text>
              
              <Text style={styles.cardDescription}>{destination.description}</Text>
              
              <View style={styles.cardDetails}>
                <View style={styles.cardDetailItem}>
                  <Ionicons name="time-outline" size={16} color="#FF8C42" />
                  <Text style={styles.cardDetailText}>{destination.duration}</Text>
                </View>
                <View style={styles.cardDetailItem}>
                  <Ionicons name="wallet-outline" size={16} color="#FF8C42" />
                  <Text style={styles.cardDetailText}>{destination.budget}</Text>
                </View>
                <View style={styles.cardDetailItem}>
                  <Ionicons name="people-outline" size={16} color="#FF8C42" />
                  <Text style={styles.cardDetailText}>{destination.groupSize}</Text>
                </View>
              </View>

              <View style={styles.bestTimeContainer}>
                <Ionicons name="sunny-outline" size={16} color="#FFD700" />
                <Text style={styles.bestTimeText}>Best time: {destination.bestTime}</Text>
              </View>

              <ScrollView horizontal style={styles.activitiesContainer}>
                {destination.activities.map((activity, idx) => (
                  <View key={idx} style={styles.activityTag}>
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.highlightsContainer}>
                <Text style={styles.highlightsTitle}>✨ Highlights:</Text>
                {destination.highlights.slice(0, 2).map((highlight, idx) => (
                  <Text key={idx} style={styles.highlightText}>• {highlight}</Text>
                ))}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  // Bottom Navigation
  const BottomNavigation = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'discover' && styles.navItemActive]}
        onPress={() => setCurrentScreen('discover')}
      >
        <Ionicons 
          name={currentScreen === 'discover' ? 'compass' : 'compass-outline'} 
          size={24} 
          color={currentScreen === 'discover' ? '#FF8C42' : '#666'} 
        />
        <Text style={[styles.navText, currentScreen === 'discover' && styles.navTextActive]}>
          Discover
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'trips' && styles.navItemActive]}
        onPress={() => setCurrentScreen('trips')}
      >
        <Ionicons 
          name={currentScreen === 'trips' ? 'airplane' : 'airplane-outline'} 
          size={24} 
          color={currentScreen === 'trips' ? '#FF8C42' : '#666'} 
        />
        <Text style={[styles.navText, currentScreen === 'trips' && styles.navTextActive]}>
          My Trips
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'messages' && styles.navItemActive]}
        onPress={() => setCurrentScreen('messages')}
      >
        <Ionicons 
          name={currentScreen === 'messages' ? 'chatbubbles' : 'chatbubbles-outline'} 
          size={24} 
          color={currentScreen === 'messages' ? '#FF8C42' : '#666'} 
        />
        <Text style={[styles.navText, currentScreen === 'messages' && styles.navTextActive]}>
          Messages
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'profile' && styles.navItemActive]}
        onPress={() => setCurrentScreen('profile')}
      >
        <Ionicons 
          name={currentScreen === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={currentScreen === 'profile' ? '#FF8C42' : '#666'} 
        />
        <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {currentScreen === 'discover' && '🌍 Discover Africa'}
            {currentScreen === 'trips' && '✈️ My Adventures'}
            {currentScreen === 'messages' && '💬 Travel Buddies'}
            {currentScreen === 'profile' && '👤 My Profile'}
          </Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutIcon}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        {currentScreen === 'discover' && (
          <View style={styles.discoverContainer}>
            {currentCardIndex >= sampleDestinations.length ? (
              <View style={styles.noMoreCardsContainer}>
                <Text style={styles.noMoreCardsTitle}>🎉 You've explored all destinations!</Text>
                <Text style={styles.noMoreCardsSubtitle}>
                  Great taste in travel! Check back soon for more amazing African adventures.
                </Text>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => setCurrentCardIndex(0)}
                >
                  <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.resetButtonGradient}>
                    <Ionicons name="refresh" size={24} color="white" />
                    <Text style={styles.resetButtonText}>Explore Again</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <View style={styles.travelTips}>
                  <Text style={styles.travelTipsTitle}>💡 Travel Tips for Africa:</Text>
                  <Text style={styles.travelTip}>• Best time to visit: Dry season (May-October)</Text>
                  <Text style={styles.travelTip}>• Visa requirements vary by country</Text>
                  <Text style={styles.travelTip}>• Yellow fever vaccination may be required</Text>
                  <Text style={styles.travelTip}>• Pack layers for varying climates</Text>
                  <Text style={styles.travelTip}>• Book safaris in advance</Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.cardsContainer}>
                  {sampleDestinations.slice(currentCardIndex).map((destination, index) => (
                    <TravelCard 
                      key={destination.id} 
                      destination={destination} 
                      index={index}
                    />
                  ))}
                </View>
                
                {/* Enhanced Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.passButton]}
                    onPress={() => {
                      setCurrentCardIndex(prev => Math.min(prev + 1, sampleDestinations.length));
                    }}
                  >
                    <Ionicons name="close" size={32} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.infoButton]}
                    onPress={() => {
                      const current = sampleDestinations[currentCardIndex];
                      Alert.alert(
                        `${current?.name} Details`,
                        `🌍 ${current?.location}\n⏰ Best time: ${current?.bestTime}\n🎯 Difficulty: ${current?.difficulty}\n💰 Budget: ${current?.budget}\n\n✨ Highlights:\n${current?.highlights?.map(h => `• ${h}`).join('\n')}`,
                        [{ text: 'Got it!', style: 'default' }]
                      );
                    }}
                  >
                    <Ionicons name="information" size={28} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.superLikeButton]}
                    onPress={() => {
                      const current = sampleDestinations[currentCardIndex];
                      Alert.alert('🌟 Dream Destination!', `${current?.name} added to your bucket list! We'll help you plan this amazing adventure.`);
                      setCurrentCardIndex(prev => Math.min(prev + 1, sampleDestinations.length));
                    }}
                  >
                    <Ionicons name="star" size={28} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.likeButton]}
                    onPress={() => {
                      const current = sampleDestinations[currentCardIndex];
                      Alert.alert('❤️ Added to Wishlist!', `${current?.name} saved! We'll find travel buddies and deals for you.`);
                      setCurrentCardIndex(prev => Math.min(prev + 1, sampleDestinations.length));
                    }}
                  >
                    <Ionicons name="heart" size={32} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {currentScreen === 'trips' && (
          <View style={styles.tripsContainer}>
            <View style={styles.emptyTripsContainer}>
              <Text style={styles.emptyTripsIcon}>✈️</Text>
              <Text style={styles.emptyTripsTitle}>No trips yet!</Text>
              <Text style={styles.emptyTripsSubtext}>
                Start swiping on destinations to create your dream trips
              </Text>
            </View>
          </View>
        )}

        {currentScreen === 'messages' && (
          <View style={styles.messagesContainer}>
            <Text style={styles.emptyStateText}>💬 No messages yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Like destinations to connect with other travelers!
            </Text>
          </View>
        )}

        {currentScreen === 'profile' && (
          <View style={styles.profileContainer}>
            <View style={styles.simpleProfileCard}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {formData.firstName?.[0] || user?.username?.[0] || '🌍'}
                </Text>
              </View>
              <Text style={styles.profileName}>
                {formData.firstName || user?.username || 'Travel Explorer'}
              </Text>
              <Text style={styles.profileEmail}>{user?.username}</Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Trips</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  // Authentication Styles
  authContainer: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
  },

  // Tinder-like Logo Styles
  tinderLogoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  tinderLogo: {
    fontSize: 80,
    marginBottom: 10,
  },
  tinderAppName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
  },

  // Terms and Privacy Text
  termsText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    marginHorizontal: 30,
    marginTop: 80,
  },
  linkText: {
    color: 'white',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Social Login Buttons - Tinder Style
  socialButtonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  socialButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    letterSpacing: 0.5,
  },

  // Trouble Logging In
  troubleButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  troubleText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },

  // Actual Auth Container (appears when user taps social buttons)
  actualAuthContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },

  // Keep existing auth card styles but update them
  authCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
  },
  authModeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,140,66,0.1)',
    borderRadius: 25,
    marginBottom: 30,
  },
  authTab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  authTabActive: {
    backgroundColor: '#FF8C42',
  },
  authTabText: {
    color: '#666',
    fontWeight: '600',
  },
  authTabTextActive: {
    color: 'white',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,140,66,0.2)',
  },
  inputIcon: {
    marginRight: 10,
  },
  modernInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    paddingVertical: 15,
  },
  modernButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },

  // Phone auth coming soon styles
  comingSoonText: {
    color: '#FF8C42',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  comingSoonSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF8C42',
    fontSize: 16,
    fontWeight: '600',
  },

  debugText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
  },

  // Main App Styles
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  signOutIcon: {
    padding: 5,
  },
  content: {
    flex: 1,
  },

  // Discover/Cards Styles
  discoverContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    position: 'absolute',
    width: width - 40,
    height: height * 0.7,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  cardGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 60,
  },
  cardContent: {
    justifyContent: 'flex-end',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 140, 66, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardLocation: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
    lineHeight: 22,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  cardDetailText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 11,
  },
  bestTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bestTimeText: {
    color: '#FFD700',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  activitiesContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  activityTag: {
    backgroundColor: 'rgba(255, 140, 66, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  activityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  highlightsContainer: {
    marginTop: 5,
  },
  highlightsTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  highlightText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#FF4458',
  },
  infoButton: {
    backgroundColor: '#6C7CE7',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  superLikeButton: {
    backgroundColor: '#42CDF7',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    backgroundColor: '#66D7A2',
  },

  // No More Cards Screen
  noMoreCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noMoreCardsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  noMoreCardsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  resetButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 40,
  },
  resetButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  travelTips: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  travelTipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 15,
  },
  travelTip: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navItemActive: {
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#FF8C42',
    fontWeight: '600',
  },

  // Trips Screen
  tripsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTripsContainer: {
    alignItems: 'center',
  },
  emptyTripsIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTripsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyTripsSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Messages Screen
  messagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Profile Screen
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  simpleProfileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    width: '100%',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C42',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    color: '#FF8C42',
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
  },
});
