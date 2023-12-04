import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import RenderMap from './RenderMap';
import LogInPage from './LogInPage';

const Tab = createBottomTabNavigator();

function TabGroup() {
    return(
        <Tab.Navigator>
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