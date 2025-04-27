import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstPage from './firstpage';
import Dashboard from './dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="firstpage">
        <Stack.Screen name='firstpage' component={FirstPage} />
        <Stack.Screen name='dashboard' component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
