import {
    Text, View, TouchableOpacity, Pressable,
    KeyboardAvoidingView, Platform, FlatList,
    Alert, ScrollView, SectionList
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import URL from './Url';
import CompartmentAppliance from './CompartmentAppliance';


const storage = new MMKV();

const CompartmentApplianceRecord = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const items = route.params?.items || {};
    const sectionListRef = useRef(null);

    const [Compartment_Appliance_id, Set_Compartment_Appliance_id] = useState(null);
    const [compartment_id, setCompartmentId] = useState(null);
    const [flag, setFalg] = useState(0)
    
    const [Compartment_ids_list, set_Compartment_Ids_list] = useState([])
    const [App_catgry, setCatagory] = useState(null)


    // const renderItem = ({ item }) => (
    //     <View style={[styles.logrow,{justifyContent:'space-evenly'}]}>
    //         <Text style={styles.logcell}>{item.name}</Text>
    //         <Text style={styles.logcell}>{item.start_time}</Text>
    //         <Text style={styles.logcell}>{item.end_time}</Text>
    //         <Text style={styles.logcell}>{item.duration_minutes}</Text>
    //         <Text style={styles.logcell}>{item.date.split('T')[0]}</Text>
    //         <Text style={styles.logcell}>{item.day_}</Text>
    //     </View>
    // );

    function groupByDate(logs) {
        if (!Array.isArray(logs)) {
            console.warn('⚠️ logs is not an array:', logs);
            return [];
        }

        const grouped = {};

        logs.forEach(item => {
            if (!grouped[item.date]) {
                grouped[item.date] = {
                    title: item.date,
                    data: [],
                    total_duration: 0,
                    power: 0
                };
            }

            grouped[item.date].data.push(item);

            const duration = parseInt(item.duration_minutes) || 0;
            grouped[item.date].total_duration += duration;

            const consumptions = parseInt(item.consumption) || 0;
            grouped[item.date].power += consumptions;
        });

        return Object.values(grouped);
    }

    const list_compartment_appliance_logs_by_compartment_appliance_id = useCallback(async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/list_compartment_appliance_logs_by_compartment_appliance_id/${id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching table_id:', error);
        }
    }, []);

    const list_compartment_appliance_logs_by_compartment_id = useCallback(async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/list_compartment_appliance_logs_by_compartment_id/${id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching table_id:', error);
        }
    }, []);

    const List_Compartment_appliance_Log_By_Category_And_Compartment_ids_list = useCallback(async (compartment_ids, category) => {
        if (!compartment_ids || !Array.isArray(compartment_ids) || compartment_ids.length === 0) return;

        try {
            const response = await fetch(`${URL}/List_Compartment_appliance_Log_By_Category_And_Compartment_ids_list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: category,
                    compartment_ids: compartment_ids,
                })
            });

            if (response.ok) {
                const result = await response.json();

                // if (Array.isArray(result)) {
                //     const uniqueData = result.filter(
                //         (item, index, self) =>
                //             index === self.findIndex((t) =>
                //                 t.name === item.name &&
                //                 t.start_time === item.start_time &&
                //                 t.end_time === item.end_time &&
                //                 t.days === item.days &&
                //                 t.type === item.type
                //             )
                //     );
                    setData(result);
            } else {
                    console.warn("Unexpected response format:", result);
                    setData([]); // clear list or handle UI gracefully
                }

        } catch (error) {
            console.error('Error fetching appliance schedules:', error);
        }
    }, []);
    

    useFocusEffect(
        useCallback(() => {
            // Case 3: Check for new navigation format
            if (route.params?.compartmentId && route.params?.catagory) {
                set_Compartment_Ids_list(route.params.compartmentId);
                setCatagory(route.params.catagory);
                if (Array.isArray(Compartment_ids_list)) {
                    if (App_catgry && Compartment_ids_list) {
                        List_Compartment_appliance_Log_By_Category_And_Compartment_ids_list(Compartment_ids_list, App_catgry);
                        return;
                    }
                }
                setFalg(1)
            }

            // Case 1: items is an object (single appliance)
            if (typeof items === 'object' && items?.Compartment_Appliance_id) {
                list_compartment_appliance_logs_by_compartment_appliance_id(items.Compartment_Appliance_id);
                return;
            }

            // Case 2: items is a number (compartment ID)
            if (typeof items === 'number') {
                list_compartment_appliance_logs_by_compartment_id(items);
                return;
            }

        }, [items, route.params])
    );

    const scrollToDate = (targetDate) => {
        const sections = groupByDate(data);
        const index = sections.findIndex(section => section.title === targetDate);
        if (index !== -1 && sectionListRef.current) {
            sectionListRef.current.scrollToLocation({ sectionIndex: index, itemIndex: 0, animated: true });
        } else {
            Alert.alert("Date not found", "No logs found for selected date.");
        }
    };



    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
            <View style={[styles.navbar]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.navbarText}>Appliance Records</Text>
                </View>

                <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                    <Icon name="more-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {/* <TouchableOpacity onPress={() => scrollToDate("2025-07-05")}>
                <Text style={{ color: 'blue', padding: 10 }}>Jump to 2025-07-04</Text>
            </TouchableOpacity> */}


            <ScrollView horizontal style={styles.scrollWrapper}>
                <View style={[styles.logcontainer]}>
                    <View style={[styles.logrow, styles.logheader,{justifyContent:'space-evenly'}]}>
                        <Text style={styles.logheaderText}>Name</Text>
                        <Text style={styles.logheaderText}>Start Time</Text>
                        <Text style={styles.logheaderText}>End Time</Text>
                        <Text style={styles.logheaderText}>Duration (min)</Text>
                        {/* <Text style={styles.logheaderText}>Date</Text> */}
                        <Text style={styles.logheaderText}>Day</Text>
                        <Text style={styles.logheaderText}>Message</Text>
                        <Text style={styles.logheaderText}>Consumption</Text>
                    </View>

                    {data.length > 0 ?
                    
                        <SectionList
                            ref={sectionListRef}
                            sections={groupByDate(data)}
                            keyExtractor={(item, index) => item.id.toString() + index}
                            renderItem={({ item }) => (
                                <View style={[styles.logrow,{justifyContent:'space-evenly'}]}>
                                    <Text style={styles.logcell}>{item.name}</Text>
                                    <Text style={styles.logcell}>{item.start_time}</Text>
                                    <Text style={styles.logcell}>{item.end_time}</Text>
                                    <Text style={styles.logcell}>{item.duration_minutes}</Text>
                                    {/* <Text style={styles.logcell}>{item.date}</Text> */}
                                    <Text style={styles.logcell}>{item.day_}</Text>
                                    <Text style={styles.logcell}>{item.messagee}</Text>
                                    <Text style={styles.logcell}>{item.consumption}</Text>
                                </View>
                            )}
                            renderSectionHeader={({ section }) => (
                                <View style={[styles.sectionHeader, { flexDirection: 'row' , justifyContent:'space-evenly'}]}>
                                    <Text style={styles.sectionHeaderText}>
                                     |   {section.title}  |
                                    </Text>
                                    <Text style={styles.sectionHeaderText}>
                                        |   {section.data.length} Frequency   |
                                    </Text>
                                    <Text style={styles.sectionHeaderText}>
                                        |   {section.total_duration} mints ON   |
                                    </Text>
                                    <Text style={[styles.sectionHeaderText]}>
                                        |   Power: {Math.round(section.power)} KW   |
                                    </Text>
                                </View>
                            )}


                        />


                        :
                        <View>
                            {/* <View style={[styles.listItem]}>
                            <Text style={[styles.listText, { fontSize: 17 }]}>No any record to show</Text>
                            <View>
                                <View style={styles.infoIcon}>
                                    <Text style={styles.infoText}>!</Text>
                                </View>
                            </View>
                        </View> */}
                            <View style={{ padding: '10%', backgroundColor: '' }}>
                                <Text style={{ fontSize: 15 }}>Note :</Text>
                                <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                                    <Text style={[styles.listText, { color: 'black', fontSize: 16, marginLeft: 0 }]}>No any record</Text>
                                </View>
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CompartmentApplianceRecord;
