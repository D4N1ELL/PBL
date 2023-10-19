import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet'
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Keyboard, Text, Button, StyleSheet } from 'react-native';
import {launchImageLibrary}from 'react-native-image-picker';

export default function CreatePin(props) {

  const [location, setlocation] = useState('');
  const [description, setdescription] = useState('');
  const sheetRef = useRef(null);

  useEffect(()=>{
    console.log(props.isOpen)
    if (props.isOpen) {
      sheetRef.current.snapToIndex(0)
    } else {
      sheetRef.current.close()
    }
  }, [props.isOpen, sheetRef])

  const requestOptions = { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 

  };

  const createPin = async (body) => {
    // Check the distance between the user's location (props.coords) and the new pin's location (if entered)
    // const distance =
     try { 
         req = {
          ...requestOptions,
          body: JSON.stringify(body) 
         }
         console.log(JSON.stringify(req))
         await fetch("http://49.13.85.200:8080/hotspots", req) 
             .then(response => { 
                console.log(response)
                response.text().then((text)=>{
                  console.log(text)
                })
             }) 
     } 
     catch (error) { 
         console.error(error); 
     } 
 } 

 handleGalleryClick = () => {
  launchImageLibrary(options, (response) => {
   if (response.didCancel) {
     console.log('User cancelled image picker');
   } else if (response.error) {
     console.log('ImagePicker Error: ', response.error);
   } else if (response.customButton) {
     console.log('User tapped custom button: ', response.customButton);
   } else {
     const source = { uri: response.uri };
     this.setState({
       avatarSource: source,
     });
   }
 });
 };
  
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={[326]} 
      borderRadius={10}
      enablePanDownToClose
      keyboardBlurBehavior={"restore"}
      onClose={() => {Keyboard.dismiss(); props.setIsOpen(false)}}
    >
      <View style={styles.bottomSheetContent}>

        <Text style={styles.bottomSheetTitle}>Location*</Text>
        <BottomSheetTextInput
          style={styles.input}
          placeholder="Enter Location "
          value={location}
          onChangeText={setlocation}
        />
        <Text style={styles.bottomSheetTitle}>Description</Text> 
        <BottomSheetTextInput
          style={styles.input}
          placeholder="Enter some Description"
          value={description}
          onChangeText={setdescription}
        />
        <Text style={styles.bottomSheetTitle}>Add Photo*</Text>

        <TouchableOpacity 
        style={styles.panelButton} 
        onPressIn={() => {
          this.handleGalleryClick
          console.log('Choose from library pressed')
          }}>
          <Button title="Choose from library"/>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
          <TouchableOpacity style={styles.cancelButton} onPressIn={() => sheetRef.current.close()}>
            <Text title="Cancel">Cancel</Text>
          </TouchableOpacity> 

          <TouchableOpacity 
            style={styles.createButton} 
            onPressIn={() => {
              console.log(`1: ${location}, 2: ${description}, coords: ${props.coords.latitude}; ${props.coords.longitude}`)
              createPin({
                title: location,
                description: description,
                latitude: props.coords.latitude,
                longitude: props.coords.longitude
              })
              sheetRef.current.close()
              }
            }
          >
            <Text title="Create">Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 16,
    height:326,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  panelButton: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    color: 'white',
  },
  cancelButton: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    color: 'black',
    borderRadius: 5 
  },
  createButton: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    color: 'black',
    borderRadius: 5 
  },
});
