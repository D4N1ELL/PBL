import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import useNetInfo from "@react-native-community/netinfo"; 
import { render } from 'react-dom';


// useEffect(() => {
//   Alert.alert('Connection lost', 'Could not connect to a network, please try again', [
//     {
//       text: 'Retry',
//       onPress: () => console.log('Retry Pressed'),
//       style: 'retry',
//     },
//     {
//       text: 'OK', 
//       onPress: () => console.log('OK Pressed')
//     },
//   ]);
// }, [state.isConnected]);


export default function App() {
  //const netInfo = useNetInfo();  
  return(
    
      <MapView provider={PROVIDER_GOOGLE} style={{ ...StyleSheet.absoluteFillObject }}>
      </MapView>
  

  );
    
}

//React native styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
