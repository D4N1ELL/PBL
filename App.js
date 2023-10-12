import Map from './components/Map';
import CreatePin from './components/CreatePin';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [createPinOpen, setCreatePinOpen] = useState(false)
  const [createPinCoords, setCreatePinCoords] = useState(false)

  const mapPressHandler = (event) => {
      console.log('Long pressed on map')
      setCreatePinOpen(true)
      setCreatePinCoords(event.nativeEvent.coordinate)
  }
  return(
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
      <Map longPressHandler={mapPressHandler}/>
      <CreatePin isOpen={createPinOpen} setIsOpen={setCreatePinOpen} coords={createPinCoords}/>
    </SafeAreaView>
        
  );
}
