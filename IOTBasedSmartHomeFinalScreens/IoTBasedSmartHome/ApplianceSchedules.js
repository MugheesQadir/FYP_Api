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

const ApplianceSchedules = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const items = route.params?.items || {};
    const [Compartment_Appliance_id, Set_Compartment_Appliance_id] = useState(null);
    const [compartment_id, setCompartmentId] = useState(null);
    const [flag, setFalg] = useState(0)

    const [Compartment_ids_list, set_Compartment_Ids_list] = useState([])
    const [App_catgry, setCatagory] = useState(null)

    const getStorageData = useCallback(() => {
        const storedId = storage.getNumber('compartment_appliance_id');
        const storedComId = storage.getNumber('compartment_id');
        if (storedId) Set_Compartment_Appliance_id(storedId);
        if (storedComId) setCompartmentId(storedComId);
    }, []);

    const Get_Appliance_Schedule_By_table_id = useCallback(async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/Get_Appliance_Schedule_By_table_id/${id}/0`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching table_id:', error);
        }
    }, []);

    const Get_Appliance_Schedule_By_compartment_id = useCallback(async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/list_Appliance_Schedule_By_comaprtment_id/${id}`);
            if (response.ok) {
                const result = await response.json();

                const uniqueData = result.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) =>
                            t.name === item.name &&
                            t.start_time === item.start_time &&
                            t.end_time === item.end_time &&
                            t.days === item.days &&
                            t.type === item.type
                        )
                );
                setData(uniqueData);
            }

        } catch (error) {
            console.error('Error fetching compartment_id:', error);
        }
    }, []);

    const List_Appliance_Schedules_with_Appiance_wise = useCallback(async (compartment_ids, category) => {
        if (!compartment_ids || !Array.isArray(compartment_ids) || compartment_ids.length === 0) return;

        try {
            const response = await fetch(`${URL}/List_Appliance_Schedules_with_Appiance_wise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: category,
                    compartment_ids: compartment_ids,
                    type: 0
                })
            });

            if (response.ok) {
                const result = await response.json();

                if (Array.isArray(result)) {
                    const uniqueData = result.filter(
                        (item, index, self) =>
                            index === self.findIndex((t) =>
                                t.name === item.name &&
                                t.start_time === item.start_time &&
                                t.end_time === item.end_time &&
                                t.days === item.days &&
                                t.type === item.type
                            )
                    );
                    setData(uniqueData);
                } else {
                    console.warn("Unexpected response format:", result);
                    setData([]); // clear list or handle UI gracefully
                }
            }


        } catch (error) {
            console.error('Error fetching appliance schedules:', error);
        }
    }, []);

    useEffect(()=>{},[App_catgry,Compartment_ids_list])

    useFocusEffect(
        useCallback(() => {
            // Case 3: Check for new navigation format
            if (route.params?.compartmentId && route.params?.catagory) {
                set_Compartment_Ids_list(route.params.compartmentId);
                setCatagory(route.params.catagory);
                if (Array.isArray(Compartment_ids_list)) {
                    if (App_catgry && Compartment_ids_list) {
                        List_Appliance_Schedules_with_Appiance_wise(Compartment_ids_list, App_catgry);
                        return;
                    }
                }
                setFalg(1)
            }

            // Case 1: items is an object (single appliance)
            if (typeof items === 'object' && items?.Compartment_Appliance_id) {
                Get_Appliance_Schedule_By_table_id(items.Compartment_Appliance_id);
                return;
            }

            // Case 2: items is a number (compartment ID)
            if (typeof items === 'number') {
                Get_Appliance_Schedule_By_compartment_id(items);
                return;
            }

            // Fallback: from storage
            if (!items && !route.params?.compartmentId && !route.params?.catagory) {
                getStorageData();
                if (Compartment_Appliance_id) {
                    Get_Appliance_Schedule_By_table_id(Compartment_Appliance_id);
                }
                if (compartment_id) {
                    Get_Appliance_Schedule_By_compartment_id(compartment_id);
                }
            }

        }, [items, route.params])
    );

    const pressAddButton = () => {
        if (flag === 1) {
            navigation.navigate('AddApplianceSchedule', {
                compartmentId: Compartment_ids_list,
                catagory: App_catgry
                // fromCustomNavigation: true
            })
        }
        else {
            navigation.navigate('AddApplianceSchedule', { items: items })
        }
    }


    const FlatListData = useCallback(({ item }) => (
        <Pressable style={[styles.listItem]}
        //  onPress={() => navigation.navigate('CompartmentAppliance', { items: item })}
        >
            <Text style={styles.listText}>{item.name}</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('EditApplianceSchedule', { items: item })}
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
                <View style={{ flex: 0.90, justifyContent: 'center' }}>
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
                    onPress={pressAddButton}
                >
                    <Text style={styles.floatingButtonText}>+</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ApplianceSchedules;
