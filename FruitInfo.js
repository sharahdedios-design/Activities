
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

const fruits = {
  mango: {
    emoji: "🥭",
    name: "Mango",
    vitamins: [
      {
        name: "Vitamin A",
        purpose: "Supports healthy eyes, skin, and immune function.",
      },
      {
        name: "Vitamin C",
        purpose: "Supports immunity, collagen production, and wound healing.",
      },
      {
        name: "Vitamin E",
        purpose: "Helps protect cells from oxidative damage.",
      },
      {
        name: "Vitamin B6",
        purpose: "Supports brain function and energy metabolism.",
      },
    ],
    benefits: [
      "Supports immune health.",
      "Provides fiber for digestion.",
      "Contains antioxidants.",
    ],
  },

  banana: {
    emoji: "🍌",
    name: "Banana",
    vitamins: [
      {
        name: "Vitamin B6",
        purpose: "Supports brain development and energy metabolism.",
      },
      {
        name: "Vitamin C",
        purpose: "Helps support immunity and healthy skin.",
      },
    ],
    minerals: [
      {
        name: "Potassium",
        purpose: "Helps muscles, nerves, and heart function.",
      },
    ],
    benefits: [
      "Provides energy through carbohydrates.",
      "Supports normal muscle function.",
      "Contains fiber for digestion.",
    ],
  },

  orange: {
    emoji: "🍊",
    name: "Orange",
    vitamins: [
      {
        name: "Vitamin C",
        purpose: "Supports immunity and collagen production.",
      },
      {
        name: "Vitamin B1",
        purpose: "Helps the body convert food into energy.",
      },
      {
        name: "Folate (Vitamin B9)",
        purpose: "Supports cell growth and red blood cell formation.",
      },
    ],
    benefits: [
      "Supports immune function.",
      "Helps maintain healthy skin.",
      "Provides hydration and fiber.",
    ],
  },

  apple: {
    emoji: "🍎",
    name: "Apple",
    vitamins: [
      {
        name: "Vitamin C",
        purpose: "Helps support immunity and healthy tissues.",
      },
      {
        name: "Vitamin K",
        purpose: "Helps with normal blood clotting and bone health.",
      },
    ],
    benefits: [
      "Contains dietary fiber.",
      "Supports digestive health.",
      "Provides antioxidants.",
    ],
  },

  papaya: {
    emoji: "🍈",
    name: "Papaya",
    vitamins: [
      {
        name: "Vitamin C",
        purpose: "Supports immune function and collagen production.",
      },
      {
        name: "Vitamin A",
        purpose: "Supports vision and healthy skin.",
      },
      {
        name: "Folate (Vitamin B9)",
        purpose: "Helps with cell growth and development.",
      },
    ],
    benefits: [
      "Provides dietary fiber.",
      "Contains antioxidants.",
      "Contains papain, an enzyme that helps break down proteins.",
    ],
  },

  watermelon: {
    emoji: "🍉",
    name: "Watermelon",
    vitamins: [
      {
        name: "Vitamin C",
        purpose: "Supports immunity and collagen production.",
      },
      {
        name: "Vitamin A",
        purpose: "Supports normal vision and immune function.",
      },
    ],
    benefits: [
      "Contains a high amount of water for hydration.",
      "Provides lycopene, an antioxidant.",
      "Contains small amounts of potassium.",
    ],
  },
};

export default function App() {
  const [fruitName, setFruitName] = useState("");
  const [fruit, setFruit] = useState(null);

  const searchFruit = () => {
    const search = fruitName.trim().toLowerCase();

    if (!search) {
      Alert.alert("Empty Search", "Please enter a fruit name.");
      return;
    }

    const foundFruit = fruits[search];

    if (foundFruit) {
      setFruit(foundFruit);
    } else {
      setFruit(null);
      Alert.alert(
        "Fruit Not Found",
        "Please try Mango, Banana, Orange, Apple, Papaya, or Watermelon."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🍓 FruitVita</Text>
      <Text style={styles.subtitle}>
        Discover the vitamins and benefits of fruits!
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter fruit name..."
          value={fruitName}
          onChangeText={setFruitName}
          onSubmitEditing={searchFruit}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchFruit}
        >
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Try: Mango, Banana, Orange, Apple, Papaya
      </Text>

      {fruit && (
        <View style={styles.resultCard}>
          <Text style={styles.fruitEmoji}>{fruit.emoji}</Text>

          <Text style={styles.fruitName}>{fruit.name}</Text>

          <Text style={styles.sectionTitle}>
            💊 Vitamins and Their Purposes
          </Text>

          {fruit.vitamins.map((item, index) => (
            <View style={styles.item} key={index}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>
              <Text style={styles.description}>
                {item.purpose}
              </Text>
            </View>
          ))}

          {fruit.minerals && (
            <>
              <Text style={styles.sectionTitle}>
                🥗 Minerals
              </Text>

              {fruit.minerals.map((item, index) => (
                <View style={styles.item} key={index}>
                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>
                  <Text style={styles.description}>
                    {item.purpose}
                  </Text>
                </View>
              ))}
            </>
          )}

          <Text style={styles.sectionTitle}>
            ❤️ Health Benefits
          </Text>

          {fruit.benefits.map((benefit, index) => (
            <Text style={styles.benefit} key={index}>
              ✓ {benefit}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF9F0",
    padding: 22,
    paddingTop: 65,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E66B47",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 7,
    elevation: 3,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#E66B47",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 9,
  },
  searchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  hint: {
    color: "#888",
    fontSize: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 3,
    marginBottom: 30,
  },
  fruitEmoji: {
    fontSize: 65,
    textAlign: "center",
  },
  fruitName: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#E66B47",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B7043",
    marginTop: 18,
    marginBottom: 12,
  },
  item: {
    backgroundColor: "#F5F9F0",
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3F7543",
  },
  description: {
    color: "#555",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  benefit: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    lineHeight: 21,
  },
});
