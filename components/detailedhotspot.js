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
  
  const ImagesGrid = ({ images }) => {
    if (!images || images.length === 0) {
      return null; // Return null or some other suitable content when no images are available.
    }
  
    const columns = 3; // Number of images per row
    const rows = Math.ceil(images.length / columns);
    const rowsArray = [];
    for (let i = 0; i < rows; i++) {
      const rowImages = images.slice(i * columns, (i + 1) * columns);
      rowsArray.push(rowImages);
    }
  
    return (
      <View style={styles.container}>
        {rowsArray.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((image, index) => (
              <Image
                key={index}
                style={styles.image}
                source={{
                  uri: `http://49.13.85.200:8080/static/${props.hotspot.hotspot_id}/${props.hotspot.photos?.at(index)}`,
                }}
              />
            ))}
          </View>
        ))}
        <TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Add photos</Text>
        </View>
        </TouchableOpacity>
      </View>
    );
  };
  

  return ( 
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['29%', '50%', '75%']}
      borderRadius={10}
      enablePanDownToClose
      keyboardBlurBehavior={"restore"}
      onClose={()=>props.setHotspot(null)}
   
    > 
    { props.hotspot ? <BottomSheetView>
      <Image
        style={styles.mainImage}
        source={{uri: `http://49.13.85.200:8080/static/${props.hotspot.hotspot_id}/${props.hotspot.photos?.at(0)}`}} 
        />
      <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'rgba(109, 27, 137, 1)' }}> {props.hotspot?.title}</Text>
      <Text style={{ textAlign: 'left', fontSize: 18 }}> {props.hotspot?.description}</Text>
      {/*Do not change width of the image, it is perfect*/}
      <ImagesGrid images={props.hotspot?.photos} />
      </BottomSheetView>
    : null }
            
        </BottomSheet>
  );};
  
  const styles = StyleSheet.create({
    bottomSheetContent: {
      backgroundColor: 'transparent',
      padding: 16,  //space between its content and its borderz
      //height:50,
      
    },
    image: {
      height: '500%',
      width: '30%',
      marginTop: 10,
      borderRadius: 7,
      marginHorizontal: 5,
      marginVertical: 8,
    },
    itemContainer:{
      padding: 6,
      margin: 6,
      backgroundColor: "#eee",
      
    },
    container: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 90,
    },
    buttonContainer:{
      
      flexDirection: 'column',
      height: 50,
      marginHorizontal: 10,
      backgroundColor: 'rgba(0,255, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
    },
    buttonText: {
      color: 'rgba(0,0,0,0.9)',
      fontSize: 20,
    },
    mainImage:{
      marginLeft: 10,
      marginTop: 5,
      width: '95%',
      height: '50%',
      borderRadius: 15,
      overflow: "hidden",
    },


  })
  ;