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

const Locks = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [compartmentId, setCompartmentId] = useState(route.params?.items?.compartment_id || null);
  const items = route.params?.items || {};
  const intervalRef = useRef(null);
  const scheduleUpdateIntervalRef = useRef(null);

  const List_Compartment_lock_by_compartment_id = useCallback(async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${URL}/List_Compartment_lock_by_compartment_id/${id}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);

        const initialToggles = {};
        result.forEach(item => {
          initialToggles[item.Compartment_Lock_id] = item.status === 1;
        });
        setToggleStates(initialToggles);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  const handleToggle = useCallback(async (id, Compartment_Lock_id) => {
    const newStatus = !toggleStates[id];
    setToggleStates(prev => ({ ...prev, [id]: newStatus }));

    const payload = { id: Compartment_Lock_id, status: newStatus ? 1 : 0 };

    try {
      const res = await fetch(`${URL}/Update_Compartment_Lock_status`, {
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
      const id = item.Compartment_Lock_id;
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
          fetch(`${URL}/Update_Compartment_Lock_status`, {
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
    if (items?.compartment_id) {
      storage.set('compartment_id', Number(items.compartment_id));
    }
    const storedId = storage.getNumber('compartment_id');
    if (storedId) setCompartmentId(storedId);
  }, [items?.compartment_id]);
  
  useFocusEffect(
    useCallback(() => {
      if (!compartmentId) return;
      
      List_Compartment_lock_by_compartment_id(compartmentId);

      if (compartmentId) {
        intervalRef.current = setInterval(() => {
          List_Compartment_lock_by_compartment_id(compartmentId);
        }, 1000);
      }
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [compartmentId])
  );

  useEffect(() => {
    if (data.length > 0) {
      const allOn = data.every(item => toggleStates[item.Compartment_Lock_id]);
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
        onPress={() => navigation.navigate('LockSchedules', { items: item })}
      >
        <Text style={[styles.listText]} numberOfLines={null} ellipsizeMode="tail">{item.name}</Text>
        <TouchableOpacity
        onPress={() => navigation.navigate('EditLocks', { items: item })}
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
          thumbColor={toggleStates[item.Compartment_Lock_id] ? '#001F6D' : '#B0B7C3'}
          onValueChange={() =>
            handleToggle(
              item.Compartment_Lock_id,
              item.Compartment_Lock_id
            )
          }
          ios_backgroundColor="transparent"
          value={toggleStates[item.Compartment_Lock_id]}
          style={styles.switch}
        />
      </View>
    </View>
  ), [toggleStates]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
      <View style={[styles.navbar]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 0.90, justifyContent: 'center' }}>
          <Text style={styles.navbarText}>Locks</Text>
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

      <View style={{ flex: 7, position: 'relative' }}>
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
              <Text style={[styles.listText, { fontSize: 17 }]}>Please Add Locks</Text>
              <View>
                <View style={styles.infoIcon}>
                  <Text style={styles.infoText}>!</Text>
                </View>
              </View>
            </View>
            <View style={{ padding: '10%', backgroundColor: '' }}>
              <Text style={{ fontSize: 15 }}>Note :</Text>
              <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                <Text style={[styles.listText, { color: 'black', fontSize: 16, marginLeft: 0 }]}>No Locks available</Text>
                <Text style={[styles.listText, { color: 'black', fontSize: 15, marginLeft: 6, marginTop: 15 }]}>Please press Add button to add Locks</Text>
              </View>
            </View>
          </View>
        }

      </View>

      <View style={[styles.Bottombtn, {
        padding: 18,
        flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1.5,
        borderColor: 'darkblue', borderRadius: 12, outlineColor: '#B0B7C3', outlineWidth: 1,
        outlineStyle: 'solid', backgroundColor: '#B0B7C3'
      }]}>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'maroon', width: '35%', marginStart: 20 }]}
          onPress={() => navigation.navigate('LockSchedules', { items: compartmentId })}>
          <Text style={[styles.buttonText, { fontSize: 17 }]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#001F6D', width: '35%', marginEnd: 20 }]}
          onPress={() => navigation.navigate('AddLocks', { items })}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Locks