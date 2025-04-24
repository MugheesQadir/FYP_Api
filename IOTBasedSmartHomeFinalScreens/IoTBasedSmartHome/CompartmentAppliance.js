import {
  Text, View, TouchableOpacity, Pressable,
  KeyboardAvoidingView, Platform, FlatList,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const storage = new MMKV();

const CompartmentAppliance = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [compartmentId, setCompartmentId] = useState(route.params?.items?.compartment_id || null);
  const items = route.params?.items || {};
  const intervalRef = useRef(null);

  const getCompartmentApplianceByCompartmentId = useCallback(async (id) => {
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
  }, []);

  const handleToggle = useCallback(async (id, Compartment_Appliance_id) => {
    const newStatus = !toggleStates[id];
    setToggleStates(prev => ({ ...prev, [id]: newStatus }));

    const payload = { id: Compartment_Appliance_id, status: newStatus ? 1 : 0 };

    try {
      const res = await fetch(`${URL}/Update_Compartment_Appliance_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setToggleStates(prev => ({ ...prev, [id]: !newStatus }));
    }
  }, [toggleStates]);

  const handleSelectAll = useCallback(async () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedToggles = {};
    const updates = [];

    for (let item of data) {
      const id = item.Compartment_Appliance_id;
      if (toggleStates[id] !== newSelectAll) { // Only update if needed
        updatedToggles[id] = newSelectAll;
        updates.push({
          id,
          status: newSelectAll ? 1 : 0
        });
      }
    }

    setToggleStates(prev => ({ ...prev, ...updatedToggles }));

    try {
      await Promise.all(
        updates.map(payload =>
          fetch(`${URL}/Update_Compartment_Appliance_status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        )
      );
    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  }, [data, selectAll, toggleStates]);

  useEffect(() => {
    const storedId = storage.getNumber('compartment_id');
    if (storedId) setCompartmentId(storedId);
    if (items?.compartment_id) {
      storage.set('compartment_id', Number(items.compartment_id));
      setCompartmentId(items.compartment_id);
    }
  }, [items]);

useFocusEffect(
  useCallback(() => {
    if (compartmentId) {
      intervalRef.current = setInterval(() => {
        getCompartmentApplianceByCompartmentId(compartmentId);
      }, 200);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [compartmentId, getCompartmentApplianceByCompartmentId])
);

  useEffect(() => {
    if (data.length > 0) {
      const allOn = data.every(item => toggleStates[item.Compartment_Appliance_id]);
      setSelectAll(allOn);
    }
  }, [toggleStates, data]);

  const FlatListData = useCallback(({ item }) => (
    <View style={styles.row}>
      <Pressable style={[styles.listItem, {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '75%',
        marginHorizontal: 0,
      },]}
        onPress={() => navigation.navigate('ApplianceSchedules', { items: item })}
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
              item.Compartment_Appliance_id
            )
          }
          ios_backgroundColor="transparent"
          value={toggleStates[item.Compartment_Appliance_id]}
          style={styles.switch}
        />
      </View>
    </View>
  ), [toggleStates]);

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
      
      <View style={{ marginBottom: 10, flexDirection: 'row', }}>
        <Text style={{ marginLeft: 30, textAlign: 'center', fontSize: 15, fontWeight: '600', fontStyle: 'italic', marginTop: 3 }}>{items.compartment_name}</Text>
        <View style={{ flexDirection: 'row', width: '59%', justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 15, fontWeight: '400', fontStyle: 'italic', marginTop: 3, marginLeft: 20 }}>Select All</Text>
          <View style={[styles.switchContainer, { marginBottom: 0 }]}>
            <View style={styles.simulatedBorder} />
            <Switch
              trackColor={{ false: 'transparent', true: 'transparent' }}
              thumbColor={selectAll ? '#001F6D' : '#B0B7C3'}
              ios_backgroundColor="transparent"
              value={selectAll}
              onValueChange={handleSelectAll}
              style={styles.switch}
            />
          </View>

        </View>
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
        {data.length > 0 ?
          <FlatList
            data={data}
            renderItem={FlatListData}
            contentContainerStyle={{ paddingBottom: 100 }}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
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

      </View>
      <Pressable
  onPress={() => navigation.navigate('Locks', { items: items })}
  style={({ pressed }) => ({
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom:10,
    marginLeft:30,
    borderRadius: 8,
    backgroundColor: pressed ? '#e6e9f0' : 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: pressed ? 0.15 : 0,
    shadowRadius: 1,
  })}
>
  <Text style={{
    color: '#001F6D',
    textDecorationLine: 'underline',
    fontSize: 17,
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  }}>
    🔒 Locks
  </Text>
</Pressable>
      <View style={[styles.Bottombtn, {
        backgroundColor: 'white', padding: 18, bottom: 0, position: '',
        flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '0%', borderWidth: 1.5,
        borderColor: 'darkblue', borderRadius: 12,
        outlineColor: '#B0B7C3',
        outlineWidth: 1,
        outlineStyle: 'solid', backgroundColor: '#B0B7C3'
      }]}>
        <View style={{ backgroundColor: '#001F6D', padding: 10, marginLeft: 0, width: '35%', borderRadius: 10, }}>
          <TouchableOpacity
          onPress={() => navigation.navigate('ApplianceSchedules', { items: compartmentId })}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={{ position: '', backgroundColor: '#001F6D', padding: 10, marginRight: 0, width: '35%', borderRadius: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddCompartmentAppliances', { items })}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CompartmentAppliance