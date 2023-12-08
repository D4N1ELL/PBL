import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Text, Platform, TouchableOpacity } from "react-native";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLoginRegisterToggle = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  const validateForm = () => {
    let errors = {};

    if (!email) errors.username = "Email is required";
    if (!password) errors.password = "Password is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Submitted", email, password);
      setEmail("");
      setPassword("");
      setErrors({});
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
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
                <TouchableOpacity style={styles.loginBtn}
                onPress={async() => {
                  let req = {
                      method:"POST",
                      body: JSON.stringify({
                        login: email,
                        password
                      }) 
                  }
                  response = await fetch("http://49.13.85.200:8080/login", req)
                  console.log(await response.text())
                  handleSubmit()
                }}>
                    <Text style={styles.loginText}>LogIn</Text> 
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.registerBtn}
                onPress={async() => {
                  let req = {
                      method:"POST",
                      body: JSON.stringify({
                        login: email,
                        password
                      }) 
                  }
                  response = await fetch("http://49.13.85.200:8080/signup", req)
                  console.log(await response.text())
                  handleSubmit()
                }}>           
                    <Text style={styles.loginText}>Register</Text> 
                </TouchableOpacity>
            )}

            <Button style={styles.switchButton}
                title={isLogin ? 'Switch to Register' : 'Switch to Login'}
                onPress={handleLoginRegisterToggle}
            />

          </View>
          
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
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
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loginBtn: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d9d9d9',
    color: 'white',
    borderRadius: 30
  },
  registerBtn:{
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 30
  }
});

export default LoginForm;