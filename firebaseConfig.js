// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
//import { getAnalytics, getAuth } from "firebase/analytics";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB1-jUfTygI9ICQEF_6EuhvJGz8BPgHMk",
  authDomain: "nsibidi-app.firebaseapp.com",
  projectId: "nsibidi-app",
  storageBucket: "nsibidi-app.appspot.com",
  messagingSenderId: "38347033462",
  appId: "1:38347033462:web:64e3db031ab6d6b0a04857",
  measurementId: "G-FC15Y0JRMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
/*initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});*/

//IOS: 325767622239-6ce15bossl6livhk7lu917mjo0f62rre.apps.googleusercontent.com
//Android: 325767622239-hlh0rhnh0sv6ejcbbqsihsh7mmkoh64f.apps.googleusercontent.com

export { app, auth, getApp, getAuth };