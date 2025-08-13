import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function App() {
  const testButton = () => {
    Alert.alert('SUCCESS!', 'Button is working! React Native is functional.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Spirited Travels Africa</Text>
      <Text style={styles.subtitle}>Minimal Test App</Text>
      
      <TouchableOpacity style={styles.button} onPress={testButton}>
        <Text style={styles.buttonText}>TAP TO TEST</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        If you can tap the button and see an alert, everything works!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FF8C42',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});
