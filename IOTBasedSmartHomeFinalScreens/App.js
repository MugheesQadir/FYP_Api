import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './IoTBasedSmartHome/MainScreen';
import Login from './IoTBasedSmartHome/Login';
import SignUp from './IoTBasedSmartHome/SignUp';
import Home from './IoTBasedSmartHome/Home';
import AddHome from './IoTBasedSmartHome/AddHome';
import EditHome from './IoTBasedSmartHome/EditHome';
import Compartment from './IoTBasedSmartHome/Compartment';
import AddCompartment from './IoTBasedSmartHome/AddCompartment';
import EditCompartment from './IoTBasedSmartHome/EditCompartment';
import CompartmentAppliance from './IoTBasedSmartHome/CompartmentAppliance';
import AddCompartmentAppliances from './IoTBasedSmartHome/AddCompartmentAppliances';
import EditCompartmentAppliances from './IoTBasedSmartHome/EditCompartmentAppliances';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='AddHome' component={AddHome} />
        <Stack.Screen name='EditHome' component={EditHome} />
        <Stack.Screen name='Compartment' component={Compartment} />
        <Stack.Screen name='AddCompartment' component={AddCompartment} />
        <Stack.Screen name='EditCompartment' component={EditCompartment} />
        <Stack.Screen name='CompartmentAppliance' component={CompartmentAppliance}/>
        <Stack.Screen name='AddCompartmentAppliances' component={AddCompartmentAppliances} />
        <Stack.Screen name='EditCompartmentAppliances' component={EditCompartmentAppliances} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({

});
