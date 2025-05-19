import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native'
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const AddLocks = ({ navigation, route }) => {
    const [name, setName] = useState('')
    const [status, setstatus] = useState(null);
    const [port, setPort] = useState('')
    const [type, setType] = useState(null)

    const stat = [{ id: 0, name: 'Unlocked' }, { id: 1, name: 'Locked' }]
    const Locktype = [{ id: 0, name: 'Internal' }, { id: 1, name: 'External' }]

    const [compartment_id, set_Com_id] = useState(null)

    const storage = new MMKV();

    const GetStorageData = () => {
        const storedId = storage.getNumber('compartment_id');
        if (storedId !== undefined) {
            set_Com_id(storedId);
        }
    };

    const AddLocks = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter locks name')
            return;
        }
        if (!port) {
            Alert.alert('Error', 'Please insert Port')
        }
        if (status === null || status === undefined) {
            Alert.alert('Error', 'Please Select status');
            return;
        }
        if (type === null || type === undefined) {
            Alert.alert('Error', 'Please Select type');
            return;
        }
        const payload = { name: name, compartment_id: compartment_id, status: status, port: port, type: type };
        try {
            const res = await fetch(`${URL}/Add_Compartment_Lock`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            const data = await res.json()
            if (res.ok) {
                if (data.success) {
                    Alert.alert('Successfull', data.success);
                    navigation.goBack()
                } else {
                    Alert.alert('Failed', data.error || 'Something went wrong');
                }
            } else {
                Alert.alert('Failed', data.error || 'Server error occurred');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    useEffect(() => {
        GetStorageData()
    }, []);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90, justifyContent: 'center' }}>
                        <Text style={styles.navbarText}>Add Locks</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>

                        <TextInput
                            style={[styles.input]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            onChangeText={setName}
                        />

                        <View style={{ width: '100%' }}>
                            <Dropdown
                                style={styles.input}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={stat.map(place => ({ label: place.name, value: place.id.toString() }))} // Correct structure
                                searchmaxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select status"
                                searchPlaceholder="Search..."
                                value={status?.toString()}  // Ensure correct value type
                                onChange={(selectedItem) => setstatus(parseInt(selectedItem.value))}  // Correct key access
                            />

                        </View>

                        <View style={{ width: '100%'}}>
                            <Dropdown
                                style={styles.input}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={Locktype.map(place => ({ label: place.name, value: place.id.toString() }))} // Correct structure
                                searchmaxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select type"
                                searchPlaceholder="Search..."
                                value={type?.toString()}  // Ensure correct value type
                                onChange={(selectedItem) => setType(parseInt(selectedItem.value))}  // Correct key access
                            />

                        </View>

                        <TextInput
                            style={[styles.input]}
                            placeholder='Port'
                            placeholderTextColor='gray'
                            onChangeText={setPort}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.Bottombtn, { bottom: 45 }]}>
                <TouchableOpacity style={styles.button} onPress={AddLocks}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default AddLocks
