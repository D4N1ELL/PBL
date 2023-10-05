import Map from './components/Map';
import { StyleSheet, View } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function detailedhotspot() {
  return(

      <GestureHandlerRootView style={{flex: 1}}>
        <View style={styles.container}>
        <Map/>
        </View>
        <BottomSheet/>
      </GestureHandlerRootView>

  );
}