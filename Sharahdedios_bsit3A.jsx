import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  // State for current input text
  const [inputText, setInputText] = useState('');
  
  // State for managing the movie list
  const [movies, setMovies] = useState([
    { id: '1', title: 'Inception', completed: true },
    { id: '2', title: 'Interstellar', completed: false },
    { id: '3', title: 'Dune: Part Two', completed: false },
  ]);

  // Add item handler
  const addMovie = () => {
    if (inputText.trim() === '') return;

    const newItem = {
      id: Date.now().toString(),
      title: inputText,
      completed: false,
    };

    setMovies((prevMovies) => [newItem, ...prevMovies]);
    setInputText('');
  };

  // Toggle completion status
  const toggleComplete = (id) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, completed: !movie.completed } : movie
      )
    );
  };

  // Delete item handler
  const deleteMovie = (id) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
  };

  // FlatList row layout renderer
  const renderItem = ({ item }) => (
    <View style={styles.movieCard}>
      <TouchableOpacity
        style={styles.movieInfoContainer}
        onPress={() => toggleComplete(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[
            styles.movieTitle,
            item.completed && styles.movieTitleCompleted,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteMovie(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎬 Movie Wishlist</Text>
          <Text style={styles.headerSubtitle}>
            {movies.filter((m) => m.completed).length} of {movies.length} watched
          </Text>
        </View>

        {/* Input and Add Button Component */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a movie to your wishlist..."
            placeholderTextColor="#8e8e93"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addMovie}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addMovie}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* FlatList Component */}
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your wishlist is empty. Add a movie above!</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  addButton: {
    marginLeft: 12,
    backgroundColor: '#e50914',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  movieInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8e8e93',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#30d158',
    borderColor: '#30d158',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  movieTitle: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  movieTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8e8e93',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff453a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#8e8e93',
    fontSize: 14,
    textAlign: 'center',
  },
});