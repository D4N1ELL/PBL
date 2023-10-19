import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, Button, StyleSheet, Image} from 'react-native'; 
import MapView, { Marker } from 'react-native-maps';

export default function DetailedHotspot(props) {

  const sheetRef = useRef(null);

  // const snapPoints = useMemo(() => , []);
  
  useEffect(()=>{
    console.log(props.hotspot)
    if (props.hotspot) {
      sheetRef.current.snapToIndex(0)
    } else {
      sheetRef.current.close()
    }
  }, [props.hotspot, sheetRef])
  
  

  return ( 
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['25%', '50%', '75%']}
      borderRadius={10}
      enablePanDownToClose
      keyboardBlurBehavior={"restore"}
      onClose={()=>props.setHotspot(null)}
   
    > 
    { props.hotspot ? <BottomSheetView>
      <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'rgba(109, 27, 137, 1)' }}> {props.hotspot?.title}</Text>
      <Text style={{ textAlign: 'left', fontSize: 18 }}> {props.hotspot?.description}</Text>
      {/*Do not change width of the image, it is perfect*/}
      <Image
                        marginLeft={10}
                        marginTop={10}
                        width = '30%'
                        height={80}
                        borderRadius={15}
                        overflow="hidden"
                        source={{uri: `http://49.13.85.200:8080/static/${props.hotspot.hotspot_id}/${props.hotspot.photos?.at(0)}`}}
                    />
                    
                    </BottomSheetView>
    : null }
      
    
        {/* <Button title="Test Button" onPress={() => console.log("Test button pressed")} /> */}
        </BottomSheet>
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