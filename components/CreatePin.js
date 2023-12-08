import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet'
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { View, Keyboard, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { manipulateAsync } from 'expo-image-manipulator';
import { Linking } from 'react-native';

export default function CreatePin(props) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDE4NjQxMDYsImlhdCI6MTcwMTg2MDUwNiwic3ViIjoiMSJ9.L_m0Ii7tYG0ZCCeZxF8yCbTFJVYKjbKMVJilLPt2G40"   

    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const sheetRef = useRef(null);

    const [images, setImages] = useState(null); // Stores the selected image URI   
    const [error, setError] = useState(null); // Stores any error message 

    useEffect(()=>{
        if (props.isOpen) {
        sheetRef.current.snapToIndex(0)
        } else {
        sheetRef.current.close()
        setImages(null)
        setDescription("")
        setLocation("")
        }
    }, [props.isOpen, sheetRef])

    const createPinRequestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Authorization": `Bearer ${token}`},
    };

    // Function to pick an image from the device's media library 
    const pickImage = async () => { 
        const { status } = await ImagePicker. 
            requestMediaLibraryPermissionsAsync(); 

        if (status !== "granted") { 

          // If permission is denied, show an alert
            Alert.alert("Permission Denied", `Sorry, we need cameraroll permission to upload images.`, [
                {text: 'OK'},
                {text: 'Settings', onPress: () => { Linking.openURL('app-settings:') }},
            ])
             
        } else { 

            // Launch the image library and get the selected image 
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Photo,
                allowsMultipleSelection: true,
                // allowsEditing: true,
                //aspect: [4, 3],
                quality: 0.5,
            });
        
            if (!result.canceled) { 
                // If an image is selected (not cancelled) update the file state variable 
                array = []
                result.assets.forEach(async image => {
                    const manipResult = await manipulateAsync(
                        image.uri,
                        [{ resize: { width: 640, height: 480 } }],
                        { format: "jpeg" }
                    );
                    array.push(manipResult.uri)
                })
                // Clear any previous errors 
                setImages(array);
                setError(null); 
            } 
        } 
    }; 

    const createPin = async (body) => {
        if ((body.title == "Empty title" && images == null) || images == null || body.title == "Empty title") {
            return (
                //console.log('Unable to create pin error'),
                Alert.alert('Unable to create pin', 'Check Location and Add photo fields', [
                    {
                      text: 'OK'
                    },
                ])
            )
        } else {
            try {
                let req = {
                ...createPinRequestOptions,
                    body: JSON.stringify(body) 
                }
                //console.log(JSON.stringify(req))
                response = await fetch("http://49.13.85.200:8080/hotspots", req)
                id = await response.text()

                //console.log("id", id)
                //console.log(images)

                for (let image of images) {
                    let uriArray = image.split(".");
                    let fileType = uriArray[uriArray.length - 1];
                    let name = image.split('/').at(-1)
                    //console.log(name)
                    const formData  = new FormData();
                    formData.append("file", {
                        uri: image,
                        name: `${name}`,
                        type: `image/${fileType}`,
                    })
                    response = await fetch(`http://49.13.85.200:8080/hotspots/${id}`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}`
                        },
                        body: formData
                    });
                    console.log(JSON.stringify(response))
                }
            } catch (error) {
                console.error(error);
            }
                
        }
        
    }


    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={[500]}
            borderRadius={10}
            enablePanDownToClose
            keyboardBlurBehavior={"restore"}
            onClose={() => {
                Keyboard.dismiss();
                props.setIsOpen(false)
            }}
        >
            <View style={styles.bottomSheetContent}>

                <Text style={styles.bottomSheetTitle}>Location*</Text>

                <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Enter Location "
                    value={location}
                    onChangeText={setLocation}
                />
                <Text style={styles.bottomSheetTitle}>Description</Text>

                <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Enter some Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <Text style={styles.bottomSheetTitle}>Add Photo*</Text>

                <View >
                    <ScrollView style={styles.scrollView} horizontal = {true}>
                            <TouchableOpacity
                                style={styles.addPhotoButton}
                                onPressIn={() => {
                                    pickImage()
                                }}>
                                <Icon name="plus" size={30} color="#000"/>
                            </TouchableOpacity>
                            <View style={styles.addPhotoScroll}>
                                {images?.map((image)=><Image source={{ uri: image }} 
                                style={{width: 100, height: 100, justifyContent: 'space-around',}}
                                key={image}/>)}
                            </View>
                    </ScrollView>
                </View>
                
                
                
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    
                    <TouchableOpacity style={styles.cancelButton} onPressIn={() => sheetRef.current.close()}>
                        <Text title="Cancel">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPressIn={() => {
                            //console.log(`1: ${location}, 2: ${description}, coords: ${props.coords.latitude}; ${props.coords.longitude}`)
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
        height: 326,
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
    addPhotoButton: {
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'skyblue',
        color: 'black',
        width: 100, 
        height: 120
    },
    cancelButton: {
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d9d9d9',
        color: 'white',
        borderRadius: 30
    },
    createButton: {
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c3ffba',
        color: 'white',
        borderRadius: 30
    },
    scrollView: {
        backgroundColor: 'lightgrey',
        marginBottom: 10,
        height: 120,
    },
    addPhotoScroll: {
        flexDirection: 'row',
        // 
        alignItems: 'center',
    },
    
});
