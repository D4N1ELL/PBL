import Map from './components/Map';
import CreatePin from './components/CreatePin';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useState } from 'react';
import { installWebGeolocationPolyfill } from 'expo-location';
import DetailedHotspot from './components/DetailedHotspot';


export default function App() {
  installWebGeolocationPolyfill()

  const [createPinOpen, setCreatePinOpen] = useState(false)
  const [createPinCoords, setCreatePinCoords] = useState(false)

  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const mapPressHandler = (event) => {
      console.log('Long pressed on map')
      setCreatePinOpen(true)
      setCreatePinCoords(event.nativeEvent.coordinate)
  }
  const markerPressHandler = (hotspot) => (event) => {
    console.log('Pressed on marker')
    setSelectedHotspot(hotspot)
}

  return(
    <GestureHandlerRootView style={{ ...StyleSheet.absoluteFillObject }}>
      <Map longPressHandler={mapPressHandler}
           onMarkerPress={markerPressHandler} />
           
      <CreatePin isOpen={createPinOpen} setIsOpen={setCreatePinOpen} coords={createPinCoords}/>

      <DetailedHotspot
      hotspot={selectedHotspot} setHotspot={setSelectedHotspot}/>
    </GestureHandlerRootView>
        
  );
}
