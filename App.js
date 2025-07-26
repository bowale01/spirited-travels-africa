import React from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  StatusBar 
} from 'react-native';

// Import clean test app
import CleanTestApp from './CleanTestApp';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <CleanTestApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
});
