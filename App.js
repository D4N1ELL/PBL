import Map from './components/Map';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';


export default function App() {
  return(
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}><Map/></SafeAreaView>
  );
    
}

