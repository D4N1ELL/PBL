import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import * as Location from "expo-location"
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';

import {showMessage, hideMessage} from "react-native-flash-message";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Map (){
  const [hotspots, setHotspots] = useState([]);
  useEffect(() => {
    // Fetch the hotspot data
    fetch("http://49.13.85.200:8080/hotspots")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(setHotspots)
      .catch(console.error);
  }, []);

  const map = useRef(null);
  const [markerCoord, _] = useState(new AnimatedRegion({
    latitude: null,
    longitude: null,
  }));
  const [hasPermission, setHasPermission] = useState(false)
  const [hasLocation, setHasLocation] = useState(true)

  const getPermission = async () => {
    let status;
    try {
      ({ status } = await Location.requestForegroundPermissionsAsync())
    } catch (err){
      setHasPermission(false)
      showMessage({
        message:"No permission to use location",
        type: "warning"})
      return false;
    }  
    
    if (status !== "granted") {
      setHasPermission(false)
      showMessage({
        message:"No permission to use location",
        type: "warning"})
      return false;
    }
    return true
  }

  const getLocation = async (move) => {
    if(!hasLocation) { return }
    navigator.geolocation.getCurrentPosition(
      position => {
        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          duration: 500
        };

        if (move) {
          newCoordinate.latitudeDelta= 0.05
          newCoordinate.longitudeDelta= 0.05
          map.current.animateToRegion(newCoordinate, 1000)
          setTimeout(()=>setHasPermission(true), 500)
        }

        markerCoord.timing(newCoordinate).start();
        hideMessage()
      },
      error => {
        if (error.code == 'E_LOCATION_SETTINGS_UNSATISFIED') {
          showMessage({
            message:"Location turned off",
            type: "warning"})
          setHasLocation(false)
        }
      },
    )
  }

  const locate = () => {
    setHasLocation(true)
    permission = getPermission()
    if (!permission) { return }
    getLocation(true)
  }

  useEffect(() => {
    checkPermission = getPermission()
    if (!checkPermission) { return }
    getLocation(!hasPermission)
    interval = setInterval(getLocation, 1000);
    return () => clearInterval(interval)
  }, [hasPermission, hasLocation])

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
  }, [])
  
  return (
    <View>
    <MapView style={{ ...StyleSheet.absoluteFillObject }} 
      provider={PROVIDER_GOOGLE}
      ref={map}
      toolbarEnabled={false}
      initialRegion={{
        latitude: 47.04, 
        longitude: 28.86,
        latitudeDelta: 0.4,
        longitudeDelta: 0.4
      }}>
      {(hasPermission && hasLocation)? (
        <Marker.Animated
          coordinate={markerCoord}>
          <Image
            source={require('../assets/location.png')}
            style={{
              width: 32,
              height: 32
          }}/>
        </Marker.Animated>
      ): null}
      {hotspots.map((hotspot) => (
        <Marker
          key={hotspot.hotspot_id}
          coordinate={{
            latitude: hotspot.latitude,
            longitude: hotspot.longitude,
          }}
          title={hotspot.title}
          description={hotspot.description}
        />
        ))}
      </MapView>
      <TouchableOpacity onPress={locate} style={styles.locateButton}>
        {hasLocation && hasPermission? 
          <Icon name="crosshairs-gps" size={30} color="#000"/>:
          <Icon name="crosshairs" size={30} color="#B22"/>
        }
      </TouchableOpacity>
    </View>  
      
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  locateButton: {
    width: 60, 
    height: 60,
    position: "absolute", 
    bottom: 40, 
    right: 20, 
    borderRadius: 30, 
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center"
  }
});
