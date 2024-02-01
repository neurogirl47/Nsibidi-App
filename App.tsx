import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import Forum from './Screens/Forum';
import Dictionary from './Screens/Dictionary';
import Game from './Screens/Game';
import Login from './Screens/Login';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from 'expo-web-browser';
import {
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { auth, getApp, getAuth } from "./firebaseConfig";
import { FirebaseApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

/*const aut = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});*/

WebBrowser.maybeCompleteAuthSession();

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [userInfo, setUserInfo] = React.useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "325767622239-6ce15bossl6livhk7lu917mjo0f62rre.apps.googleusercontent.com",
    androidClientId: "325767622239-hlh0rhnh0sv6ejcbbqsihsh7mmkoh64f.apps.googleusercontent.com",
  });


  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch(e){
      alert(e.message);
    }finally{
      setLoading(false);
    }
  }

    React.useEffect(() => {
      if (response?.type == "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential);
      }
    }, [response]);

    React.useEffect(() => {
      const checkLocalUser = async () => {
        try {
          setLoading(true);
          const userJSON = await AsyncStorage.getItem("@user");
          const userData = userJSON ? JSON.parse(userJSON) : null;
          setUserInfo(userData);
        } catch(e){
          alert(e.message);
        }finally{
          setLoading(false);
        }
      }

      checkLocalUser();
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log(JSON.stringify(user, null, 2));
          setUserInfo( userInfo );
          await AsyncStorage.setItem("@user", JSON.stringify(user))
        } else {
          console.log("User is not authenticated")
        }
      });

      return () => unsub();
    }, []);

    return userInfo ? (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Game"
            component={Game}
            options={{
              tabBarLabel: 'Game',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="draw-pen" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Dictionary"
            component={Dictionary}
            options={{
              tabBarLabel: 'Dictionary',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="book-open-variant" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Forum"
            component={Forum}
            options={{
              tabBarLabel: 'Forum',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="forum" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    ) : <Login promptAsync={promptAsync} />;
  }

