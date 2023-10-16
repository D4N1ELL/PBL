import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet'
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Keyboard, Text, Button, StyleSheet } from 'react-native';

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

  const postExample = async (body) => { 
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
  
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={[326]} 
      borderRadius={10}
      enablePanDownToClose
      keyboardBlurBehavior={"restore"}
      onClose={Keyboard.dismiss}
    >
      <View style={styles.bottomSheetContent}>

        <Text style={styles.bottomSheetTitle}>Location</Text>
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
        <Text style={styles.bottomSheetTitle}>Add Photo</Text>

        <TouchableOpacity style={styles.panelButton} onPressIn={() => console.log('Choose from library pressed')}>
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
              postExample({
                title: location,
                description: description,
                latitude: props.coords.latitude,
                longitude: props.coords.longitude
              })
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
  },
  createButton: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    color: 'black',
  },
});
