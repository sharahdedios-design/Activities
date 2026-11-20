
import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Create Context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update the shared theme
  function toggleTheme() {
    setLoading(true);

    setTimeout(() => {
      setIsDark(previous => !previous);
      setLoading(false);
    }, 1000);
  }

  return (
    <ThemeContext.Provider
      value={{ isDark, loading, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Tab 1: Home Screen
function HomeScreen() {
  const { isDark } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#222222' : '#FFFFFF' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: isDark ? '#FFFFFF' : '#333333' },
        ]}
      >
        Home
      </Text>

      <Text
        style={[
          styles.message,
          { color: isDark ? '#FFFFFF' : '#333333' },
        ]}
      >
        Welcome to the Theme Switcher App!
      </Text>

      <Text
        style={[
          styles.themeText,
          { color: isDark ? '#90CAF9' : '#287A45' },
        ]}
      >
        Current Theme: {isDark ? 'Dark Mode' : 'Light Mode'}
      </Text>
    </View>
  );
}

// Tab 2: Settings Screen
function SettingsScreen() {
  const { isDark, loading, toggleTheme } =
    useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#222222' : '#FFFFFF' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: isDark ? '#FFFFFF' : '#333333' },
        ]}
      >
        Settings
      </Text>

      <Text
        style={[
          styles.message,
          { color: isDark ? '#FFFFFF' : '#333333' },
        ]}
      >
        Change your application theme.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={toggleTheme}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <Text style={styles.loading}>
          Updating theme...
        </Text>
      )}
    </View>
  );
}

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Main Application
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
          />

          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  themeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#287A45',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    color: '#2878B5',
    fontSize: 16,
    marginTop: 15,
  },
});
