import {
  Text, View, TouchableOpacity, Pressable,
  KeyboardAvoidingView, Platform, FlatList,
  Alert
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import URL from './Url';

const storage = new MMKV();



const CompartmentAppliance = ({ navigation, route }) => {
  const [data, setData] = useState([]);
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
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
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
    <Pressable style={[styles.listItem,{outlineColor:'darkblue',
      outlineWidth:2,
      outlineStyle:'solid',}]}
    // onPress={() => navigation.navigate('Compartment', { items: item })}
    >
      <Text style={styles.listText}>{item.name}</Text>
      <TouchableOpacity
      // onPress={() => navigation.navigate('EditCompartment', { items: item })}
      >
        <View style={styles.infoIcon}>
          <Text style={styles.infoText}>i</Text>
        </View>
      </TouchableOpacity>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
      <View style={[styles.navbar, { borderWidth: 1, borderRadius: 15, borderColor: 'lightgray' }]}>
        <TouchableOpacity
        // onPress={() => navigation.replace('Home')}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navbarText, { marginRight: 25 }]}>Appliances</Text>
        </View>
      </View>
      <View style={{ marginLeft: 30, marginTop: 3, marginBottom: 3 }}>
        <Text style={{ fontSize: 15, fontWeight: '400', fontStyle: 'italic', marginTop: 10 }}>{items.compartment_name}</Text>
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