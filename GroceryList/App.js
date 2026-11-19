
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'GROCERY_LIST';

export default function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // READ: Load saved grocery items when the app opens
  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const savedItems = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedItems !== null) {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to load grocery items.');
    }
  }

  // SAVE: Store grocery items on the device
  async function saveItems(updatedItems) {
    try {
      const jsonValue = JSON.stringify(updatedItems);

      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);

      setItems(updatedItems);
    } catch (error) {
      Alert.alert('Error', 'Unable to save grocery items.');
    }
  }

  // CREATE and UPDATE
  async function handleSave() {
    if (itemName.trim() === '') {
      Alert.alert('Notice', 'Please enter a grocery item.');
      return;
    }

    if (editingId !== null) {
      // UPDATE an existing grocery item
      const updatedItems = items.map((item) =>
        item.id === editingId
          ? { ...item, name: itemName.trim() }
          : item
      );

      await saveItems(updatedItems);
      setEditingId(null);
    } else {
      // CREATE a new grocery item
      const newItem = {
        id: Date.now().toString(),
        name: itemName.trim(),
      };

      const updatedItems = [...items, newItem];

      await saveItems(updatedItems);
    }

    setItemName('');
  }

  // EDIT a grocery item
  function handleEdit(item) {
    setItemName(item.name);
    setEditingId(item.id);
  }

  // DELETE a grocery item
  async function handleDelete(id) {
    const updatedItems = items.filter((item) => item.id !== id);

    await saveItems(updatedItems);

    if (editingId === id) {
      setEditingId(null);
      setItemName('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery List</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter grocery item..."
        value={itemName}
        onChangeText={setItemName}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          {editingId !== null ? 'Update Item' : 'Add Item'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.heading}>My Grocery Items</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No grocery items yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#287A45',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#287A45',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 17,
    color: '#333333',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#2878B5',
    padding: 10,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#D64545',
    padding: 10,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 20,
  },
});
