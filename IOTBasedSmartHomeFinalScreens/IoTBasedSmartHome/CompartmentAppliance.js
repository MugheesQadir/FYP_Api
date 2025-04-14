import {
  Text, View, TouchableOpacity, Pressable,
  KeyboardAvoidingView, Platform, FlatList,
  Switch,
  Alert
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import URL from './Url';
import EditCompartmentAppliances from './EditCompartmentAppliances';

const storage = new MMKV();

const CompartmentAppliance = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const [items, setItems] = useState(route.params?.items || {});
  const [compartment_id, setCompartmentId] = useState(items?.compartment_id || null);

  const setStorageData = () => {
    if (items?.compartment_id) {
      storage.set('compartment_id', Number(items.compartment_id));
    }
  };

  const getStorageData = () => {
    const storedId = storage.getNumber('compartment_id');
    if (storedId !== undefined) {
      setCompartmentId(storedId);
    }
  };

  const getCompartmentApplianceByCompartmentId = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${URL}/get_compartment_appliance_with_compartment_id/${id}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);

        const initialToggles = {};
        result.forEach(item => {
          initialToggles[item.Compartment_Appliance_id] = item.status === 1;
        });
        setToggleStates(initialToggles);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const EditAppliances = async () => {
    if (!name) {
      Alert.alert('Error', 'Please Enter Appliance name')
      return;
    }
    if (!Appliances) {
      Alert.alert('Error', 'Please Select Appliances')
      return;
    }
    if (status === null || status === undefined) {
      Alert.alert('Error', 'Please Select status');
      return;
    }

    const payload = { id: Com_App_id, name: name, compartment_id: compartment_id, appliance_id: Appliances, status: status === 1 ? 1 : 0 };
    try {
      const res = await fetch(`${URL}/Update_Compartment_Appliance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json(); // Safe JSON parsing
      } catch (jsonError) {
        throw new Error("Invalid JSON response from server");
      }

      if (res.ok) {
        if (data.success) {
          Alert.alert('Successful', data.success);
          navigation.goBack()
        } else {
          Alert.alert('Failed', data.error || 'Something went wrong');
        }
      } else {
        Alert.alert('Failed', data?.error || 'Server error occurred');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    }
  };

  const handleToggle = async (id, Compartment_Appliance_id, name, compartment_id, appliance_id) => {
    const newStatus = !toggleStates[id]; // status to be updated in DB (true = 1, false = 0)

    // 👇 Update frontend state immediately for better UX
    setToggleStates(prev => ({ ...prev, [id]: newStatus }));

    // Prepare payload for backend
    const payload = {
      id: Compartment_Appliance_id,
      name: name,
      compartment_id: compartment_id,
      appliance_id: appliance_id,
      status: newStatus ? 1 : 0,  // convert to integer
    };

    try {
      const res = await fetch(`${URL}/Update_Compartment_Appliance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("Status updated successfully for:", name);
      } else {
        Alert.alert('Failed to update status', data.error || 'Unknown error');
        // ❌ Revert toggle if update failed
        setToggleStates(prev => ({ ...prev, [id]: !newStatus }));
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
      // ❌ Revert toggle on error
      setToggleStates(prev => ({ ...prev, [id]: !newStatus }));
    }
  };


  const handleSelectAll = () => {
    const newState = !selectAll;
    const updatedToggles = {};
    data.forEach(item => updatedToggles[item.id] = newState);
    setToggleStates(updatedToggles);
    setSelectAll(newState);
  };

  useEffect(() => {
    if (items?.compartment_id) {
      setStorageData();
      getCompartmentApplianceByCompartmentId(items.compartment_id);
    }
  }, [items]);

  useFocusEffect(
    useCallback(() => {
      getStorageData();
      if (compartment_id) getCompartmentApplianceByCompartmentId(compartment_id);
    }, [compartment_id])
  );


  const FlatListData = ({ item }) => (
    <View style={styles.row}>
      <Pressable style={[styles.listItem, {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '75%',
        marginHorizontal: 0,
      },]}
      // onPress={() => navigation.navigate('Compartment', { items: item })}
      >
        <Text style={[styles.listText]}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditCompartmentAppliances', { items: item })}
        >
          <View style={styles.infoIcon}>
            <Text style={styles.infoText}>i</Text>
          </View>
        </TouchableOpacity>
      </Pressable>
      <View style={styles.switchContainer}>
        <View style={styles.simulatedBorder} />
        <Switch
          trackColor={{ false: 'transparent', true: 'transparent' }}
          thumbColor={toggleStates[item.Compartment_Appliance_id] ? '#001F6D' : '#B0B7C3'}
          onValueChange={() =>
            handleToggle(
              item.Compartment_Appliance_id,
              item.Compartment_Appliance_id,
              item.name,
              item.compartment_id,
              item.appliance_id
            )
          }
          ios_backgroundColor="transparent"
          value={toggleStates[item.Compartment_Appliance_id]}
          style={styles.switch}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
      <View style={[styles.navbar]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navbarText, { marginRight: 25 }]}>Appliances</Text>
        </View>
      </View>
      <View style={{ marginBottom: 3 }}>
        <Text style={{ marginLeft: 30, fontSize: 15, fontWeight: '400', fontStyle: 'italic', marginTop: 10 }}>{items.compartment_name}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {data.length > 0 ?
          <FlatList
            data={data}
            renderItem={FlatListData}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          :
          <View>
            <View style={[styles.listItem]}>
              <Text style={[styles.listText, { fontSize: 17 }]}>Please Add Appliances</Text>
              <View>
                <View style={styles.infoIcon}>
                  <Text style={styles.infoText}>!</Text>
                </View>
              </View>
            </View>
            <View style={{ padding: '10%', backgroundColor: '' }}>
              <Text style={{ fontSize: 15 }}>Note :</Text>
              <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                <Text style={[styles.listText, { color: 'black', fontSize: 16, marginLeft: 0 }]}>No Appliances available</Text>
                <Text style={[styles.listText, { color: 'black', fontSize: 15, marginLeft: 6, marginTop: 15 }]}>Please press + icon to add Appliances</Text>
              </View>
            </View>
          </View>
        }

        {/* Floating Button */}
        <Pressable
          style={styles.floatingButton}
          onPress={() => navigation.navigate('AddCompartmentAppliances', { items })}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CompartmentAppliance