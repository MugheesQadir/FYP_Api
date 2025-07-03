import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Platform
} from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import URL from './Url';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';

const Temperature = ({ navigation }) => {
  const [temperature, setTemperature] = useState(0);
  const [statusText, setStatusText] = useState('');
  const tempHeight = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);
  const maxBarHeight = 250;

  const updateTemperatureStatus = (temp) => {
    if (temp >= 50) setStatusText('🔥 High Temperature');
    else if (temp >= 35) setStatusText('🌤 Moderate');
    else if (temp >= 25) setStatusText('🌥 Normal');
    else setStatusText('❄ Low Temperature');
  };

  const Get_Temperature_level_State = async () => {
    try {
      const response = await fetch(`${URL}/get_temperature_level_state`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        const temp = result.state; // No rounding
        setTemperature(temp);
        updateTemperatureStatus(temp);

        const percentage = Math.min(temp / 70, 1); // 50°C max
        const newHeight = maxBarHeight * percentage;

        Animated.timing(tempHeight, {
          toValue: newHeight,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    } catch (error) {
      console.error("Error fetching temperature:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      Get_Temperature_level_State();
      intervalRef.current = setInterval(() => {
        Get_Temperature_level_State();
      }, 1000);

      return () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      };
    }, [])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { flex: 1, alignItems: 'center', backgroundColor: '#fff' }]}>
      
      {/* Navbar */}
      <View style={[styles.navbar]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 0.90, justifyContent: 'center' }}>
          <Text style={styles.navbarText}>Temperature</Text>
        </View>
      </View>

      {/* Thermometer Simulation */}
      <View style={stylees.thermometer}>
        <Animated.View style={[stylees.tempFill, { height: tempHeight }]} />
      </View>

      {/* Temperature Display */}
      <View style={[styles.button, { marginTop: 20 }]}>
        <Text style={styles.buttonText}>🌡 Temp: {temperature}°C</Text>
      </View>

      <View style={[styles.button, { marginTop: 10 }]}>
        <Text style={styles.buttonText}>{statusText}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const stylees = StyleSheet.create({
  thermometerContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  topCap: {
    width: 20,
    height: 20,
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thermometer: {
    width: 80,
    height: 250,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#FF3D00',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tempFill: {
    width: '100%',
    backgroundColor: '#FF8A65',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundGradient: 'linear-gradient(180deg, #FFD180 0%, #FF7043 100%)',
  },
  bottomBulb: {
    width: 60,
    height: 60,
    backgroundColor: '#FF3D00',
    borderRadius: 30,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});


export default Temperature;
