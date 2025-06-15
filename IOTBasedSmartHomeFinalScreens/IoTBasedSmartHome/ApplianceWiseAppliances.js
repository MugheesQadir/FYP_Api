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

const ApplianceWiseAppliances = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const [toggleStates, setToggleStates] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [compartmentId, setCompartmentId] = useState(
        route.params?.selectedCompartments || JSON.parse(storage.getString('selectedCompartments') || '[]')
    );
    const [catagory, setCategory] = useState(
        route.params?.selectedCategory || storage.getString('selectedCategory')
    );

    const items = route.params?.items || {};
    const intervalRef = useRef(null);

    const get_compartment_appliances_for_appliance_wise_scheduling_by_category_and_compartments_ki_List = useCallback(async (catagoory, compartmentIdd) => {
        if (!catagoory || !compartmentIdd || compartmentIdd.length === 0) return;

        try {
            const response = await fetch(`${URL}/get_compartment_appliances_for_appliance_wise_scheduling_by_category_and_compartments_ki_List`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: catagoory,
                    compartment_ids: compartmentIdd,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('API Response:', result);

                if (Array.isArray(result)) {
                    setData(result);

                    const initialToggles = {};
                    result.forEach(item => {
                        initialToggles[item.Compartment_Appliance_id] = item.status === 1;
                    });
                    setToggleStates(initialToggles);
                } else if (result.error) {
                    console.warn('API returned error:', result.error);
                    setData([]); // Clear the data if nothing found
                    setToggleStates({});
                } else {
                    console.error('Unexpected response structure:', result);
                }
            } else {
                console.error('Failed to fetch data: ', response.status);
            }
        } catch (error) {
            console.error('Error fetching data: ', error.message);
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

    // useFocusEffect(
    //     useCallback(() => {
    //         if (items?.compartment_id) {
    //             storage.set('compartment_id', Number(items.compartment_id));
    //         }
    //         const storedId = storage.getNumber('compartment_id');
    //         // if (storedId) setCompartmentId(storedId);
    //     }, [items?.compartment_id])
    // );

    // useFocusEffect(
    //     useCallback(() => {
    //         if (!catagory || !compartmentId || compartmentId.length === 0) return;

    //         if (!Array.isArray(compartmentId) || compartmentId.length === 0 || !catagory) {
    //             console.log("No compartments or category selected");
    //             setData([]); // Reset data
    //             return;
    //         }

    //         get_compartment_appliances_for_appliance_wise_scheduling_by_category_and_compartments_ki_List(catagory, compartmentId);

    //         intervalRef.current = setInterval(() => {
    //             get_compartment_appliances_for_appliance_wise_scheduling_by_category_and_compartments_ki_List(catagory, compartmentId);
    //         }, 3000);

    //         return () => {
    //             clearInterval(intervalRef.current);
    //             intervalRef.current = null;
    //         };
    //     }, [catagory, compartmentId])
    // );

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            let timeoutId;

            const fetchAndSchedule = async () => {
                if (!isMounted) return;

                await get_compartment_appliances_for_appliance_wise_scheduling_by_category_and_compartments_ki_List(catagory, compartmentId);

                if (isMounted) {
                    timeoutId = setTimeout(fetchAndSchedule, 3000); // call every 3 seconds instead of 200ms
                }
            };

            if (catagory && compartmentId && Array.isArray(compartmentId) && compartmentId.length > 0) {
                fetchAndSchedule();
            } else {
                console.log("No compartments or category selected");
                setData([]);
            }

            return () => {
                isMounted = false;
                clearTimeout(timeoutId);
            };
        }, [catagory, compartmentId])
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

    const groupedData = data.reduce((acc, item) => {
        const compartmentId = item.compartment_id;
        if (!acc[compartmentId]) {
            acc[compartmentId] = {
                compartmentName: item.compartment_name,
                appliances: [],
            };
        }
        acc[compartmentId].appliances.push(item);
        return acc;
    }, {});

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
                {Array.isArray(data) && data.length > 0 ? (
                    // Group the data by compartment
                    <FlatList
                        data={Object.entries(groupedData)}
                        // keyExtractor={([compartmentId]) => compartmentId}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        renderItem={({ item: [compartmentId, group] }) => (
                            <View>
                                <Text style={{
                                    marginLeft: 25,
                                    fontSize: 15,
                                    fontWeight: '600',
                                    fontStyle: 'italic',
                                    paddingVertical: 8
                                }}>
                                    {group.compartmentName}
                                </Text>

                                {/* Appliances List */}
                                {group.appliances.map((item) => (
                                    <FlatListData item={item} key={item.Compartment_Appliance_id} />
                                ))}
                            </View>
                        )}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={true}
                    />
                ) : (
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
                )}
            </View>

            <View style={[styles.Bottombtn, {
                padding: 18,
                flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1.5,
                borderColor: 'darkblue', borderRadius: 12, outlineColor: '#B0B7C3', outlineWidth: 1,
                outlineStyle: 'solid', backgroundColor: '#B0B7C3'
            }]}>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#78081C', width: '35%', marginStart: 20 }]}
                    onPress={() => navigation.navigate('ApplianceSchedules', {
                        compartmentId: compartmentId,
                        catagory: catagory
                        // fromCustomNavigation: true
                    })}

                >
                    <Text style={[styles.buttonText, { fontSize: 17 }]}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#001F6D', width: '35%', marginEnd: 20 }]}
                    onPress={() => navigation.navigate('AddCompartmentAppliances', { items })}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default ApplianceWiseAppliances