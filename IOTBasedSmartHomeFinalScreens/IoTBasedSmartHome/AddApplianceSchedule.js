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

const AddApplianceSchedule = ({ navigation, route }) => {
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
    const [compartmentId, setCompartmentId] = useState(null);

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

    // Initialize received data
    useEffect(() => {
        const storage = new MMKV();
    
        const storedCompartmentId = storage.getNumber('compartment_id');
        const storedApplianceId = storage.getNumber('compartment_appliance_id');
    
        // Priority: props > storage
        if (items?.Compartment_Appliance_id) {
            setCompartmentApplianceId(items.Compartment_Appliance_id);
        } else if (typeof items === 'number') {
            setCompartmentId(items);
        }
    
        // Fallback if above didn’t set them
        if (!items) {
            if (!compartmentId && storedCompartmentId) {
                setCompartmentId(storedCompartmentId);
            }
    
            if (!compartmentApplianceId && storedApplianceId) {
                setCompartmentApplianceId(storedApplianceId);
            }
        }
    }, []);
    

    const addScheduleForSingleAppliance = async () => {
        try {
            const payload = {
                name: name,
                type: 0, // Assuming default type
                table_id: compartmentApplianceId,
                start_time: formatTime(timeOn),
                end_time: formatTime(timeOff),
                days: day
            };

            const response = await fetch(`${URL}/Add_Appliance_Schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                return { success: true, message: result.success || 'Schedule added successfully' };
            } else {
                return { success: false, message: result.error || 'Failed to add schedule' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const addScheduleForAllAppliances = async () => {
        try {
            // First get all appliances for this compartment
            const response = await fetch(`${URL}/get_compartment_appliance_with_compartment_id/${compartmentId}`);
            
            // Check if response is OK and parse JSON
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch compartment appliances');
            }
            
            const result = await response.json();
            
            if (!Array.isArray(result)) {
                throw new Error('Invalid response format - expected array of appliances');
            }
    
            let successCount = 0;
            let errorMessages = [];
    
            // Add schedule for each appliance
            for (const appliance of result) {
                const payload = {
                    name: name,
                    type: 0, // Assuming default type
                    table_id: appliance.Compartment_Appliance_id,
                    start_time: formatTime(timeOn),
                    end_time: formatTime(timeOff),
                    days: day
                };
    
                try {
                    const addResponse = await fetch(`${URL}/Add_Appliance_Schedule`, {
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
    
            return { 
                success: successCount > 0,
                message: successCount === result.length 
                    ? `Schedule added to all ${successCount} appliances successfully`
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
    
            if (compartmentApplianceId && !compartmentId) {
                // Only one appliance
                result = await addScheduleForSingleAppliance();
            } else if (compartmentId) {
                // Add to all appliances in the compartment
                result = await addScheduleForAllAppliances();
            } else {
                throw new Error('No appliance or compartment selected');
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

                    <View style={[styles.Bottombtn, { marginBottom : 35 }]}>
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

export default AddApplianceSchedule;