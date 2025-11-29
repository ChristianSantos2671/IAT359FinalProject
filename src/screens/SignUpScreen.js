import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, TextInput, Text, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth, db } from '../utils/firebaseConfig.js';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import globalStyles from '../utils/globalStyles.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function SignUpScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();


    // function that handles a new user account
    const handleSignUp = async () => {
      // checks if the user has filled in all the fields or else sent an error
      if (!email || !password || !lastName || !firstName || !username) {
        Alert.alert("Please fill in all fields");
        return;
      }

      // creates an new account if all fields are in, and the user doesn't already exist
      try {
          setLoading(true);
          const userCredential = await createUserWithEmailAndPassword(firebase_auth, email.trim(), password);
          const user = userCredential.user;
          Alert.alert("Account successfully created!");
          // save user info
          await setDoc(
            doc(db, 'Users', user.uid), {
              firstName,
              lastName,
              username,
              email,
              createdAt: serverTimestamp(),

            });

            //passing the parameters 
            navigation.navigate("Profile", {firstname: firstName, lastname: lastName});

      } catch (e) {
          Alert.alert("Failed to create account", e.message);
      } finally {
          setLoading(false);
      }
  };


  return (
    <KeyboardAvoidingView behavior="padding" style={ [globalStyles.container, styles.background, {paddingTop: insets.top+20}]}>

      {/* Sign Up Form Container */}
      <ScrollView>

        <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
          <View style={globalStyles.textSection}>
            <Text style={globalStyles.h2}>Sign Up</Text>
          </View>
        </View>

        {/* First name */}
        <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
          <Text style={globalStyles.h3}>First Name</Text>
          <TextInput
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            style={globalStyles.input}
          />
        </View>

         {/* Last name */}
        <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
          <Text style={globalStyles.h3}>Last Name</Text>
          <TextInput
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            style={globalStyles.input}
          />
        </View>

        {/* USERNAME */}
        <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
          <Text style={globalStyles.h3}>Username</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={globalStyles.input}
          />
        </View>

        {/* EMAIL */}
        <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
          <Text style={globalStyles.h3}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={globalStyles.input}
            autoCapitalize="none"
          />
        </View>

        {/* PASSWORD */}
        <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
          <Text style={globalStyles.h3}>Password</Text>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={globalStyles.input}
            secureTextEntry
          />
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonContainer}>
          {/* sign up button */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={[globalStyles.primaryButton, globalStyles.buttonFix]}
          >
            <Text style={globalStyles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* button if the user already has an account to the log in screen */}
          <Text style={[globalStyles.bodyText, styles.alignments]}>
            Already have an account?{' '}
            <Text
              style={globalStyles.secondaryButtonText}
              onPress={() => navigation.navigate('SignIn')}
            >
              Back to Login
            </Text>
          </Text>
        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  background: {
    backgroundColor: 'white',
  },

  // styling for button containers
  buttonContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
  },

  // aligning text
  alignments: {
    marginTop: 20,
    textAlign: "center",
  },
});