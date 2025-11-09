import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, Alert, TextInput, Text, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {firebase_auth} from  '../utils/firebaseConfig.js';

export default function SignInScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(firebase_auth, email.trim(), password);
      Alert.alert("Logged in successfully!");
    } catch (e) {
      Alert.alert("Login Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View>
        <Text style={styles.h1} > Login to your account! </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value = {email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value = {password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.subheading}>
          <Text style={styles.bodyText}> Don't have an account yet?
            <Text style={styles.textButton}
            onPress={() => navigation.navigate('SignUp')}
          > Sign up here
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  h1: {
     color: 'green',
     fontWeight: '700',
     fontSize: 36
  },

  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: 'green',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  secondaryButton: {
    borderColor: 'green',
    padding: 15,
  },

  primaryButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  
  secondaryButtonText: {
    color: 'green',
    fontWeight: '700',
  },

  subheading: {
    fontSize: 16,
    fontColor: "#3f3f3fff",
    marginBottom: 6,
  },

  textButton: {
    color: 'green',
    fontSize: 16,
    fontWeight: '700',
  },

});
