import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';
export default function Map() {
    return (
        <MapView style={{ ...StyleSheet.absoluteFillObject }} 
                 provider={PROVIDER_GOOGLE}>
        </MapView>  
    );
}
