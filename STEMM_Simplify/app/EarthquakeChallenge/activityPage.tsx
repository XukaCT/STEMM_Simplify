import { useLocalSearchParams, useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { ArrowLeft, CheckCircle, Play, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EarthquakeStructureActivity() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { startTime } = params;
  const [isSimulating, setIsSimulating] = useState(false);
  const [maxIntensity, setMaxIntensity] = useState(0);
  const [currentAxes, setCurrentAxes] = useState({ x: 0, y: 0, z: 0 });

  // State to hold dynamic array of designs
  const [designs, setDesigns] = useState([
    { id: "1", design: "", predicted: "", actual: "", observations: "" },
  ]);

  // --- SENSOR LOGIC ---
  useEffect(() => {
    let subscription: any;

    if (isSimulating) {
      Accelerometer.setUpdateInterval(50);
      subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        setCurrentAxes({ x, y, z });

        // Calculate peak shake magnitude (subtract 1G for gravity)
        const totalForce = Math.sqrt(x * x + y * y + z * z);
        const shakeIntensity = Math.abs(totalForce - 1);

        setMaxIntensity((prevMax) =>
          shakeIntensity > prevMax ? shakeIntensity : prevMax,
        );
      });
    } else {
      if (subscription) subscription.remove();
      setCurrentAxes({ x: 0, y: 0, z: 0 });
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [isSimulating]);

  const startEarthquake = () => {
    setMaxIntensity(0);
    setIsSimulating(true);

    // Standard earthquake vibration pattern
    const PATTERN = [1000, 1000, 1000, 1000, 1000]; // Vibrate for 1s, pause for 1s, repeat 5 times
    Vibration.vibrate(PATTERN);

    // Stop after the pattern finishes (approx 3.4s)
    setTimeout(() => {
      setIsSimulating(false);
      Vibration.cancel();
    }, 6000);
  };

  // --- FORM LOGIC ---
  const updateDesign = (id: string, field: string, value: string) => {
    setDesigns((currentDesigns) =>
      currentDesigns.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    );
  };

  const addDesign = () => {
    const newId = Date.now().toString(); // Use timestamp to ensure unique IDs
    setDesigns([
      ...designs,
      { id: newId, design: "", predicted: "", actual: "", observations: "" },
    ]);
  };

  // NEW: Remove Design Logic
  const removeDesign = (idToRemove: string) => {
    if (designs.length <= 1) {
      alert("You must have at least one design to test!");
      return;
    }
    setDesigns((currentDesigns) =>
      currentDesigns.filter((d) => d.id !== idToRemove),
    );
  };

  const handleComplete = () => {
    // Navigate to results or home
    router.push({
      pathname: "/EarthquakeChallenge/earthquakeResult",
      params: {
        activityData: JSON.stringify(designs),
        startTime: startTime as string,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earthquake Structure</Text>
        <Text style={styles.headerSubtitle}>Engineering</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sensor Card (Dark) */}
        <View style={styles.sensorCard}>
          <Text style={styles.sensorMainValue}>
            {maxIntensity.toFixed(2)} G
          </Text>
          <Text style={styles.sensorMainLabel}>Peak Shake Intensity</Text>

          <View style={styles.axesRow}>
            <View style={styles.axisBox}>
              <Text style={[styles.axisValue, { color: "#EF4444" }]}>
                {Math.abs(currentAxes.x).toFixed(2)}
              </Text>
              <Text style={styles.axisLabel}>X axis</Text>
            </View>
            <View style={styles.axisBox}>
              <Text style={[styles.axisValue, { color: "#10B981" }]}>
                {Math.abs(currentAxes.y).toFixed(2)}
              </Text>
              <Text style={styles.axisLabel}>Y axis</Text>
            </View>
            <View style={styles.axisBox}>
              <Text style={[styles.axisValue, { color: "#3B82F6" }]}>
                {Math.abs(currentAxes.z).toFixed(2)}
              </Text>
              <Text style={styles.axisLabel}>Z axis</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              isSimulating && styles.startButtonDisabled,
            ]}
            onPress={startEarthquake}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Play
                  size={20}
                  color="#fff"
                  fill="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.startButtonText}>Start Vibration</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Design Forms */}
        {designs.map((item, index) => (
          <View key={item.id} style={styles.designCard}>
            {/* NEW: Header Row with Trash Icon */}
            <View style={styles.designHeader}>
              <Text style={styles.designTitle}>Design {index + 1}</Text>
              {designs.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeDesign(item.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={20} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.inputLabel}>Structure Design</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 4 folds + 4 pillars..."
              value={item.design}
              onChangeText={(val) => updateDesign(item.id, "design", val)}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Predicted Shake</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 0.5 G"
                  value={item.predicted}
                  onChangeText={(val) =>
                    updateDesign(item.id, "predicted", val)
                  }
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Actual Shake</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type sensor peak"
                  keyboardType="numeric"
                  value={item.actual}
                  onChangeText={(val) => updateDesign(item.id, "actual", val)}
                />
              </View>
            </View>

            <View style={styles.observationsContainer}>
              <Text style={styles.inputLabel}>Observations:</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Which design reduced movement the most?"
                multiline
                numberOfLines={3}
                value={item.observations}
                onChangeText={(val) =>
                  updateDesign(item.id, "observations", val)
                }
              />
            </View>
          </View>
        ))}

        {/* Add Design Button */}
        <TouchableOpacity style={styles.addDesignButton} onPress={addDesign}>
          <Text style={styles.addDesignText}>+ Add Design</Text>
        </TouchableOpacity>

        {/* Info Box (Kept Blue) */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Understanding Earthquakes</Text>
          <Text style={styles.infoText}>
            Earthquakes cause ground vibrations that can collapse poorly
            designed structures. Engineers design buildings to absorb and
            distribute energy safely through base isolation, dampers, and
            flexible structures.
          </Text>
          <View style={styles.strategyBox}>
            <Text style={styles.strategyTitle}>Design Strategies:</Text>
            <Text style={styles.strategyText}>
              • More support pillars = better stability
            </Text>
            <Text style={styles.strategyText}>
              • Accordion folds create flexible cushioning
            </Text>
            <Text style={styles.strategyText}>
              • Lower center of mass = less tipping
            </Text>
            <Text style={styles.strategyText}>
              • Wider base = more stable structure
            </Text>
          </View>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <CheckCircle size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.completeButtonText}>Complete Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  header: { padding: 20, backgroundColor: "#000", paddingBottom: 30 },
  backButton: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#999", marginTop: 4 },
  scrollContent: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // Sensor Card
  sensorCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  sensorMainValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  sensorMainLabel: { fontSize: 14, color: "#999", marginBottom: 24 },
  axesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  axisBox: {
    backgroundColor: "#2D2D2D",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  axisValue: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  axisLabel: { fontSize: 12, color: "#888" },

  // CHANGED: Orange Start Button
  startButton: {
    backgroundColor: "#FF5A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
  },
  startButtonDisabled: { backgroundColor: "#FFB088", opacity: 0.9 },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Forms
  designCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },

  // NEW: Design Header to hold Title and Trash Icon
  designHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  designTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  deleteButton: {
    padding: 4,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { flex: 0.48 },
  inputLabel: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 6,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111",
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  observationsContainer: {
    borderWidth: 1,
    borderColor: "#FEF08A",
    backgroundColor: "#FEFCE8",
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    fontSize: 14,
    color: "#111",
    height: 60,
    textAlignVertical: "top",
  },

  addDesignButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  addDesignText: { color: "#374151", fontSize: 14, fontWeight: "bold" },

  // Info Box (Kept Blue)
  infoBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 20,
    marginBottom: 16,
  },
  strategyBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  strategyTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  strategyText: { fontSize: 12, color: "#1E3A8A", marginBottom: 4 },

  // CHANGED: Orange Complete Button
  completeButton: {
    backgroundColor: "#FF5A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  completeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
