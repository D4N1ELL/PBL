import { StyleSheet , Text, View,Image} from 'react-native';
import React, { useEffect, useState, memo } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Svg, Polygon, Rect } from 'react-native-svg';
import SuperCluster from 'react-native-maps-super-cluster';


export default function Map(props) {
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
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
        //console.log("b4", hotspots.length)
        setHotspots(responseJson);
        //console.log("aftr", hotspots)
      })
      .catch((error) => {
        console.error(error);
        // Handle the error (e.g., show an error message)
      });
      setTvc(true)
      setTimeout(()=>setTvc(false), 200)
    }, 2000)
    return () => {clearInterval(interval)}
  }, [hotspots]);
  //console.log("redraw")
  return (
    <MapView
      provider={PROVIDER_GOOGLE} 
      style={{ ...StyleSheet.absoluteFillObject }}
      onLongPress={props.lph}
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
          marginLeft={20}
          width={80}
          height={80}
          borderRadius= {10}
          overflow= "hidden"
          source={{ uri: `http://49.13.85.200:8080/static/${hotspot.hotspot_id}/${hotspot.photos?.at(0)}` }}
        />
        <Text style={titleStyle} >{hotspot.title}</Text>
        <Text style={descriptionStyle} x="10" y="80" width={80}>{hotspot.description}</Text>
      </Svg>
    </View>
  );
});


const titleStyle = {
  fontSize: 8,
  fontWeight: 600,
  letterSpacing: 0,
  textAlign: 'left',
 top: 10, left: 10,
 color: 'rgba(109, 27, 137, 1)',
};

const descriptionStyle = {
  fontSize: 6,
 top: 10, left: 10, right: 90,
};

