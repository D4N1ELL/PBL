import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import useNetInfo from "@react-native-community/netinfo"; 
import { render } from 'react-dom';


export default function App() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    // Fetch the hotspot data
    fetch("http://49.13.85.200:8080/hotspots")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseJson) => {
        setHotspots(responseJson);
      })
      .catch((error) => {
        console.error(error);
        // Handle the error (e.g., show an error message)
      });
  }, []);

  return (
    <MapView provider={PROVIDER_GOOGLE} style={{ ...StyleSheet.absoluteFillObject }}>
      {/* Map over the hotspots array and create a marker for each hotspot */}
      {hotspots.map((hotspot) => (
        <Marker
          key={hotspot.hotspot_id}
          coordinate={{
            latitude: hotspot.latitude,
            longitude: hotspot.longitude,
          }}
          title={hotspot.title}
          description={hotspot.description}
        />
      ))}
    </MapView>
  );
}



//React native styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
