import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import { installWebGeolocationPolyfill } from 'expo-location';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailedHotspot from './DetailedHotspot';
import CreatePin from './CreatePin';
import Map from './Map';

export default function RenderMap() {
  console.disableYellowBox = true;
  console.reportErrorAsException = false;
  installWebGeolocationPolyfill();

  const [createPinOpen, setCreatePinOpen] = useState(false);
  const [createPinCoords, setCreatePinCoords] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const checkDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula
    const earthRadius = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180))
          * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };
  const mapPressHandler = async (event) => {
    event.persist();
    if (await AsyncStorage.getItem('jwtToken') == null) {
      showMessage({
        message: 'Not logged in',
        type: 'warning',
      });
      setCreatePinOpen(false);
      return;
    }
    const coords = event.nativeEvent.coordinate;
    const ok = hotspots.every((hotspot) => (
      checkDistance(coords.latitude, coords.longitude, hotspot.latitude, hotspot.longitude) > 100
    ));
    if (ok) {
      setCreatePinOpen(true);
      setCreatePinCoords(coords);
    } else {
      showMessage({
        message: 'Too close to existing hotspot',
        type: 'warning',
      });
    }
  };

  const markerPressHandler = (hotspot) => () => {
    setSelectedHotspot(hotspot);
  };
  return (
    <GestureHandlerRootView style={{ ...StyleSheet.absoluteFillObject }}>
      <Map
        longPressHandler={mapPressHandler}
        onMarkerPress={markerPressHandler}
        hotspots={hotspots}
        setHotspots={setHotspots}
      />
      <CreatePin isOpen={createPinOpen} setIsOpen={setCreatePinOpen} coords={createPinCoords} />
      <DetailedHotspot
        hotspot={selectedHotspot}
        setHotspot={setSelectedHotspot}
      />
      <FlashMessage position="bottom" />
    </GestureHandlerRootView>
  );
}
