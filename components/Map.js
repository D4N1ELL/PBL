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
          throw new Error(`HTTP error! Status: ${response.status}`);
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
          
          {/* Custom marker component */}
        <CustomMarker hotspot={hotspot} />
          
        </Marker>
      ))}
    </MapView>  
  );
}

const CustomMarker = ({ hotspot }) => {
  return (
    <View style={markerStyle}>
      {/* Title */}
      <Text style={titleStyle}>{hotspot.title}</Text>
      {/* Description */}
      <Text style={descriptionStyle}>{hotspot.description}</Text>
      {/* Image */}
      <Image source={{ uri: hotspot.imageUrl }} style={imageStyle} />
    </View>
  );
};

const markerStyle = {
  width: 100,
  height: 100,
  backgroundColor: 'white',
  padding: 10,
  borderRadius: 5,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
};

const titleStyle = {
  fontSize: 10,
  fontWeight: 'bold',
};

const descriptionStyle = {
  fontSize: 8,
};

const imageStyle = {
  width: 100,
  height: 100,
  marginTop: 5,
};