import React, { useRef, useEffect } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  View, Text, StyleSheet, Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
  bottomSheetContent: {
    backgroundColor: 'transparent',
    padding: 16, // space between its content and its borderz
    // height:50,

  },
  image: {
    height: '500%',
    width: '30%',
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 7,
    marginHorizontal: 5,
    marginVertical: 8,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',

  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 90,
    paddingRight: 10,
  },
  buttonContainer: {

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
  mainImage: {
    marginLeft: 10,
    marginTop: 5,
    width: '95%',
    height: '50%',
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default function DetailedHotspot({ hotspot, setHotspot }) {
  const sheetRef = useRef(null);

  // const snapPoints = useMemo(() => , []);

  useEffect(() => {
    if (hotspot) {
      sheetRef.current.snapToIndex(0);
    } else {
      sheetRef.current.close();
    }
  }, [hotspot, sheetRef]);

  function ImagesGrid({ images }) {
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
            {row.map((_image, index) => (
              <Image
                key={rowIndex * 3 + index}
                style={styles.image}
                source={{
                  uri: `http://49.13.85.200:8080/static/${hotspot.hotspot_id}/${hotspot.photos?.at(rowIndex * 3 + index)}`,
                }}
              />
            ))}
          </View>
        ))}
        <TouchableOpacity onPress={handleAddPhotoPress}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add photos</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  const addPhotoToMarker = async (markerId) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // If permission is denied, show an alert
      Alert.alert(
        'Permission Denied',
        'Sorry, we need cameraroll permission to upload images.',
      );
    } else {
      try {
        // Launch the image library and get the selected assets
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Photo,
          allowsMultipleSelection: true, // Allow multiple images to be selected
          // allowsEditing: true,
          // aspect: [4, 3],
          quality: 0,
        });

        if (!result.canceled) {
          const selectedAssets = result.assets; // Get the selected assets

          selectedAssets.forEach(async (selectedAsset) => {
            const imageUri = selectedAsset.uri;

            // You can access other properties like width, height, etc., from selectedAsset

            // The rest of your code to upload each image remains the same
            // ...

            const uriArray = imageUri.split('.');
            const fileType = uriArray[uriArray.length - 1];
            const name = imageUri.split('/').at(-1);

            const formData = new FormData();
            formData.append('file', {
              uri: imageUri,
              name,
              type: `image/${fileType}`,
            });

            const response = await fetch(`http://49.13.85.200:8080/hotspots/${markerId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            });

            if (response.status === 200) {
              // Photo added successfully
              // console.log("Photo added to marker with ID", markerId);
            } else {
              console.error('Error adding photo to marker:', response.status);
              // Handle the error as needed
            }
          });
        }
      } catch (error) {
        console.error(error);
        // Handle any errors that occur during the process
      }
    }
  };

  const handleAddPhotoPress = () => {
    addPhotoToMarker(hotspot.hotspot_id);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['29%', '50%', '75%']}
      borderRadius={10}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      onClose={() => setHotspot(null)}

    >
      { hotspot ? (
        <BottomSheetView>
          <Image
            style={styles.mainImage}
            source={{ uri: `http://49.13.85.200:8080/static/${hotspot.hotspot_id}/${hotspot.photos?.at(0)}` }}
          />
          <Text style={{
            textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'rgba(109, 27, 137, 1)',
          }}
          >
            {' '}
            {hotspot?.title}
          </Text>
          <Text style={{ textAlign: 'left', fontSize: 18 }}>
            {' '}
            {hotspot?.description}
          </Text>
          {/* Do not change width of the image, it is perfect */}
          <ImagesGrid images={hotspot?.photos} />
        </BottomSheetView>
      )
        : null }

    </BottomSheet>
  );
}
