import { Alert, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './IoTBasedSmartHome/MainScreen';
import Login from './IoTBasedSmartHome/Login';
import SignUp from './IoTBasedSmartHome/SignUp';
import Home from './IoTBasedSmartHome/Home';
import AddHome from './IoTBasedSmartHome/AddHome';
import EditHome from './IoTBasedSmartHome/EditHome';
import DashBoard from './IoTBasedSmartHome/DashBoard';
import Compartment from './IoTBasedSmartHome/Compartment';
import AddCompartment from './IoTBasedSmartHome/AddCompartment';
import EditCompartment from './IoTBasedSmartHome/EditCompartment';
import CompartmentAppliance from './IoTBasedSmartHome/CompartmentAppliance';
import AddCompartmentAppliances from './IoTBasedSmartHome/AddCompartmentAppliances';
import EditCompartmentAppliances from './IoTBasedSmartHome/EditCompartmentAppliances';
import ApplianceSchedules from './IoTBasedSmartHome/ApplianceSchedules';
import AddApplianceSchedule from './IoTBasedSmartHome/AddApplianceSchedule';
import Locks from './IoTBasedSmartHome/Locks';
import AddLocks from './IoTBasedSmartHome/AddLocks';
import LockSchedules from './IoTBasedSmartHome/LockSchedules';
import AddLockSchedule from './IoTBasedSmartHome/AddLockSchedule';
import WaterLevelState from './IoTBasedSmartHome/WaterLevelState';
import EditApplianceSchedule from './IoTBasedSmartHome/EditApplianceSchedule';
import EditLocks from './IoTBasedSmartHome/EditLocks';
import EditLockSchedule from './IoTBasedSmartHome/EditLockSchedule';
import ApplianceWiseAppliances from './IoTBasedSmartHome/ApplianceWiseAppliances';
import URL from './IoTBasedSmartHome/Url';
import Geyser from './IoTBasedSmartHome/Geyser';
import Temperature from './IoTBasedSmartHome/Temperature';
import CompartmentApplianceRecord from './IoTBasedSmartHome/CompartmentApplianceRecord';
import CompartmentLockRecord from './IoTBasedSmartHome/CompartmentLockRecord';
import EmergencyAlert from './IoTBasedSmartHome/EmergencyAlert';
import LogRecord from './IoTBasedSmartHome/LogRecord';


const App = () => {
  const Stack = createNativeStackNavigator();
  const scheduleUpdateIntervalRef = useRef(null);
  const autoHighLoadIntervalRef = useRef(null);
  const [emergencyVisible, setEmergencyVisible] = useState(false);

  const check_appliance_schedule_update_status = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/check_schedule_update_status`);
      if (response.ok) {
        return;
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  const check_Lock_schedule_update_status = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/check_lock_schedule_update_status`);
      if (response.ok) {
        return;
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  const get_panic_alert_state = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/get_panic_alert_state`);
      if (response.ok) {
        const result = await response.json();
        if (result && result.state !== undefined) {
          // Example: setPanicState(result.state);
          console.log('Panic Alert State:', result.state);
          // Alert.alert("Alert", "Emergency Nafiz")
          setEmergencyVisible(true)
        }
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  const auto_Off_On_High_Load = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/auto_Off_On_High_Load`);
      if (response.ok) {
        return;
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  useEffect(() => {
    // Run immediately on app start
    check_appliance_schedule_update_status();
    check_Lock_schedule_update_status();
    auto_Off_On_High_Load(); // run once at start too (optional)
    get_panic_alert_state()

    // Start 1-second interval for schedule checks
    scheduleUpdateIntervalRef.current = setInterval(() => {
      check_appliance_schedule_update_status();
      check_Lock_schedule_update_status();
      get_panic_alert_state()
    }, 1000); // every 1 sec

    // Start 10-minute interval for auto high load shutdown
    autoHighLoadIntervalRef.current = setInterval(() => {
      auto_Off_On_High_Load(); // your custom logic
    }, 10 * 60 * 1000); // every 10 minutes

    // Cleanup when component unmounts
    return () => {
      if (scheduleUpdateIntervalRef.current) {
        clearInterval(scheduleUpdateIntervalRef.current);
        scheduleUpdateIntervalRef.current = null;
        console.log("Global schedule update interval cleared.");
      }
      if (autoHighLoadIntervalRef.current) {
        clearInterval(autoHighLoadIntervalRef.current);
        autoHighLoadIntervalRef.current = null;
        console.log("Auto High Load interval cleared.");
      }
    };
  }, []);


  // useEffect(() => {
  //   // ✅ Background Service start hogi app ke start hote hi
  //   NativeModules.BackgroundServiceModule.startService();
  //   // console.log("Background Service Started by Mughees bhai 🚀");
  // }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false, animation: 'ios_from_right', animationEnabled: false
        }}>
          <Stack.Screen name="MainScreen" component={MainScreen} />
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='SignUp' component={SignUp} />
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='AddHome' component={AddHome} />
          <Stack.Screen name='EditHome' component={EditHome} />
          <Stack.Screen name='DashBoard' component={DashBoard} />
          <Stack.Screen name='Compartment' component={Compartment} />
          <Stack.Screen name='AddCompartment' component={AddCompartment} />
          <Stack.Screen name='EditCompartment' component={EditCompartment} />
          <Stack.Screen name='CompartmentAppliance' component={CompartmentAppliance} />
          <Stack.Screen name='AddCompartmentAppliances' component={AddCompartmentAppliances} />
          <Stack.Screen name='EditCompartmentAppliances' component={EditCompartmentAppliances} />
          <Stack.Screen name='CompartmentApplianceRecord' component={CompartmentApplianceRecord} />
          <Stack.Screen name='ApplianceSchedules' component={ApplianceSchedules} />
          <Stack.Screen name='AddApplianceSchedule' component={AddApplianceSchedule} />
          <Stack.Screen name='EditApplianceSchedule' component={EditApplianceSchedule} />
          <Stack.Screen name='Locks' component={Locks} />
          <Stack.Screen name='AddLocks' component={AddLocks} />
          <Stack.Screen name='EditLocks' component={EditLocks} />
          <Stack.Screen name='CompartmentLockRecord' component={CompartmentLockRecord} />
          <Stack.Screen name='LockSchedules' component={LockSchedules} />
          <Stack.Screen name='AddLockSchedule' component={AddLockSchedule} />
          <Stack.Screen name='EditLockSchedule' component={EditLockSchedule} />
          <Stack.Screen name='WaterLevelState' component={WaterLevelState} />
          <Stack.Screen name='ApplianceWiseAppliances' component={ApplianceWiseAppliances} />
          <Stack.Screen name='Geyser' component={Geyser} />
          <Stack.Screen name='Temperature' component={Temperature} />
          <Stack.Screen name='EmergencyAlert' component={EmergencyAlert} />
          <Stack.Screen name='LogRecord' component={LogRecord} />

        </Stack.Navigator>
      </NavigationContainer>
      <EmergencyAlert
        visible={emergencyVisible}
        onClose={() => setEmergencyVisible(false)}
        title='EMERGENCY ALERT'
        message='🚨 Emergency Nafiz has been triggered!'
      />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
