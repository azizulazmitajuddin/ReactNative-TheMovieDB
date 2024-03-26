import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import { useEffect } from 'react';
import useUserStore from "./src/hooks/useUserStore";
import LandingScreen from './src/modules/Landing';
import LoginScreen from './src/modules/Login';
import TabNavigation from './src/navigation/tab';

const Stack = createStackNavigator();

export default function App() {
  const userStore = useUserStore()

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('session_id');
      if (value !== null) {
        userStore.setSession(value);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(()=>{
    getData();
  },[])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing'>
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Landing" component={LandingScreen} options={{ title: " " }}/>
          <Stack.Screen name="Tab" component={TabNavigation} />
        </Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
