import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Define what data this map expects to receive from the 7 pages
interface MapProps {
  initialRegion: any;
  tempCoordinate: any;
  onPress: (event: any) => void;
}

export default function UniversalMap({
  initialRegion,
  tempCoordinate,
  onPress,
}: MapProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={onPress}
      >
        {/* Only draw the marker if a coordinate was passed in */}
        {tempCoordinate && (
          <Marker coordinate={tempCoordinate} pinColor="#FF5A00" />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
