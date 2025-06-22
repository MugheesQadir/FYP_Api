import {
  Text, View, TouchableOpacity, Pressable,
  KeyboardAvoidingView, Platform, Switch,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const storage = new MMKV();

const Geyser = ({ navigation, route }) => {
  const [gasStatus, setGasStatus] = useState(false);
  const [cylinderStatus, setCylinderStatus] = useState(false);
  const [home_id, setHomeId] = useState(route.params?.items?.home_id || null);
  const items = route.params?.items || {};
  const intervalRef = useRef(null);

  const get_geyser_by_Home_id = useCallback(async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${URL}/get_geyser_by_Home_id/${id}`);
      if (response.ok) {
        const result = await response.json();
        if (result && result.id) {
          setGasStatus(result.gas_status === 1);
          setCylinderStatus(result.cylinder_status === 1);
        }
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  const updateStatus = async (newGasStatus, newCylinderStatus) => {
    const payload = {
      home_id: home_id,
      gas_status: newGasStatus ? 1 : 0,
      cylinder_status: newCylinderStatus ? 1 : 0,
    };

    try {
      const res = await fetch(`${URL}/Update_Gas_Cylinder_status_with_Home_ID`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGasToggle = () => {
    const newGasStatus = !gasStatus;
    setGasStatus(newGasStatus);
    setCylinderStatus(false); // Automatically turn off cylinder
    updateStatus(newGasStatus, false);
  };

  const handleCylinderToggle = () => {
    const newCylinderStatus = !cylinderStatus;
    setCylinderStatus(newCylinderStatus);
    setGasStatus(false); // Automatically turn off gas
    updateStatus(false, newCylinderStatus);
  };

  useFocusEffect(
    useCallback(() => {
      if (!home_id) return;

      get_geyser_by_Home_id(home_id);

      intervalRef.current = setInterval(() => {
        get_geyser_by_Home_id(home_id);
      }, 3000); // Optional polling every 3 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [home_id])
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 0.90, justifyContent: 'center' }}>
          <Text style={styles.navbarText}>Geyser</Text>
        </View>
      </View>

      <View style={{ marginBottom: 10, marginLeft: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', fontStyle: 'italic' }}>{items.home_name}</Text>
      </View>

      {/* GAS Toggle */}
      <View style={styles.row}>
        <Pressable style={[styles.listItem, {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '75%',
          marginHorizontal: 0,
        }]}>
          <Text style={styles.listText}>Gas</Text>
        </Pressable>
        <View style={styles.switchContainer}>
          <View style={styles.simulatedBorder} />
          <Switch
            trackColor={{ false: 'transparent', true: 'transparent' }}
            thumbColor={gasStatus ? '#001F6D' : '#B0B7C3'}
            ios_backgroundColor="transparent"
            onValueChange={handleGasToggle}
            value={gasStatus}
            style={styles.switch}
          />
        </View>
      </View>

      {/* CYLINDER Toggle */}
      <View style={styles.row}>
        <Pressable style={[styles.listItem, {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '75%',
          marginHorizontal: 0,
        }]}>
          <Text style={styles.listText}>Cylinder</Text>
        </Pressable>
        <View style={styles.switchContainer}>
          <View style={styles.simulatedBorder} />
          <Switch
            trackColor={{ false: 'transparent', true: 'transparent' }}
            thumbColor={cylinderStatus ? '#001F6D' : '#B0B7C3'}
            ios_backgroundColor="transparent"
            onValueChange={handleCylinderToggle}
            value={cylinderStatus}
            style={styles.switch}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Geyser;
