import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, Alert, TextInput, Text, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../utils/firebaseConfig';
//import { db } from '../util/firebaseConfig';
//import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {

      if (!email || !password || !fullName || !username) {
        Alert.alert("Please fill in all fields");
        return;
      }

      try {
          setLoading(true);
          const userCredential = await createUserWithEmailAndPassword(firebase_auth, email.trim(), password);
          const user = userCredential.user;
          //await setDoc(doc(db, 'users', user.uid), { fullName, username, email });
          Alert.alert("Account successfully created!");
      } catch (e) {
          Alert.alert("Failed to create account", e.message);
      } finally {
          setLoading(false);
      }
  };

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding">
        {/*all fields*/}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            />

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            />

          <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          />

        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSignUp}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Back to Login</Text>
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
  width: '100%'
  },

  inputContainer: {
  width: '80%',
  marginBottom: 20
  },

  input: {
  backgroundColor: '#fff',
  paddingVertical: 15,
  paddingHorizontal: 10,
  borderRadius: 10,
  marginVertical: 8,
  borderWidth: 1,
  borderColor: '#ccc'
  },

  buttonContainer: {
  width: '80%',
  alignItems: 'center'
  },

  primaryButton: {
  backgroundColor: 'green',
  width: '100%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginVertical: 5
  },

  secondaryButton: {
  borderColor: 'green',
  padding: 15
  },

  primaryButtonText: {
  color: 'white',
  fontWeight: '700'
  },

  secondaryButtonText: {
  color: 'green',
  fontWeight: '700'
  },
});