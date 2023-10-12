import 'react-native-gesture-handler'
import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import * as Location from "expo-location"
import { Image } from 'react-native';

import {View, StyleSheet } from 'react-native';

export default function Map(props) {
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
      .then((responseJson) => {
        setHotspots(responseJson);
      })
      .catch((error) => {
        console.error(error);
        // Handle the error (e.g., show an error message)
      });
  }, []);

  const [marker, setMarker] = useState(null);
  const map = useRef(null);
  const [markerCoord, _] = useState(new AnimatedRegion({
    latitude: null,
    longitude: null,
  }));
  const [hasPermission, setHasPermission] = useState(false)
  const [hasLocation, setHasLocation] = useState(true)
  // setHasLocation(false)


  const getPermission = async () => {
    let status;
    try {
      ({ status } = await Location.requestForegroundPermissionsAsync())
    } catch (err){
      console.log(err);
      setHasPermission(false)
      return false;
    }  
    
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setHasPermission(false)
      return false;
    }
    return true
  }

  const getLocation = async () => {
    if(!hasLocation) {
      return
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          duration: 500
        };

        if (!hasPermission) {
          newCoordinate.latitudeDelta= 0.05
          newCoordinate.longitudeDelta= 0.05
          map.current.animateToRegion(newCoordinate, 1000)
          setTimeout(()=>setHasPermission(true), 500)

        }

        markerCoord.timing(newCoordinate).start();
      },
      error => {
        if (error.code == 'E_LOCATION_SETTINGS_UNSATISFIED') {
          setHasLocation(false)
        }
      },  
      {
        // enableHighAccuracy: true,
      }
    )
  }
  useEffect(() => {
    permission = getPermission()
    if (!permission) {
      return
    }
    getLocation()
    interval = setInterval(getLocation, 1000);
    return () => clearInterval(interval)
  }, [hasPermission, hasLocation])

  return (
    <View style={styles.container}>
      <MapView
      provider={PROVIDER_GOOGLE} 
      style={styles.map}
      onLongPress={props.longPressHandler}
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
      {/* Map over the hotspots array and create a marker for each hotspot */}
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
});
