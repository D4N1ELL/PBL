import Map from './components/Map';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';
import { installWebGeolocationPolyfill } from 'expo-location';


export default function App() {
  installWebGeolocationPolyfill()

  return(
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}><Map/></SafeAreaView>
  );
    
}