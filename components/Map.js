import { StyleSheet , Text, View,Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE , Callout} from 'react-native-maps';
import { WebView } from 'react-native-webview';

export default function Map(props) {
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  useEffect(() => {
    // Fetch the hotspot data
    fetch("http://49.13.85.200:8080/hotspots")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to show hotspots. Try again later!`);
        }
        return response.json();
      })
      .then((responseJson) => {
        setHotspots(responseJson);
      })
      .catch((error) => {
        console.error(error);
        // Handle the error (e.g., show an error message)
      });
  }, []);

  return (
    <MapView
      provider={PROVIDER_GOOGLE} 
      style={{ ...StyleSheet.absoluteFillObject }}
      onLongPress={props.lph}
    >
      {/* Map over the hotspots array and create a marker for each hotspot */}
      {hotspots.map((hotspot) => (
        <Marker
          key={hotspot.hotspot_id}
          coordinate={{
            latitude: hotspot.latitude,
            longitude: hotspot.longitude,
          }}
          onPress={() => setSelectedHotspot(hotspot)}
        >
          <Callout tooltip={true}>
            <CustomCalloutView hotspot={hotspot} />
          </Callout>
        </Marker>
      ))}
    </MapView> 
  );
}

function CustomCalloutView({ hotspot }) {
  return (
    <View style={styles.customCallout}>
      <Text >
        <Image style={styles.calloutImage} 
          source={{ uri:''}} resizemode="cover"/> 
      </Text>
      <Text style={styles.calloutTitle}>{hotspot.title}
      </Text>
      <Text style={{ color: 'red' }}>{hotspot.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  customCallout: {
    backgroundColor: 'white',
    borderRadius: 20, // Adjust the border radius for a different shape
    padding: 5,
    borderWidth: 1, // Add a border if desired
    borderColor: 'gray', // Border color
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 5,
    alignItems: 'center',
  },
  calloutTitle: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
  },
  calloutImage: {
    width: 200,
    height: 200,

  },
  imageContainer: {
    alignItems: 'center', // Center horizontally
    marginTop: 0, // Decrease the top margin

  },

});
