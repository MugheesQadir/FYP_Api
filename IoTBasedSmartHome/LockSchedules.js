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

const LockSchedules = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const items = route.params?.items || {};
    const [Compartment_Lock_id, Set_Compartment_Lock_id] = useState(null);
    const [compartment_id, setCompartmentId] = useState(null);

    const setStorageData = useCallback(() => {
        if (items?.Compartment_Lock_id) {
            storage.set('compartment_lock_id', Number(items.Compartment_Lock_id));
        }
        if (typeof items === 'number') {
            storage.set('compartment_id', Number(items));
        }
    }, [items]);

    const getStorageData = useCallback(() => {
        const storedId = storage.getNumber('compartment_lock_id');
        const storedComId = storage.getNumber('compartment_id');
        if (storedId) Set_Compartment_Lock_id(storedId);
        if (storedComId) setCompartmentId(storedComId);
    }, []);

    const List_Lock_Schedule_by_compartment_lock_id = useCallback(async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/List_Lock_Schedule_by_compartment_lock_id/${id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching table_id:', error);
        }
    }, []);

    const list_Lock_schedule_by_compartment_id = useCallback(async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/list_Lock_schedule_by_compartment_id/${id}`);
            if (response.ok) {
                const result = await response.json();
                const uniqueData = result.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => (
                            t.name === item.name &&
                            t.start_time === item.start_time &&
                            t.end_time === item.end_time &&
                            t.days === item.days &&
                            t.lock_type === item.lock_type
                        ))
                );
                setData(uniqueData);

            }
        } catch (error) {
            console.error('Error fetching compartment_id:', error);
        }
    }, []);

    // ✅ 
    useFocusEffect(
        useCallback(() => {
            if (typeof items === 'object' && items?.Compartment_Lock_id) {
                setStorageData();
                Set_Compartment_Lock_id(items.Compartment_Lock_id);
                List_Lock_Schedule_by_compartment_lock_id(items.Compartment_Lock_id);
            } 
            if (typeof items === 'number') {
                setStorageData()
                setCompartmentId(items);
                list_Lock_schedule_by_compartment_id(items);
            }
            if (!items) {
                getStorageData();
                if (Compartment_Lock_id) {
                    List_Lock_Schedule_by_compartment_lock_id(Compartment_Lock_id);
                } 
                if (compartment_id) {
                    list_Lock_schedule_by_compartment_id(compartment_id);
                }
            }
        }, [Compartment_Lock_id, compartment_id, items])
    );

    const FlatListData = useCallback(({ item }) => (
        <Pressable style={[styles.listItem]}
        //  onPress={() => navigation.navigate('CompartmentAppliance', { items: item })}
        >
            <Text style={styles.listText}>{item.name}</Text>
            <TouchableOpacity
            onPress={() => navigation.navigate('EditLockSchedule', { items: item })}
            >
                <View style={styles.infoIcon}>
                    <Text style={styles.infoText}>i</Text>
                </View>
            </TouchableOpacity>
        </Pressable>
    ));

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
            <View style={[styles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90,justifyContent:'center' }}>
                        <Text style={styles.navbarText}>Schedules</Text>
                    </View>
                </View>

            <View style={{ flex: 1 }}>
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
                            <Text style={[styles.listText, { fontSize: 17 }]}>Please Add Schedules</Text>
                            <View>
                                <View style={styles.infoIcon}>
                                    <Text style={styles.infoText}>!</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: '10%', backgroundColor: '' }}>
                            <Text style={{ fontSize: 15 }}>Note :</Text>
                            <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                                <Text style={[styles.listText, { color: 'black', fontSize: 16, marginLeft: 0 }]}>No Schedule available</Text>
                                <Text style={[styles.listText, { color: 'black', fontSize: 15, marginLeft: 6, marginTop: 15 }]}>Please press + icon to add Schedule</Text>
                            </View>
                        </View>
                    </View>
                }


                {/* Floating Button */}
                <Pressable
                    style={styles.floatingButton}
                    onPress={() => navigation.navigate('AddLockSchedule', { items:items })}
                >
                    <Text style={styles.floatingButtonText}>+</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LockSchedules;
