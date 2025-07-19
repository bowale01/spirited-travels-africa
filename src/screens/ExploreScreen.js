import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const AFRICAN_COUNTRIES = [
  { name: 'South Africa', emoji: '🇿🇦', popular: ['Cape Town', 'Johannesburg', 'Durban'] },
  { name: 'Kenya', emoji: '🇰🇪', popular: ['Nairobi', 'Mombasa', 'Masai Mara'] },
  { name: 'Tanzania', emoji: '🇹🇿', popular: ['Serengeti', 'Zanzibar', 'Kilimanjaro'] },
  { name: 'Morocco', emoji: '🇲🇦', popular: ['Marrakech', 'Casablanca', 'Fez'] },
  { name: 'Egypt', emoji: '🇪🇬', popular: ['Cairo', 'Luxor', 'Alexandria'] },
  { name: 'Ghana', emoji: '🇬🇭', popular: ['Accra', 'Kumasi', 'Cape Coast'] },
  { name: 'Nigeria', emoji: '🇳🇬', popular: ['Lagos', 'Abuja', 'Kano'] },
  { name: 'Rwanda', emoji: '🇷🇼', popular: ['Kigali', 'Volcanoes NP', 'Lake Kivu'] },
  { name: 'Botswana', emoji: '🇧🇼', popular: ['Gaborone', 'Okavango Delta', 'Chobe'] },
  { name: 'Namibia', emoji: '🇳🇦', popular: ['Windhoek', 'Sossusvlei', 'Swakopmund'] },
];

const ACTIVITY_CATEGORIES = [
  { id: 'safari', name: 'Safari & Wildlife', emoji: '🦁', count: 245 },
  { id: 'beach', name: 'Beach & Coast', emoji: '🏖️', count: 186 },
  { id: 'culture', name: 'Culture & History', emoji: '🏺', count: 312 },
  { id: 'adventure', name: 'Adventure Sports', emoji: '🧗', count: 158 },
  { id: 'food', name: 'Food & Cuisine', emoji: '🍽️', count: 204 },
  { id: 'music', name: 'Music & Festivals', emoji: '🎵', count: 127 },
];

export default function ExploreScreen({ user, client }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [searchQuery, selectedCategory, destinations]);

  const loadDestinations = async () => {
    try {
      const result = await client.models.Destination.list({
        limit: 50
      });
      setDestinations(result.data);
    } catch (error) {
      console.error('Error loading destinations:', error);
      // Use mock data for now
      setDestinations(generateMockDestinations());
    }
  };

  const generateMockDestinations = () => {
    const mockDestinations = [];
    AFRICAN_COUNTRIES.forEach((country, countryIndex) => {
      country.popular.forEach((city, cityIndex) => {
        const categories = ['safari', 'beach', 'culture', 'adventure'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        mockDestinations.push({
          id: `${countryIndex}-${cityIndex}`,
          name: city,
          country: country.name,
          emoji: country.emoji,
          category: randomCategory,
          rating: (4 + Math.random()).toFixed(1),
          reviewCount: Math.floor(Math.random() * 500) + 50,
          description: `Experience the beauty of ${city} in ${country.name}`,
          activities: ['Cultural Tours', 'Local Cuisine', 'Photography'],
          bestTime: ['Dec-Mar', 'Jun-Sep'],
          budget: Math.floor(Math.random() * 2000) + 500,
        });
      });
    });
    return mockDestinations;
  };

  const filterDestinations = () => {
    let filtered = destinations;

    if (searchQuery) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  };

  const renderDestinationCard = ({ item }) => (
    <TouchableOpacity style={styles.destinationCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.countryEmoji}>{item.emoji}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
      </View>
      
      <Text style={styles.destinationName}>{item.name}</Text>
      <Text style={styles.countryName}>{item.country}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.budget}>From ${item.budget}</Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations in Africa..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#7F8C8D"
        />
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        <TouchableOpacity 
          style={[
            styles.categoryChip, 
            selectedCategory === 'all' && styles.categoryChipActive
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === 'all' && styles.categoryTextActive
          ]}>
            All Destinations
          </Text>
        </TouchableOpacity>
        
        {ACTIVITY_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Counter */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredDestinations.length} destinations found
        </Text>
      </View>

      {/* Destinations List */}
      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  categoryContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  categoryChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  resultsText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  listContainer: {
    padding: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: (width - 45) / 2,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countryEmoji: {
    fontSize: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 10,
    color: '#7F8C8D',
    marginLeft: 2,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 3,
  },
  countryName: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#7F8C8D',
    lineHeight: 16,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budget: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  exploreButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exploreButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
