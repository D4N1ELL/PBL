import Map from './components/Map';
//import CreatePin from './components/CreatePin'
import { StyleSheet, SafeAreaView } from 'react-native';

//import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DetailedHotspot from './components/DetailedHotspot';

export default function App() {
  const longPressHandler = (event) => {
    console.log(event)
    
    alert(`${event.nativeEvent.coordinate.latitude}, ${event.nativeEvent.coordinate.longitude}`);
  }

  return(
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>

      <Map lph={longPressHandler}/>
      {/* <DetailedHotspot/> */}
      {/* <CreatePin/> */}
    </SafeAreaView>
    
    
  );
}
