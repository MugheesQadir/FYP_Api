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

const EditLocks = ({ navigation, route }) => {
    const [name, setName] = useState('')
    const [status, setstatus] = useState(null);
    const [port, setPort] = useState('')
    const [type, setType] = useState(null)
    const [items, setItems] = useState(route.params?.items || null);
    const [cmp_lock_id, set_Com_Lock_id] = useState(null)

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

    useEffect(() => {
        if (items) {
            set_Com_Lock_id(items.Compartment_Lock_id);  // Set home_id after receiving items
            setName(items.name);
            setType(items.type.toString())
            setstatus(items.status)
            setPort(items.port.toString())

        }
    }, [items]);

    const EditLocks = async () => {
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

        const payload = { id:cmp_lock_id,name: name, compartment_id: compartment_id, status: status, port: port, type: type };
        try {
            const res = await fetch(`${URL}/update_Compartment_Lock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            let data;
            try {
                data = await res.json(); // Safe JSON parsing
            } catch (jsonError) {
                throw new Error("Invalid JSON response from server");
            }

            if (res.ok) {
                if (data.success) {
                    Alert.alert('Successful', data.success);
                    navigation.goBack()
                } else {
                    Alert.alert('Failed', data.error || 'Something went wrong');
                }
            } else {
                Alert.alert('Failed', data?.error || 'Server error occurred');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An unexpected error occurred');
        }
    };

    const DeleteLocks = async () => {
        if (!cmp_lock_id) {
            Alert.alert('Error', 'Compartment Lock ID is missing');
            return;
        }

        try {
            const res = await fetch(`${URL}/delete_Compartment_Lock/${cmp_lock_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            let data;
            try {
                data = await res.json(); // Safe JSON parsing
            } catch (jsonError) {
                throw new Error("Invalid JSON response from server");
            }

            if (res.ok) {
                if (data.success) {
                    Alert.alert('Successful', data.success);
                    navigation.goBack()
                } else {
                    Alert.alert('Failed', data.error || 'Something went wrong');
                }
            } else {
                Alert.alert('Failed', data?.error || 'Server error occurred');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An unexpected error occurred');
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
                        <Text style={styles.navbarText}>Edit Locks</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>

                        <TextInput
                            style={[styles.input]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            onChangeText={setName}
                            value={name}
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

                        <View style={{ width: '100%' }}>
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
                            value={port}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.Bottombtn, { flex: 0.3, flexDirection: 'row', justifyContent: 'space-evenly' }]}>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'maroon', width: '35%', marginStart: 20 }]}
                    onPress={DeleteLocks}
                    >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {  width: '35%', marginEnd: 20 }]}
                    onPress={EditLocks}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default EditLocks
