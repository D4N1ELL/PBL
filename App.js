import Map from './components/Map';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return(
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
      <Map/>
      <detailedhotspot/>
    </SafeAreaView>
  );
}
