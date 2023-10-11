import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import * as Location from "expo-location"
import { useEffect, useState, useRef } from 'react';
import { Image } from 'react-native';



export default function Map (){
  const [marker, setMarker] = useState(null);
  const map = useRef(null);
  const [markerCoord, _] = useState(new AnimatedRegion({
    latitude: null,
    longitude: null,
  }));
  const [hasLocation, setHasLocation] = useState(false)
  // setHasLocation(false)


  const getPermission = async () => {
    let status;
    try {
      ({ status } = await Location.requestForegroundPermissionsAsync())
    } catch (err){
      console.log(err);
      setHasLocation(false)
    }  
    
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setHasLocation(false)
      return;
    }
  }

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          duration: 500
        };

        if (!hasLocation) {
          newCoordinate.latitudeDelta= 0.05
          newCoordinate.longitudeDelta= 0.05
          map.current.animateToRegion(newCoordinate, 1000)
        }

        markerCoord.timing(newCoordinate).start();
        setTimeout(()=>setHasLocation(true), 500)
      },
      error => console.log(error),
      {
        enableHighAccuracy: true
      }
    )
  }
  useEffect( () => {
    getPermission()
    getLocation()
    interval = setInterval(getLocation, 1000);
    return () => clearInterval(interval)
  })
  
  return (
    <MapView style={{ ...StyleSheet.absoluteFillObject }} 
      provider={PROVIDER_GOOGLE}
      ref={map}

      initialRegion={{
        latitude: 47.04, 
        longitude: 28.86,
        latitudeDelta: 0.4,
        longitudeDelta: 0.4
      }}>
      {hasLocation? (
        <Marker.Animated
          ref={m => {setMarker(m);}}
          coordinate={markerCoord}>
          <Image
            source={require('../assets/location.png')}
            style={{
              width: 32,
              height: 32
          }}/>
        </Marker.Animated>
      ): null}
    </MapView>
  )  
}
