// In your ProfilePage component
import React from 'react';
import { View, Text } from 'react-native';

const ProfilePage = ({ route }) => {
  //const { username } = route.params;

  return (
    <View>
      <Text>Welcome!</Text>
      {/* Other profile screen content */}
    </View>
  );
};

export default ProfilePage;
