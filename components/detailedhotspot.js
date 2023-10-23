import React, { useRef, useEffect} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Image} from 'react-native'; 

export default function DetailedHotspot(props) {

  const sheetRef = useRef(null);

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
      snapPoints={['30%', '50%', '75%']}
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
      
      <View >
        <Text style={styles.hotspotTitle}>          
          {props.hotspot?.title}
        </Text>

        <Text style={styles.hotspotDescription}>
          {props.hotspot?.description}
        </Text>

        <View style={styles.imageContainer}>
          <View style = {{flexdirection: 'row'}}> 
          {props.hotspot?.photos?.map((item, index) => ( //returning jsx with ()
          
          // load all pictures on the location
          <Image 
          key={index}
          style={styles.image}
          source={{uri: `http://49.13.85.200:8080/static/${props.hotspot.hotspot_id}/${props.hotspot.photos}`}}
          />
          ))}
         </View>
       </View>
        
         <View style={styles.bottomSheetContent}>
          {/* onPress to open creating pin */}
          <TouchableOpacity >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add photos</Text>
          </View>
          </TouchableOpacity>
          </View>
      </View>

        </BottomSheetView>
    : null }
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
    },
    mainImage:{
      marginLeft: 11,
      marginTop: 5,
      width: 390,
      height: 161,
      borderRadius: 15,
      overflow: "hidden",
    },
    hotspotTitle:{
      marginLeft: 10,
      marginTop: 5,
      fontSize: 20,
      color: 'rgba(109, 27, 137, 1)',
      
    },
    hotspotDescription:{
      marginLeft: 10,
      marginTop: 5,
      fontSize: 15,
      color: 'rgba(0,0,0,0.9)',
    },
    imageContainer:{
      marginVertical: 20,
      width: '100%',
      backgroundColor: '#D9D9D9',
    },
    image:{
      height: 120,
      width: 120,
      marginTop: 10,
      borderRadius: 7,
      marginHorizontal: 10,
      marginVertical: 8,
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
    }
  });