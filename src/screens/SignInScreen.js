import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, Alert, TextInput, Text, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {firebase_auth} from  '../utils/firebaseConfig';

export default function SignInScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);

  /*const handleSignUp = async () => {
      try {
          setLoading(true);
          await createUserWithEmailAndPassword(firebase_auth, email.trim(), password);
          Alert.alert("Account Created");
      } catch (e) {
          Alert.alert("Failed to create account", e.message);
      } finally {
          setLoading(false);
      }
  }; */

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

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
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
     fontSize: 35
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
});
