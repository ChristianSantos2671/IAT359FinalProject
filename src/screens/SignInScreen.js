import React, { useState } from 'react';
import { KeyboardAvoidingView, Image, StyleSheet, TouchableOpacity, Alert, TextInput, Text, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {firebase_auth} from  '../utils/firebaseConfig.js';
import globalStyles from '../utils/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  

  // function that handles logging in the user by checking if the credentials are correct to what is on firebase
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

  <KeyboardAvoidingView behavior="padding"  style={globalStyles.container}>

    {/* Logo + App Name */}
    <View style={[styles.logoSection, { paddingTop: insets.top + 100 }]}>
      <Image
        source={ require('../../assets/myCookbook_logo.png') }
        style={[globalStyles.textMargins, globalStyles.logo] }
      />
      <Text style={ globalStyles.h1}>My Cookbook</Text>
    </View>

    <View style={{ flex: 1 }} />

    {/* Login Form Container */}
    <View style={[globalStyles.topContainer, styles.bottonContainer]}>

      <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
        
        <View style={globalStyles.textSection}>
          <Text style={[globalStyles.h2, globalStyles.textMargins]}>Login</Text>
        </View> 

        {/* Email input */}
        <Text style={globalStyles.h3}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={globalStyles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      {/* Password input */}
      <View style={[globalStyles.inputContainer, styles.buttonContainer]}>
        <Text style={globalStyles.h3}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          style={globalStyles.input}
          secureTextEntry
        />
      </View>

      {/* Button container */}
      <View style={styles.buttonContainer}>
        {/*button logging the user in */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[globalStyles.primaryButton, globalStyles.buttonFix]}
          disabled={loading}
        >
          <Text style={globalStyles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
      {/* redirect user to the sign up */}
        <Text style={[globalStyles.bodyText, styles.alignments]}>
          Don't have an account yet?{' '}
          <Text
            style={globalStyles.secondaryButtonText}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign up here
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
    backgroundColor: globalStyles.colors.background,
  },


  logoSection: {
    alignItems: "center",
    justifyContent: "center",    
    marginBottom: 10,
  },

  buttonContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
    
  },

  bottonContainer: {
  
    paddingBottom: 30,
    paddingTop: 40,
    // The curved top effect:
    borderTopLeftRadius: 50, 
    borderTopRightRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexGrow: 1,    
  },

  alignments: {
    marginTop: 20,
    textAlign: "center",
  },
});
