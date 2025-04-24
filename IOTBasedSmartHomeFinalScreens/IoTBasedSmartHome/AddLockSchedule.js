import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform, Button,
    Pressable, ActivityIndicator
} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const AddLockSchedule = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [day, setDay] = useState(null);
    const [timeOn, setTimeOn] = useState(new Date());
    const [timeOff, setTimeOff] = useState(new Date());
    const [showTimeOnPicker, setShowTimeOnPicker] = useState(false);
    const [showTimeOffPicker, setShowTimeOffPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const items = route.params?.items || {};
    const [type, setType] = useState(null)
    const [show,setShow] = useState(null)

    // State for received data
    const [compartmentLockId, setCompartmentLockId] = useState(null);
    const [compartmentId, setCompartmentId] = useState(null);
    
    const storage = new MMKV();

    const days = [
        { id: 1, name: 'Monday' },
        { id: 2, name: 'Tuesday' },
        { id: 3, name: 'Wednesday' },
        { id: 4, name: 'Thursday' },
        { id: 5, name: 'Friday' },
        { id: 6, name: 'Saturday' },
        { id: 7, name: 'Sunday' }
    ];
    const typeList = [
        { id: 0, name: 'Internal' },
        { id: 1, name: 'External' },
    ];

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
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

    const setStorageData = useCallback(() => {
            if (items?.Compartment_Lock_id) {
                storage.set('type', Number(items.type));
            }
        }, [items]);

    // Initialize received data
    useEffect(() => {
        const storedCompartmentId = storage.getNumber('compartment_id');
        const storedlocksId = storage.getNumber('compartment_lock_id');
        const storedtype = storage.getNumber('type')

        // If the `items` prop exists and contains a lock ID, we assume single schedule
        if (items?.Compartment_Lock_id) {            
            setShow(false)
            setType(items.type)
            setStorageData()
            setCompartmentLockId(items.Compartment_Lock_id);
        }
        // If `items` is just a number, we assume it's a compartment ID (i.e. add schedule to all locks in that compartment)
        else if (typeof items === 'number') {            
            setShow(true)
            setCompartmentId(items);
        }

        // If no `items` passed, fallback to MMKV storage values
        if (!items) {
            if (!compartmentId && storedCompartmentId) {
                setCompartmentId(storedCompartmentId);
            }

            if (!compartmentLockId && storedlocksId) {
                setCompartmentLockId(storedlocksId);
            }
        }
    }, []);

    const addScheduleForSingleLock = async () => {
        if (items.type !== type) {
            Alert.alert('Error', 'You selected internal lock and add schedule on external locks');
            return;
        }
        try {
            const payload = {
                name: name,
                compartment_lock_id: compartmentLockId,
                start_time: formatTime(timeOn),
                end_time: formatTime(timeOff),
                days: day,
                lock_type: type
            };

            const addResponse = await fetch(`${URL}/Add_Lock_Schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!addResponse.ok) {
                const errorText = await addResponse.text();
                throw new Error(errorText);
            }

            const addResult = await addResponse.json();

            if (addResult.success) {
                return { success: true, message: addResult.success || 'Schedule added successfully' };
            } else {
                return { success: false, message: addResult.error || 'Failed to add schedule' };
            }

        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const addScheduleForAllLocks = async () => {
        
        if (type === null || type === undefined) {
            Alert.alert('Error', 'Please Select type');
            return;
        }
        try {
            // First get all appliances for this compartment
            const response = await fetch(`${URL}/List_Compartment_lock_by_compartment_id/${compartmentId}`);

            // Check if response is OK and parse JSON
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch compartment locks');
            }

            const result = await response.json();

            if (!Array.isArray(result)) {
                throw new Error('Invalid response format - expected array of locks');
            }

            let successCount = 0;
            let errorMessages = [];

            // Add schedule for each appliance
            for (const appliance of result) {
                if (type === appliance.type) {
                    const payload = {
                        name: name,
                        compartment_lock_id: appliance.Compartment_Lock_id,
                        start_time: formatTime(timeOn),
                        end_time: formatTime(timeOff),
                        days: day,
                        lock_type: type
                    };

                    try {
                        const addResponse = await fetch(`${URL}/Add_Lock_Schedule`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (!addResponse.ok) {
                            const errorText = await addResponse.text();
                            throw new Error(errorText);
                        }

                        const addResult = await addResponse.json();

                        if (addResult.success) {
                            successCount++;
                        } else {
                            errorMessages.push(`Failed for ${appliance.name}: ${addResult.error || 'Unknown error'}`);
                        }
                    } catch (error) {
                        errorMessages.push(`Failed for ${appliance.name}: ${error.message}`);
                    }
                }
            }

            return {
                success: successCount > 0,
                message: successCount === result.length
                    ? `Schedule added to all ${successCount} locks successfully`
                    : `Schedule added to ${successCount} of ${result.length} appliances`,
                errors: errorMessages.length > 0 ? errorMessages : null
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                errors: [error.message]
            };
        }
    };

    const handleAddSchedule = async () => {
        if (!name) {
            Alert.alert('Error', 'Please enter schedule name');
            return;
        }

        if (!day) {
            Alert.alert('Error', 'Please select a day');
            return;
        }
        if (
            timeOn.getHours() === timeOff.getHours() &&
            timeOn.getMinutes() === timeOff.getMinutes()
        ) {
            Alert.alert('Error', 'Time On and Time Off cannot be the same');
            return;
        }

        setLoading(true);

        try {
            let result;

            if (compartmentLockId && !compartmentId) {                
                // Only one lock
                result = await addScheduleForSingleLock();
            } else if (compartmentId) {
                // Add to all locks in the compartment
                result = await addScheduleForAllLocks();
            } else {
                throw new Error('No locks or compartment selected');
            }

            if (result.success) {
                Alert.alert('Success', result.message);
                if (result.errors?.length > 0) {
                    const errorsToShow = result.errors.slice(0, 3);
                    if (result.errors.length > 3) {
                        errorsToShow.push(`...and ${result.errors.length - 3} more`);
                    }
                    Alert.alert('Partial Errors', errorsToShow.join('\n\n'));
                }
                navigation.goBack();
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.navbarText, { marginRight: 25 }]}>
                            Add Schedule
                        </Text>
                    </View>
                </View>

                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>
                        {show ? <View style={{ width: '100%', marginTop: '0%' }}>
                            <Dropdown
                                style={styles.select}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={typeList.map(place => ({ label: place.name, value: place.id.toString() }))} // Correct structure
                                searchmaxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select type"
                                searchPlaceholder="Search..."
                                value={type?.toString()}  // Ensure correct value type
                                onChange={(selectedItem) => setType(parseInt(selectedItem.value))}  // Correct key access
                            />
                        </View> : null}
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: 'white',
                                borderColor: 'black',
                                borderWidth: 0.7,
                                marginTop: '0%'
                            }]}
                            placeholder='Schedule Name'
                            placeholderTextColor='gray'
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={[styles.Text, { marginRight: '70%' }]}>Time On:</Text>
                        <View style={{ width: '85%' }}>
                            <Pressable onPress={() => setShowTimeOnPicker(true)}>
                                <Text style={styles.value}>{formatTime(timeOn)}</Text>
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
                                <Text style={styles.value}>{formatTime(timeOff)}</Text>
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
                                style={styles.select}
                                placeholderStyle={{ fontSize: 15, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 15 }}
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

                    <View style={[styles.Bottombtn, { marginBottom: 35 }]}>
                        <View style={{
                            backgroundColor: '#001F6D',
                            padding: 10,
                            width: '70%',
                            borderRadius: 10
                        }}>
                            <TouchableOpacity
                                onPress={handleAddSchedule}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: 20
                                    }}>
                                        Save
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AddLockSchedule;