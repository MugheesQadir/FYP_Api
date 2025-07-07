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

const LogRecord = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const items = route.params?.items || {};
    const sectionListRef = useRef(null);

    const [menuVisible, setMenuVisible] = useState(false);
    

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

    const list_main_logs_by_home_id = useCallback(async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/list_main_logs_by_home_id/${id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching table_id:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            if(items) {list_main_logs_by_home_id(items.home_id)}
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
                    <Text style={styles.navbarText}>Records</Text>
                </View>
            </View>

            {/* <TouchableOpacity onPress={() => scrollToDate("2025-07-05")}>
                <Text style={{ color: 'blue', padding: 10 }}>Jump to 2025-07-04</Text>
            </TouchableOpacity> */}

            <ScrollView horizontal style={styles.scrollWrapper}>
                <View style={[styles.logcontainer]}>
                    <View style={[styles.logrow, styles.logheader,{justifyContent:'space-evenly'}]}>
                        <Text style={styles.logheaderText}>Home</Text>
                        <Text style={styles.logheaderText}>Date</Text>
                        <Text style={styles.logheaderText}>Time</Text>
                        <Text style={styles.logheaderText}>Day</Text>
                        <Text style={styles.logheaderText}>Message</Text>
                        <Text style={styles.logheaderText}>Triggered by</Text>
                    </View>

                    {data.length > 0 ?
                    
                        <SectionList
                            ref={sectionListRef}
                            sections={groupByDate(data)}
                            keyExtractor={(item, index) => item.id.toString() + index}
                            renderItem={({ item }) => (
                                <View style={[styles.logrow,{justifyContent:'space-evenly'}]}>
                                    <Text style={styles.logcell}>{item.home_name}</Text>
                                    <Text style={styles.logcell}>{item.date}</Text>
                                    <Text style={styles.logcell}>{item.log_time}</Text>
                                    <Text style={styles.logcell}>{item.day}</Text>
                                    <Text style={styles.logcell}>{item.messagee}</Text>
                                    <Text style={styles.logcell}>{item.triggered_by}</Text>
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

export default LogRecord;
