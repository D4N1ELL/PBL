import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  View, Keyboard, Text, StyleSheet, Image, Alert,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { manipulateAsync } from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

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
    height: 120,
  },
  cancelButton: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d9d9d9',
    color: 'white',
    borderRadius: 30,
  },
  createButton: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c3ffba',
    color: 'white',
    borderRadius: 30,
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

export default function CreatePin({ isOpen, setIsOpen, coords }) {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const sheetRef = useRef(null);

  const [images, setImages] = useState(null); // Stores the selected image URI
  useEffect(() => {
    if (isOpen) {
      sheetRef.current.snapToIndex(0);
    } else {
      sheetRef.current.close();
      setImages(null);
      setDescription('');
      setLocation('');
    }
  }, [isOpen, sheetRef]);

  // Function to pick an image from the device's media library
  const pickImage = async () => {
    const { status } = await ImagePicker
      .requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // If permission is denied, show an alert
      Alert.alert('Permission Denied', 'Sorry, we need cameraroll permission to upload images.', [
        { text: 'OK' },
        { text: 'Settings', onPress: () => { Linking.openURL('app-settings:'); } },
      ]);
    } else {
      // Launch the image library and get the selected image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Photo,
        allowsMultipleSelection: true,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        // If an image is selected (not cancelled) update the file state variable
        const array = [];
        result.assets.forEach(async (image) => {
          const manipResult = await manipulateAsync(
            image.uri,
            [{ resize: { width: 640, height: 480 } }],
            { format: 'jpeg' },
          );
          array.push(manipResult.uri);
        });
        setImages(array);
      }
    }
  };

  const createPin = async (body) => {
    if ((body.title === 'Empty title' && images == null) || images == null || body.title === 'Empty title') {
      return (
      // console.log('Unable to create pin error'),
        Alert.alert('Unable to create pin', 'Check Location and Add photo fields', [
          {
            text: 'OK',
          },
        ])
      );
    }
    try {
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await AsyncStorage.getItem('jwtToken')}` },
        body: JSON.stringify(body),
      };
      let response = await fetch('http://49.13.85.200:8080/hotspots', req);
      const id = await response.text();

      // console.log("id", id)
      // console.log(images)

      images.forEach(async (image) => {
        const uriArray = image.split('.');
        const fileType = uriArray[uriArray.length - 1];
        const name = image.split('/').at(-1);
        // console.log(name)
        const formData = new FormData();
        formData.append('file', {
          uri: image,
          name: `${name}`,
          type: `image/${fileType}`,
        });
        response = await fetch(`http://49.13.85.200:8080/hotspots/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${await AsyncStorage.getItem('jwtToken')}`,
          },
          body: formData,
        });
        if (!response.ok) {
          showMessage({
            message: 'Failed to create pin',
            type: 'warning',
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={[500]}
      borderRadius={10}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      onClose={() => {
        Keyboard.dismiss();
        setIsOpen(false);
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

        <View>
          <ScrollView style={styles.scrollView} horizontal>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPressIn={() => {
                pickImage();
              }}
            >
              <Icon name="plus" size={30} color="#000" />
            </TouchableOpacity>
            <View style={styles.addPhotoScroll}>
              {images?.map((image) => (
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, justifyContent: 'space-around' }}
                  key={image}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

          <TouchableOpacity style={styles.cancelButton} onPressIn={() => sheetRef.current.close()}>
            <Text title="Cancel">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createButton}
            onPressIn={() => {
              createPin({
                title: location,
                description,
                latitude: coords.latitude,
                longitude: coords.longitude,
              });
              sheetRef.current.close();
            }}
          >
            <Text title="Create">Create</Text>
          </TouchableOpacity>
        </View>

      </View>
    </BottomSheet>
  );
}
