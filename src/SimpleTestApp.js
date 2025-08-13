import React from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

export default function SimpleTestApp() {
  const testClick = () => {
    Alert.alert('Success!', 'The app is working! You can click buttons.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C42" />
      <View style={styles.content}>
        <Text style={styles.title}>🌍 Spirited Travels Africa</Text>
        <Text style={styles.subtitle}>Test App - Debug Mode</Text>
        
        <TouchableOpacity style={styles.button} onPress={testClick}>
          <Text style={styles.buttonText}>Tap to Test</Text>
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            If you can see this and tap the button above, 
            the React Native app is working correctly!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    borderLeft: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
});
