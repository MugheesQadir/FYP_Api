import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform, Button,
    Pressable, ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const EditApplianceSchedule = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [day, setDay] = useState(null);
    const [timeOn, setTimeOn] = useState(new Date());
    const [timeOff, setTimeOff] = useState(new Date());
    const [showTimeOnPicker, setShowTimeOnPicker] = useState(false);
    const [showTimeOffPicker, setShowTimeOffPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const items = route.params?.items;

    // State for received data
    const [compartmentApplianceId, setCompartmentApplianceId] = useState(null);
    // const [compartmentId, setCompartmentId] = useState(null);

    const days = [
        { id: 1, name: 'Monday' },
        { id: 2, name: 'Tuesday' },
        { id: 3, name: 'Wednesday' },
        { id: 4, name: 'Thursday' },
        { id: 5, name: 'Friday' },
        { id: 6, name: 'Saturday' },
        { id: 7, name: 'Sunday' }
    ];

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };


    const handleTimeOnChange = (event, selectedDate) => {
        setShowTimeOnPicker(false);
        if (selectedDate) {
            setTimeOn(selectedDate);
        }
    };

    const handleTimeOffChange = (event, selectedDate) => {
        setShowTimeOffPicker(false);
        if (selectedDate) {
            setTimeOff(selectedDate);
        }
    };


    useEffect(() => {
        if (items) {
            if (items.name) {
                setName(items.name);
            }

            if (items.days) {
                setDay(items.days.toString());
            }

            if (items.start_time) {
                // items.start_time is in "HH:MM:SS" format
                const [hours, minutes, seconds] = items.start_time.split(':');
                const startDate = new Date();
                startDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));
                setTimeOn(startDate);
            }

            if (items.end_time) {
                const [hours, minutes, seconds] = items.end_time.split(':');
                const endDate = new Date();
                endDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));
                setTimeOff(endDate);
            }
        }
    }, [items]);

    const update_matching_Appliance_Schedule = async () => {
        try {
            const payload = {
                old: {
                    name: items.name,
                    start_time: items.start_time,
                    end_time: items.end_time,
                    days: items.days.toString(),
                    type: 0
                },
                new: {
                    name: name,
                    start_time: formatTime(timeOn),
                    end_time: formatTime(timeOff),
                    days: day.toString(),
                    type: 0
                }
            };
            const response = await fetch(`${URL}/update_matching_Appliance_Schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', result.success || 'Schedules updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Update failed');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const delete_matching_Appliance_Schedule = async () => {
        try {
            const payload = {
                old: {
                    name: items.name,
                    start_time: items.start_time,
                    end_time: items.end_time,
                    days: items.days.toString(),
                    type: 0,
                    validate:1
                }
            };
            const response = await fetch(`${URL}/delete_matching_Appliance_Schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', result.success || 'Schedules deleted successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'delete failed');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90, justifyContent: 'center' }}>
                        <Text style={styles.navbarText}>Edit Schedule</Text>
                    </View>
                </View>

                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input,]}
                            placeholder='Schedule Name'
                            placeholderTextColor='gray'
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={[styles.Text, { marginRight: '70%' }]}>Time On:</Text>
                        <View style={{ width: '85%' }}>
                            <Pressable onPress={() => setShowTimeOnPicker(true)}>
                                <Text style={styles.input}>{formatTime(timeOn)}</Text>
                            </Pressable>
                            {showTimeOnPicker && (
                                <DateTimePicker
                                    value={timeOn}
                                    mode="time"
                                    is24Hour={false}
                                    display='spinner'
                                    onChange={handleTimeOnChange}
                                />
                            )}
                        </View>

                        <Text style={[styles.Text, { marginRight: '70%' }]}>Time Off:</Text>
                        <View style={{ width: '85%', marginBottom: 5 }}>
                            <Pressable onPress={() => setShowTimeOffPicker(true)}>
                                <Text style={styles.input}>{formatTime(timeOff)}</Text>
                            </Pressable>
                            {showTimeOffPicker && (
                                <DateTimePicker
                                    value={timeOff}
                                    mode="time"
                                    is24Hour={false}
                                    display='spinner'
                                    onChange={handleTimeOffChange}
                                />
                            )}
                        </View>

                        <View style={{ width: '100%', marginTop: '0%' }}>
                            <Dropdown
                                style={styles.input}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16 }}
                                data={days.map(day => ({
                                    label: day.name,
                                    value: day.id.toString()
                                }))}
                                searchmaxHeight={30}
                                labelField="label"
                                valueField="value"
                                placeholder="Select day"
                                value={day?.toString()}
                                onChange={(selectedItem) => setDay(parseInt(selectedItem.value))}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.Bottombtn, { flex: 0.3, flexDirection: 'row', justifyContent: 'space-evenly' }]}>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'maroon', width: '35%', marginStart: 20 }]}
                onPress={delete_matching_Appliance_Schedule}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#001F6D', width: '35%', marginEnd: 20 }]}
                    onPress={update_matching_Appliance_Schedule}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default EditApplianceSchedule;