  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

  // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyB2Ng7zEwJpgB_0G9MaSRNCfPnVayD9Qws",
   authDomain: "mycookbook-d22ac.firebaseapp.com",
   projectId: "mycookbook-d22ac",
   storageBucket: "mycookbook-d22ac.appspot.com",
   messagingSenderId: "303284188379",
   appId: "1:303284188379:web:91962519b6a5e6878588fe"
 };

  // Initialize Firebase
export const mycookbook_app = initializeApp(firebaseConfig);
//export const firebase_auth = getAuth(mycookbook_app);
export const firebase_auth = initializeAuth(mycookbook_app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(mycookbook_app);
