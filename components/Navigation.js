import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
 

import RenderMap from './RenderMap';
import LogInPage from './LogInPage';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();

function TabGroup() {
    return(
        
        <Tab.Navigator
            screenOptions={({route, navigation}) => ({
                tabBarIcon: ({ color, focused, size }) => {
                    let iconName;
                    if (route. name === "Map"){
                        iconName = focused? "map" : "map-outline";
                    } else if (route. name === "Account"){
                        iconName = focused? "person" : "person-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                headerStyle: {
                    backgroundColor: 'transparent'
                },
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeftContainerStyle: {
                        paddingLeft: 20
                },
            })}
        >
            <Tab.Screen name="Map" component={RenderMap}/>
            <Tab.Screen name="Account" component={LogInPage}/>
        </Tab.Navigator>
    )
    
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <TabGroup/>
        </NavigationContainer>
    )
}