import {
  Text, View, TouchableOpacity, Pressable,
  KeyboardAvoidingView, Platform, FlatList,
  Switch,TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';
import EmergencyAlert from './EmergencyAlert';

const storage = new MMKV();

const CompartmentAppliance = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [compartmentId, setCompartmentId] = useState(route.params?.items?.compartment_id || null);
  const items = route.params?.items || {};
  const intervalRef = useRef(null);
  const [msg, setmasg] = useState('')
  const [sortMode, setSortMode] = useState('all'); // 'all' or 'activeOnly'
  const [searchText, setSearchText] = useState('');


  const [emergencyVisible, setEmergencyVisible] = useState(false);

  const getCompartmentApplianceByCompartmentId = useCallback(async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${URL}/get_compartment_appliance_with_compartment_id/${id}`);
      if (response.ok) {
        const result = await response.json();

        // Sort data if 'activeOnly' mode
        const sortedData = sortMode === 'activeOnly'
          ? [...result].sort((a, b) => b.status - a.status)
          : result;

        setData(sortedData);

        // Update switches
        const initialToggles = {};
        sortedData.forEach(item => {
          initialToggles[item.Compartment_Appliance_id] = item.status === 1;
        });
        setToggleStates(initialToggles);

      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, [sortMode]);


  const handleToggle = useCallback(async (id, Compartment_Appliance_id) => {
    const newStatus = !toggleStates[id];
    if (newStatus) {
      check_peak_time_Alert_and_suggest_best_Time()
    }
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
    if (newSelectAll) {
      check_peak_time_Alert_and_suggest_best_Time()
    }
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

  useFocusEffect(
    useCallback(() => {
      if (items?.compartment_id) {
        storage.set('compartment_id', Number(items.compartment_id));
      }
      const storedId = storage.getNumber('compartment_id');
      if (storedId) setCompartmentId(storedId);
    }, [items?.compartment_id])
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!compartmentId) return;

  //     getCompartmentApplianceByCompartmentId(compartmentId);

  //     intervalRef.current = setInterval(() => {
  //       getCompartmentApplianceByCompartmentId(compartmentId);
  //     }, 1000);

  //     return () => {
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }
  //     };
  //   }, [compartmentId])
  // );

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
        <View style={{}}>
          {/* {item.appliance_power > 500 && (
          <Text style={{ color: 'white', fontSize: 13, marginBottom: 6 }}>
            Best Time : 9Am to 5PM
          </Text>
        )} */}

          <Text style={[styles.listText]}>{item.name}</Text>
        </View>
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

  const check_peak_time_Alert_and_suggest_best_Time = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/check_peak_time_Alert_and_suggest_best_Time`);
      if (response.ok) {
        const result = await response.json();

        // Check if warning message exists
        if (result.warning) {
          // Alert.alert(
          //   '⚡ Peak Hour Alert',
          //   `${result.warning}\nCurrent Time : ${result["Now time"]}`
          // );
          setmasg(result.warning)
          setEmergencyVisible(true)
        }

        // Optionally return the result if needed outside
        return result;

      } else {
        console.error('❌ Failed to fetch data');
      }
    } catch (error) {
      console.error('🔥 Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    if (compartmentId) {
      getCompartmentApplianceByCompartmentId(compartmentId);
    }
  }, [sortMode]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
      <View style={[styles.navbar]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 0.90, justifyContent: 'center' }}>
          <Text style={styles.navbarText}>Appliances</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', margin: 10 }}>
        <TouchableOpacity
          onPress={() => setSortMode('all')}
          style={{ marginLeft: 50, flexDirection: 'row', justifyContent: 'flex-start' }}
        >
          <Text style={{ fontSize: 16 }}>OFF</Text>
          <Icon name="arrow-down" size={22} color={sortMode === 'all' ? '#001F6D' : 'gray'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortMode('activeOnly')}
          style={{ marginLeft: 100, flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          <Text style={{ fontSize: 16 }}>ON</Text>
          <Icon name="arrow-up" size={22} color={sortMode === 'activeOnly' ? '#001F6D' : 'gray'} />
        </TouchableOpacity>
      </View>


      <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: '600', fontStyle: 'italic' }}>{items.compartment_name}</Text>
        <View style={{ flexDirection: 'row', width: '59%', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '400', fontStyle: 'italic', }}>Select All</Text>
          <View style={[styles.switchContainer]}>
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
        {/* {data.length > 0 ?
          <FlatList
            data={data}
            renderItem={FlatListData}
            contentContainerStyle={{ paddingBottom: 100 }}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          /> */}
        {data.length > 0 ? (
          <>
            {/* 👇 Search Input Here */}
            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
              <TextInput
                placeholder="Search Appliances..."
                value={searchText}
                onChangeText={setSearchText}
                style={{
                  height: 45,
                  borderColor: '#001F6D',
                  borderWidth: 1.2,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  backgroundColor: 'white',
                  color: 'black'
                }}
                placeholderTextColor="#777"
              />
            </View>

            {/* FlatList rendering filtered results */}
            <FlatList
              data={data.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
              )}
              renderItem={FlatListData}
              contentContainerStyle={{ paddingBottom: 100 }}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
            />
          </>
        )
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
            <View style={{ padding: '10%' }}>
              <Text style={{ fontSize: 15 }}>Note :</Text>
              <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                <Text style={[styles.listText, { color: 'black', fontSize: 16, marginLeft: 0 }]}>No Appliances available</Text>
                <Text style={[styles.listText, { color: 'black', fontSize: 15, marginLeft: 6, marginTop: 15 }]}>Please press Add button to add Appliances</Text>
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
          marginBottom: 10,
          marginLeft: 30,
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
        padding: 18,
        flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1.5,
        borderColor: 'darkblue', borderRadius: 12, outlineColor: '#B0B7C3', outlineWidth: 1,
        outlineStyle: 'solid', backgroundColor: '#B0B7C3'
      }]}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#78081C', width: '35%', marginStart: 20 }]}
          onPress={() => navigation.navigate('ApplianceSchedules', { items: compartmentId })}>
          <Text style={[styles.buttonText, { fontSize: 17 }]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { width: '35%', marginEnd: 20 }]}
          onPress={() => navigation.navigate('AddCompartmentAppliances', { items })}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <EmergencyAlert
        visible={emergencyVisible}
        onClose={() => setEmergencyVisible(false)}
        title='⚡PEAK HOUR ALERT'
        message={msg}
      />
    </KeyboardAvoidingView>
  );
}

export default CompartmentAppliance