import Map from './components/Map';
//import CreatePin from './components/CreatePin'
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';
import { installWebGeolocationPolyfill } from 'expo-location';
import FlashMessage from "react-native-flash-message";



export default function App() {
  installWebGeolocationPolyfill()

  const longPressHandler = (event) => {
    console.log(event)
    
    alert(`${event.nativeEvent.coordinate.latitude}, ${event.nativeEvent.coordinate.longitude}`);
  }
  return(
    <GestureHandlerRootView style={{ ...StyleSheet.absoluteFillObject }}>
      <Map longPressHandler={mapPressHandler}/>
      <CreatePin isOpen={createPinOpen} setIsOpen={setCreatePinOpen} coords={createPinCoords}/>
      <FlashMessage position="bottom"/>
    </GestureHandlerRootView>
        
  );
}
