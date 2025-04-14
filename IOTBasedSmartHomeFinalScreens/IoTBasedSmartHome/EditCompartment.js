import {
    Text, View, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native'
import React, { useState, useEffect } from 'react';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const EditCompartment = ({ navigation, route }) => {
    const [name, setname] = useState('')
    const [data, setData] = useState(null);
    const [home_id, setid] = useState(null)
    const [items, setItems] = useState(route.params?.items || null);
    const [compartment_id, setCompartment_id] = useState(null)

    const storage = new MMKV();

    const GetStorageData = () => {
        const storedId = storage.getNumber('home_id');
        if (storedId !== undefined) {
            setid(storedId);
        }
    };

    const getCompartmentById = async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/GetCompartmentById/${id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const UpdateCompartments = async () => {
            if (!name) {
                Alert.alert('Error', 'Please Enter Compartment name');
                return;
            }
            if (!home_id) {
                Alert.alert('Error', 'Home ID is missing');
                return;
            }
    
            const payload = { id: compartment_id, name: name, home_id:home_id };
    
            try {
                const res = await fetch(`${URL}/UpdateCompartment`, {
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
                        navigation.goBack();
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
    
        const DeleteCompartments = async () => {
            if (!name) {
                Alert.alert('Error', 'Please Enter Home name');
                return;
            }
            if (!home_id) {
                Alert.alert('Error', 'Home ID is missing');
                return;
            }
    
            try {
                const res = await fetch(`${URL}/DeleteCompartment/${compartment_id}`, {
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

    useEffect(() => {
        if (items) {
            setCompartment_id(items.compartment_id);
        }
    }, [items]);

    useEffect(() => {
        if (compartment_id) {
            getCompartmentById(compartment_id);
        }
    }, [compartment_id]);

    useEffect(() => {
        if (data) {
            setname(data.name);
        }
    }, [data]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View
                        style={{ flex: 1 }}><Text style={[styles.navbarText, { marginRight: 25 }]}>
                            Edit Compartment</Text></View>

                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input, { backgroundColor: 'white', borderColor: 'black', borderWidth: 0.7 }]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            value={name}
                            onChangeText={setname}
                        />
                    </View>

                    <View style={[styles.Bottombtn, { position: 'absolute', marginTop: '190%', flexDirection: 'row', justifyContent: 'space-around' }]}>
                        <View style={{ position: '', backgroundColor: 'maroon', padding: 10, marginLeft: 31, width: '35%', borderRadius: 10, }}>
                            <TouchableOpacity onPress={DeleteCompartments}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ position: '', backgroundColor: '#001F6D', padding: 10, marginRight: 31, width: '35%', borderRadius: 10 }}>
                            <TouchableOpacity onPress={UpdateCompartments}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditCompartment;
