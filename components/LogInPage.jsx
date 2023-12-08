import React, { useState } from 'react';
import {
  View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Text, Platform, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginBtn: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d9d9d9',
    color: 'white',
    borderRadius: 30,
  },
  registerBtn: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 30,
  },
});

function LoginForm() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  AsyncStorage.getItem('jwtToken').then((token) => {
    if (token != null) {
      setHasToken(true);
    }
  });

  const handleLoginRegisterToggle = () => {
    setIsLogin(!isLogin);
    setHasToken(false);
    setEmail('');
    setPassword('');
  };

  const validateForm = () => {
    const err = {};

    if (!email) err.username = 'Email is required';
    if (!password) err.password = 'Password is required';

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setEmail('');
      setPassword('');
      setErrors({});
    }
  };

  const loginFormView = (
    <View style={styles.form}>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <View>
        {isLogin ? (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={async () => {
              const req = {
                method: 'POST',
                body: JSON.stringify({
                  login: email,
                  password,
                }),
              };
              const response = await fetch('http://49.13.85.200:8080/login', req);

              if (response.ok) {
                navigation.navigate('Map');
                await AsyncStorage.setItem('jwtToken', await response.json());
                setHasToken(true);
              } else {
                showMessage({
                  message: 'Failed to login',
                  type: 'warning',
                });
                console.error('Login failed'); // Handle login failure
              }

              handleSubmit();
            }}
          >
            <Text style={styles.loginText}>LogIn</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={async () => {
              const req = {
                method: 'POST',
                body: JSON.stringify({
                  login: email,
                  password,
                }),
              };
              await fetch('http://49.13.85.200:8080/signup', req);
              handleSubmit();
            }}
          >
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>
        )}

        <Button
          style={styles.switchButton}
          title={isLogin ? 'Switch to Register' : 'Switch to Login'}
          onPress={handleLoginRegisterToggle}
        />

      </View>

    </View>
  );

  const logoutFormView = (
    <View style={styles.form}>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={async () => {
          await AsyncStorage.removeItem('jwtToken');
          setHasToken(false);
        }}
      >
        <Text style={styles.loginText}>LogOut</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={styles.container}
    >
      {hasToken
        ? logoutFormView : loginFormView}
    </KeyboardAvoidingView>
  );
}

export default LoginForm;
