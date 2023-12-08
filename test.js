import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const AccountScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleLoginRegisterToggle = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setRepeatPassword('');
  };

  const handleLogin = () => {
    // Logic for login
    navigation.navigate('Profile');
  };

  const handleRegister = () => {
    // Logic for registration
    navigation.navigate('Profile');
  };

  return (
    <View>
      <Text>{isLogin ? 'Login' : 'Register'}</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {!isLogin && (
        <TextInput
          placeholder="Repeat Password"
          secureTextEntry
          value={repeatPassword}
          onChangeText={(text) => setRepeatPassword(text)}
        />
      )}

      {isLogin ? (
        <Button title="Login" onPress={handleLogin} />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}

      <Button
        title={isLogin ? 'Switch to Register' : 'Switch to Login'}
        onPress={handleLoginRegisterToggle}
      />
      
    </View>
  );
};

export default AccountScreen;

//***********************************************************************8
// 
// 
// ***********************************************************************
