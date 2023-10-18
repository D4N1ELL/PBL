import { StyleSheet , Text, View,Image} from 'react-native';
import React, { useEffect, useState, memo } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Svg, Polygon, Rect } from 'react-native-svg';


export default function Map(props) {
  const [hotspots, setHotspots] = useState([]);
  const [tvc, setTvc] = useState(false);

  useEffect(() => {
    interval = setInterval(() => {
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
      });
      setTvc(true)
      setTimeout(()=>setTvc(false), 200)
    }, 2000)
    return () => {clearInterval(interval)}
  }, [hotspots]);
  return (
    <MapView
      provider={PROVIDER_GOOGLE} 
      style={{ ...StyleSheet.absoluteFillObject }}
    >
      {/* Map over the hotspots array and create a marker for each hotspot */}
      {hotspots.map((hotspot, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: hotspot.latitude,
            longitude: hotspot.longitude,
          }}
          tracksViewChanges={tvc}
        >
        <CustomMarker hotspot={hotspot} />
        </Marker>
      ))}
    </MapView>  
  );
}

const CustomMarker = memo(({ hotspot }) => {
  return (
    <View >
      <Svg height="155" width="155">
        <Rect x="0" y="0" width="120" height="120" rx="10" ry="10" fill="white" />
        <Polygon points="40,120 60,135 80,120" fill="white" />
        <Image
          marginLeft={10}
          marginTop={10}
          width={100}
          height={60}
          borderRadius= {15}
          overflow= "hidden"
          source={{ uri: `http://49.13.85.200:8080/static/${hotspot.hotspot_id}/${hotspot.photos?.at(0)}` }}
        />
        <Text style={styles.titleStyle} >{hotspot.title}</Text>
        <Text style={styles.descriptionStyle} x="10" y="80" width={80}>{hotspot.description}</Text>
      </Svg>
    </View>
  );
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  
  titleStyle : {
    fontSize: 8,
    letterSpacing: 0,
    textAlign: 'left',
    top: 10, left: 10,
    color: 'rgba(109, 27, 137, 1)',
  },

  descriptionStyle : {
    fontSize: 6,
  top: 10, left: 10, right: 90,
  },
});