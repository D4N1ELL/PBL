import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, Button, StyleSheet} from 'react-native'; 
import MapView, { Marker } from 'react-native-maps';

export default function DetailedHotspot(props) {

  const sheetRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  
  useEffect(()=>{
    console.log(props.hotspot)
    if (props.hotspot) {
      sheetRef.current.snapToIndex(0)
    } else {
      sheetRef.current.close()
    }
  }, [props.hotspot, sheetRef])
  

  return (
    <View style = {styles.bottomSheetContent}>
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      borderRadius={10}
      enablePanDownToClose
      keyboardBlurBehavior={"restore"}
      onClose={()=>props.setHotspot(null)}
   
    >
      <BottomSheetView>
      <Text>Awesome 🔥 {props.hotspot?.title}</Text>
      </BottomSheetView>
      
    
        {/* <Button title="Test Button" onPress={() => console.log("Test button pressed")} /> */}
        </BottomSheet>
      </View>
  );};
  
  const styles = StyleSheet.create({
    bottomSheetContent: {
      backgroundColor: 'white',
      padding: 16,  //space between its content and its border
      height:200,
    },
    itemContainer:{
      padding: 6,
      margin: 6,
      backgroundColor: "#eee",
    }
  })
  ;