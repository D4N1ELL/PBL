import Map from './components/Map';
//import CreatePin from './components/CreatePin'
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';
import { installWebGeolocationPolyfill } from 'expo-location';



export default function App() {
  installWebGeolocationPolyfill()

  const longPressHandler = (event) => {
    console.log(event)
    
    alert(`${event.nativeEvent.coordinate.latitude}, ${event.nativeEvent.coordinate.longitude}`);
  }
  return(
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
      <Map lph={longPressHandler}/>
      {/* <CreatePin/> */}
    </SafeAreaView>
    
    
  );
}
