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

const Compartment = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const [items, setItems] = useState(route.params?.items || {});
    const [home_id, sethomeId] = useState(items?.home_id || null);

    const setStorageData = () => {
        if (items?.home_id) {
            storage.set('home_id', Number(items.home_id));
        }
    };

    const getStorageData = () => {
        const storedId = storage.getNumber('home_id');
        if (storedId !== undefined) {
            sethomeId(storedId);
        }
    };

    const getCompartmentByHomeId = async (home_id) => {
        if (!home_id) return;
        try {
            const response = await fetch(`${URL}/List_Compartment_By_Home_Id/${home_id}`);
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
        if (items?.home_id) {
            setStorageData();
            getCompartmentByHomeId(items.home_id);
        }
    }, [items]);

    // ✅ 
    useFocusEffect(
        useCallback(() => {
            getStorageData();
            if (home_id) getCompartmentByHomeId(home_id);
        }, [home_id])
    );

    const FlatListData = ({ item }) => (
        <Pressable style={[styles.listItem]} onPress={() => navigation.navigate('CompartmentAppliance', { items: item })}>
            <Text style={styles.listText}>{item.compartment_name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditCompartment', { items: item })}>
                <View style={styles.infoIcon}>
                    <Text style={styles.infoText}>i</Text>
                </View>
            </TouchableOpacity>
        </Pressable>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.replace('Home')}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.navbarText, { marginRight: 25 }]}>Compartment</Text>
                </View>
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
                            <Text style={[styles.listText, { fontSize: 17 }]}>Please Add Compartment</Text>
                            <View>
                                <View style={styles.infoIcon}>
                                    <Text style={styles.infoText}>!</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: '10%', backgroundColor: '' }}>
                            <Text style={{ fontSize: 15 }}>Note :</Text>
                            <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                                <Text style={[styles.listText, { color: 'black', fontSize: 16, marginLeft: 0 }]}>No Compartment available</Text>
                                <Text style={[styles.listText, { color: 'black', fontSize: 15, marginLeft: 6, marginTop: 15 }]}>Please press + icon to add Compartment</Text>
                            </View>
                        </View>
                    </View>
                }


                {/* Floating Button */}
                <Pressable
                    style={styles.floatingButton}
                    onPress={() => navigation.navigate('AddCompartment', { items })}
                >
                    <Text style={styles.floatingButtonText}>+</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Compartment;
