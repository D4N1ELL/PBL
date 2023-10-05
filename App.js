import Map from './components/Map';
//import CreatePin from './components/CreatePin'
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';

<Modal
  animated
  animationType="fade"
  visible={this.props.visible}
  transparent
  onRequestClose={() => this._handleDismiss()}>
  <View style={styles.overlay}>
    ...
  </View>
</Modal>

export default function App() {
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
