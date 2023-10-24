import 'react-native-gesture-handler'
import React, {memo, useEffect, useRef, useState} from 'react';
import MapView, {AnimatedRegion, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from "expo-location"
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {showMessage} from "react-native-flash-message";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ClusteredMapView from 'react-native-map-clustering'; // Import ClusteredMapView

export default function Map(props) {
    const [tvc, setTvc] = useState(false);

    useEffect(() => {
        // Fetch the hotspot data
        fetch("http://49.13.85.200:8080/hotspots")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(props.setHotspots)
            .catch(console.error);
    }, []);

    useEffect(() => {
        // Fetch the hotspot data
        let interval = setInterval(() => {
            fetch("http://49.13.85.200:8080/hotspots")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(props.setHotspots)
                .catch(console.error);
            // setTvc(true)
            setTimeout(() => setTvc(false), 10)
        }, 10000)
        return () => {
            clearInterval(interval)
        }
    }, [props.hotspots]);

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
            ({status} = await Location.requestForegroundPermissionsAsync())
        } catch (err) {
            setHasPermission(false)
            showMessage({
                message: "No permission to use location",
                type: "warning"
            })
            return false;
        }

        if (status !== "granted") {
            setHasPermission(false)
            showMessage({
                message: "No permission to use location",
                type: "warning"
            })
            return false;
        }
        return true
    }

    const getLocation = async (move) => {
        if (!hasLocation) {
            return
        }
        navigator.geolocation.getCurrentPosition(
            position => {
                const newCoordinate = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    duration: 500
                };

                if (move) {
                    newCoordinate.latitudeDelta = 0.05
                    newCoordinate.longitudeDelta = 0.05
                    map.current.animateToRegion(newCoordinate, 1000)
                    setTimeout(() => setHasPermission(true), 500)
                }

                markerCoord.timing(newCoordinate).start();
                // hideMessage()
            },
            error => {
                if (error.code == 'E_LOCATION_SETTINGS_UNSATISFIED') {
                    showMessage({
                        message: "Location turned off",
                        type: "warning"
                    })
                    setHasLocation(false)
                }
            },
        )
    }

    const locate = () => {
        setHasLocation(true)
        let permission = getPermission()
        if (!permission) {
            return
        }
        getLocation(true)
    }

    useEffect(() => {
        let checkPermission = getPermission()
        if (!checkPermission) {
            return
        }
        getLocation(!hasPermission)
        let interval = setInterval(getLocation, 1000);
        return () => clearInterval(interval)
    }, [hasPermission, hasLocation])

    return (
        <View style={styles.container}>
            <ClusteredMapView
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
                {(hasPermission && hasLocation) ? (
                    <Marker.Animated
                        coordinate={markerCoord}>
                        <Image
                            source={require('../assets/location.png')}
                            style={{
                                width: 32,
                                height: 32
                            }}/>
                    </Marker.Animated>
                ) : null}
                {/* Map over the hotspots array and create a marker for each hotspot */}
                {props.hotspots.map((hotspot, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: hotspot.latitude,
                            longitude: hotspot.longitude,
                        }}
                        tracksViewChanges={tvc}
                        zIndex={1000} // Set a higher zIndex for unclustered markers
                        onPress={props.onMarkerPress(hotspot)}
                    >
                      <Image
                            source={require('../assets/Location-pin.png')}
                            style={{
                                width: 60,
                                height: 60
                            }}/>  
                    </Marker>
                ))}
            </ClusteredMapView>
            <TouchableOpacity onPress={locate} style={styles.locateButton}>
                {hasLocation && hasPermission ?
                    <Icon name="crosshairs-gps" size={30} color="#000"/> :
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
    },
    titleStyle: {
        fontSize: 8,
        letterSpacing: 0,
        textAlign: 'left',
        top: 10, left: 10,
        color: 'rgba(109, 27, 137, 1)',
    },

    descriptionStyle: {
        fontSize: 6,
        top: 10, left: 10, right: 90,
    },
});
