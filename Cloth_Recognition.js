
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select an image from the gallery
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow gallery access.");
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!response.canceled) {
      setImage(response.assets[0]);
      setResult(null);
    }
  };

  // Take a picture using the camera
  const takePicture = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow camera access.");
      return;
    }

    const response = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!response.canceled) {
      setImage(response.assets[0]);
      setResult(null);
    }
  };

  // Send image to the AI recognition backend
  const identifyClothing = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a picture first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("image", {
        uri: image.uri,
        name: "clothing.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(
        "http://YOUR_COMPUTER_IP:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Recognition failed.");
      }

      const data = await response.json();
      setResult(data);

    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to identify clothing. Check your server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>ClothAI</Text>
      <Text style={styles.subtitle}>
        AI Clothing Recognition System
      </Text>

      <View style={styles.uploadBox}>
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={styles.preview}
          />
        ) : (
          <Text style={styles.placeholder}>
            Select or take a picture of an outfit
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>📷 Take a Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.galleryButton}
        onPress={pickImage}
      >
        <Text style={styles.galleryText}>🖼 Choose from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.identifyButton}
        onPress={identifyClothing}
        disabled={loading || !image}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Identify Clothing
          </Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>
            Recognition Result
          </Text>

          <Text style={styles.resultLabel}>
            Clothing Type:
          </Text>
          <Text style={styles.resultValue}>
            {result.label}
          </Text>

          <Text style={styles.resultLabel}>
            Confidence:
          </Text>
          <Text style={styles.resultValue}>
            {result.confidence}%
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F4FA",
    alignItems: "center",
    padding: 25,
    paddingTop: 65,
  },
  logo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#803A9B",
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    marginBottom: 30,
  },
  uploadBox: {
    width: "100%",
    height: 280,
    backgroundColor: "#EDE5F2",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  placeholder: {
    color: "#777",
    textAlign: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#803A9B",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  galleryButton: {
    backgroundColor: "#E4D3EC",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  galleryText: {
    color: "#65347A",
    fontWeight: "bold",
  },
  identifyButton: {
    backgroundColor: "#392044",
    width: "100%",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 15,
    marginTop: 25,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#803A9B",
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
  },
  resultValue: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#392044",
  },
});