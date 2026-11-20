
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

// CHANGE THIS TO YOUR COMPUTER'S IPv4 ADDRESS
const API_URL = "http://192.168.1.10:8000";

const COLORS = [
  { name: "Black", hex: "#222222" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Red", hex: "#E63946" },
  { name: "Pink", hex: "#E8A0BF" },
  { name: "Orange", hex: "#F4A261" },
  { name: "Yellow", hex: "#F6D365" },
  { name: "Green", hex: "#5B9A68" },
  { name: "Blue", hex: "#457B9D" },
  { name: "Navy", hex: "#253858" },
  { name: "Purple", hex: "#9673B9" },
  { name: "Brown", hex: "#8B5E3C" },
  { name: "Beige", hex: "#DCC9A5" },
  { name: "Cream", hex: "#F5E6CC" },
];

const MATCHES = {
  Black: ["White", "Beige", "Gray", "Pink", "Cream"],
  White: ["Black", "Blue", "Beige", "Brown", "Green"],
  Gray: ["Black", "White", "Pink", "Navy", "Purple"],
  Red: ["White", "Black", "Beige", "Navy", "Gray"],
  Pink: ["White", "Gray", "Brown", "Cream", "Navy"],
  Orange: ["White", "Brown", "Beige", "Navy", "Cream"],
  Yellow: ["White", "Gray", "Navy", "Brown", "Black"],
  Green: ["Beige", "White", "Brown", "Cream", "Black"],
  Blue: ["White", "Beige", "Gray", "Brown", "Cream"],
  Navy: ["White", "Beige", "Gray", "Pink", "Brown"],
  Purple: ["White", "Gray", "Black", "Pink", "Cream"],
  Brown: ["Beige", "Cream", "White", "Blue", "Pink"],
  Beige: ["White", "Brown", "Black", "Green", "Blue"],
  Cream: ["Brown", "Navy", "Green", "Pink", "Black"],
};

const SLOTS = ["Shirt", "Pants", "Shoes", "Accessories"];

export default function App() {
  const [screen, setScreen] = useState("home");

  const [selectedSlot, setSelectedSlot] = useState("Shirt");

  const [outfit, setOutfit] = useState({
    Shirt: null,
    Pants: null,
    Shoes: null,
    Accessories: null,
  });

  const [photo, setPhoto] = useState(null);

  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState([]);

  const [detectedColor, setDetectedColor] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  // LOAD SAVED OUTFITS
  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        "colorfit_favorites"
      );

      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // SAVE OUTFIT
  const saveOutfit = async () => {
    if (!outfit.Shirt) {
      Alert.alert(
        "Missing Color",
        "Please select a shirt color first."
      );
      return;
    }

    const newFavorites = [
      ...favorites,
      {
        id: Date.now().toString(),
        ...outfit,
      },
    ];

    try {
      await AsyncStorage.setItem(
        "colorfit_favorites",
        JSON.stringify(newFavorites)
      );

      setFavorites(newFavorites);

      Alert.alert("Saved!", "Your outfit was saved.");
    } catch (error) {
      Alert.alert("Error", "Unable to save outfit.");
    }
  };

  // DELETE FAVORITE
  const deleteFavorite = async (id) => {
    const updated = favorites.filter(
      (item) => item.id !== id
    );

    setFavorites(updated);

    await AsyncStorage.setItem(
      "colorfit_favorites",
      JSON.stringify(updated)
    );
  };

  // UPDATE SELECTED COLOR
  const chooseColor = (color) => {
    setOutfit((previous) => ({
      ...previous,
      [selectedSlot]: color,
    }));
  };

  // CAMERA
  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
      setDetectedColor(null);
    }
  };

  // GALLERY
  const pickPhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
      setDetectedColor(null);
    }
  };

  // DETECT DOMINANT COLOR
  const detectColor = async () => {
    if (!photo) {
      Alert.alert("No Picture", "Please upload a clothing picture.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", {
        uri: photo.uri,
        name: "clothing.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(
        `${API_URL}/detect-color`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Detection failed");
      }

      const color = {
        name: data.color_name,
        hex: data.hex,
      };

      setDetectedColor(color);

      setOutfit((previous) => ({
        ...previous,
        [selectedSlot]: color,
      }));

      Alert.alert(
        "Color Detected!",
        `${color.name} has been added to your ${selectedSlot}.`
      );

    } catch (error) {
      Alert.alert(
        "Detection Error",
        "Check your internet connection and Python server."
      );
    } finally {
      setLoading(false);
    }
  };

  // COLOR PALETTE FOR THE SELECTED SHIRT
  const getRecommendations = () => {
    if (!outfit.Shirt) return [];

    const names = MATCHES[outfit.Shirt.name] || [];

    return names.map((name) =>
      COLORS.find((color) => color.name === name)
    ).filter(Boolean);
  };

  // RECOMMENDATION SCREEN
  const recommendations = getRecommendations();

  // HOME SCREEN
  const HomeScreen = () => (
    <View style={styles.content}>
      <Text style={styles.logo}>ColorFit ✨</Text>

      <Text style={styles.tagline}>
        Find Your Colors. Match Your Style.
      </Text>

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>👗</Text>

        <Text style={styles.heroTitle}>
          Create Your Perfect Outfit
        </Text>

        <Text style={styles.heroDescription}>
          Discover beautiful clothing color combinations
          and create outfits that match your style.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setScreen("matcher")}
        >
          <Text style={styles.buttonText}>
            Start Matching →
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => setScreen("favorites")}
      >
        <Text style={styles.menuTitle}>
          ❤️ My Favorite Outfits
        </Text>
        <Text style={styles.muted}>
          View your saved color combinations
        </Text>
      </TouchableOpacity>
    </View>
  );

  // MATCHER SCREEN
  const MatcherScreen = () => (
    <View style={styles.content}>
      <Text style={styles.heading}>
        Outfit Color Matcher
      </Text>

      <Text style={styles.muted}>
        Select a clothing item to choose its color.
      </Text>

      <Text style={styles.sectionTitle}>
        1. Choose Clothing Item
      </Text>

      <View style={styles.slotContainer}>
        {SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.slotButton,
              selectedSlot === slot && styles.activeSlot,
            ]}
            onPress={() => setSelectedSlot(slot)}
          >
            <Text
              style={[
                styles.slotText,
                selectedSlot === slot && styles.activeSlotText,
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.selectedColor}>
        <Text style={styles.sectionTitle}>
          2. Select a Color
        </Text>

        <View style={styles.colorGrid}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color.name}
              style={styles.colorItem}
              onPress={() => chooseColor(color)}
            >
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: color.hex },
                  outfit[selectedSlot]?.name === color.name &&
                    styles.selectedCircle,
                ]}
              />

              <Text style={styles.colorName}>
                {color.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        3. Upload Clothing Picture
      </Text>

      <View style={styles.uploadButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={takePhoto}
        >
          <Text style={styles.secondaryText}>
            📷 Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={pickPhoto}
        >
          <Text style={styles.secondaryText}>
            🖼 Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {photo && (
        <View style={styles.photoBox}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.photo}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={detectColor}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Detect Clothing Color
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {detectedColor && (
        <View style={styles.detectedBox}>
          <Text style={styles.sectionTitle}>
            Detected Color
          </Text>

          <View
            style={[
              styles.colorCircle,
              {
                backgroundColor: detectedColor.hex,
                width: 55,
                height: 55,
              },
            ]}
          />

          <Text style={styles.colorName}>
            {detectedColor.name}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        4. Your Outfit
      </Text>

      {SLOTS.map((slot) => (
        <View style={styles.outfitRow} key={slot}>
          <Text style={styles.outfitLabel}>
            {slot}
          </Text>

          <View
            style={[
              styles.smallColor,
              {
                backgroundColor:
                  outfit[slot]?.hex || "#EAEAEA",
              },
            ]}
          />

          <Text style={styles.outfitValue}>
            {outfit[slot]?.name || "Not selected"}
          </Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>
        5. Recommended Matching Colors
      </Text>

      <View style={styles.colorGrid}>
        {recommendations.map((color) => (
          <TouchableOpacity
            key={color.name}
            style={styles.colorItem}
            onPress={() => {
              setSelectedSlot("Pants");
              chooseColor(color);
            }}
          >
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: color.hex },
              ]}
            />
            <Text style={styles.colorName}>
              {color.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={saveOutfit}
      >
        <Text style={styles.buttonText}>
          ❤️ Save My Outfit
        </Text>
      </TouchableOpacity>
    </View>
  );

  // FAVORITES SCREEN
  const FavoritesScreen = () => (
    <View style={styles.content}>
      <Text style={styles.heading}>
        My Favorite Outfits ❤️
      </Text>

      {favorites.length === 0 ? (
        <Text style={styles.muted}>
          You have not saved any outfits yet.
        </Text>
      ) : (
        favorites.map((item) => (
          <View style={styles.favoriteCard} key={item.id}>
            {SLOTS.map((slot) => (
              <View style={styles.outfitRow} key={slot}>
                <Text style={styles.outfitLabel}>
                  {slot}
                </Text>

                <View
                  style={[
                    styles.smallColor,
                    {
                      backgroundColor:
                        item[slot]?.hex || "#EAEAEA",
                    },
                  ]}
                />

                <Text style={styles.outfitValue}>
                  {item[slot]?.name || "Not selected"}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => deleteFavorite(item.id)}
            >
              <Text style={styles.deleteText}>
                Delete Outfit
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {screen === "home" && <HomeScreen />}
        {screen === "matcher" && <MatcherScreen />}
        {screen === "favorites" && <FavoritesScreen />}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setScreen("home")}>
          <Text style={styles.navText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen("matcher")}>
          <Text style={styles.navText}>🎨 Matcher</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen("favorites")}>
          <Text style={styles.navText}>❤️ Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F5",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 25,
  },

  content: {
    padding: 22,
    paddingTop: 60,
  },

  logo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#B76E79",
    textAlign: "center",
  },

  tagline: {
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  hero: {
    backgroundColor: "#F4E2E5",
    padding: 25,
    borderRadius: 22,
    alignItems: "center",
  },

  heroEmoji: {
    fontSize: 75,
    marginBottom: 15,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#794B56",
    textAlign: "center",
  },

  heroDescription: {
    color: "#777",
    textAlign: "center",
    lineHeight: 23,
    marginVertical: 15,
  },

  primaryButton: {
    backgroundColor: "#B76E79",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  menuCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 2,
  },

  menuTitle: {
    color: "#794B56",
    fontSize: 17,
    fontWeight: "bold",
  },

  muted: {
    color: "#888",
    marginTop: 8,
    lineHeight: 21,
  },

  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#794B56",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#794B56",
    marginTop: 25,
    marginBottom: 15,
  },

  slotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  slotButton: {
    backgroundColor: "#F0E7E5",
    padding: 12,
    borderRadius: 10,
  },

  activeSlot: {
    backgroundColor: "#B76E79",
  },

  slotText: {
    color: "#794B56",
    fontWeight: "600",
  },

  activeSlotText: {
    color: "#fff",
  },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 17,
  },

  colorItem: {
    alignItems: "center",
    width: 65,
    marginBottom: 8,
  },

  colorCircle: {
    width: 42,
    height: 42,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  selectedCircle: {
    borderWidth: 4,
    borderColor: "#B76E79",
  },

  colorName: {
    fontSize: 12,
    color: "#555",
    marginTop: 7,
  },

  uploadButtons: {
    flexDirection: "row",
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#F0E1E3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryText: {
    color: "#794B56",
    fontWeight: "bold",
  },

  photoBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginTop: 18,
  },

  photo: {
    width: "100%",
    height: 230,
    resizeMode: "contain",
    borderRadius: 10,
  },

  detectedBox: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  outfitRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
  },

  outfitLabel: {
    width: 105,
    color: "#794B56",
    fontWeight: "bold",
  },

  smallColor: {
    width: 28,
    height: 28,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  outfitValue: {
    marginLeft: 12,
    color: "#555",
    flex: 1,
  },

  favoriteCard: {
    backgroundColor: "#F4E2E5",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },

  deleteText: {
    color: "#D04444",
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 12,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  navText: {
    color: "#794B56",
    fontWeight: "bold",
    fontSize: 13,
  },
});
