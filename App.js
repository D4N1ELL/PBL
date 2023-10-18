import Map from './components/Map';
import CreatePin from './components/CreatePin';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useState } from 'react';
import { installWebGeolocationPolyfill } from 'expo-location';
import FlashMessage from "react-native-flash-message";


export default function App() {
  installWebGeolocationPolyfill()

  const [createPinOpen, setCreatePinOpen] = useState(false)
  const [createPinCoords, setCreatePinCoords] = useState(false)

  const mapPressHandler = (event) => {
      console.log('Long pressed on map')
      setCreatePinOpen(true)
      setCreatePinCoords(event.nativeEvent.coordinate)
  }

  return(
    <GestureHandlerRootView style={{ ...StyleSheet.absoluteFillObject }}>
      <Map longPressHandler={mapPressHandler}/>
      <CreatePin isOpen={createPinOpen} setIsOpen={setCreatePinOpen} coords={createPinCoords}/>
      <FlashMessage position="bottom"/>
    </GestureHandlerRootView>
        
  );
}
