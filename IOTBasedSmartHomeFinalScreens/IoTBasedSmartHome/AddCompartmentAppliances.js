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

const AddCompartmentAppliances = ({ navigation, route }) => {
    const [name, setName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPower, setSelectedPower] = useState(null);
    const [selectedApplianceId, setSelectedApplianceId] = useState(null);
    const [status, setStatus] = useState(null);
    const [port, setPort] = useState('')
    const [listAppliances, setListAppliances] = useState([]);
    const [filteredPowers, setFilteredPowers] = useState([]);

    const stat = [{ id: 0, name: 'Off' }, { id: 1, name: 'On' }]

    const [compartment_id, set_Com_id] = useState(null)

    const storage = new MMKV();

    const GetStorageData = () => {
        const storedId = storage.getNumber('compartment_id');
        if (storedId !== undefined) {
            set_Com_id(storedId);
        }
    };

    const getAppliances = async () => {
        const url = `${URL}/ListAppliance`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const result = await response.json();
                setListAppliances(result);
            } else {
                console.error('Failed to fetch Appliances');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    // Filter powers based on selected category
    useEffect(() => {
        if (selectedCategory) {
            const powers = listAppliances
                .filter(item => item.catagory === selectedCategory)
                .map(item => ({
                    label: `${item.power}W`,
                    value: item.power.toString(),
                    id: item.id
                }));
            setFilteredPowers(powers);
            // Reset power selection when category changes
            setSelectedPower(null);
            setSelectedApplianceId(null);
        }
    }, [selectedCategory, listAppliances]);

    // Set appliance ID when power is selected
    useEffect(() => {
        if (selectedPower) {
            const selectedAppliance = listAppliances.find(item => 
                item.catagory === selectedCategory && 
                item.power.toString() === selectedPower
            );
            if (selectedAppliance) {
                setSelectedApplianceId(selectedAppliance.id);
            }
        }
    }, [selectedPower, selectedCategory, listAppliances]);

    const AddAppliances = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Appliance name')
            return;
        }
        if (!selectedCategory) {
            Alert.alert('Error', 'Please Select Category')
            return;
        }
        if (!selectedPower) {
            Alert.alert('Error', 'Please Select Power')
            return;
        }
        if (!port) {
            Alert.alert('Error', 'Please insert Port')
            return;
        }
        if (status === null || status === undefined) {
            Alert.alert('Error', 'Please Select status');
            return;
        }

        const payload = {
            name: name,
            compartment_id: compartment_id,
            appliance_id: selectedApplianceId,
            status: status,
            port: port
        };
        
        try {
            const res = await fetch(`${URL}/Add_Compartment_Appliance`,
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
        getAppliances();
    }, []);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90, justifyContent: 'center' }}>
                        <Text style={styles.navbarText}>Add Appliance</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>
                        <View style={{ width: '100%', }}>
                            <Dropdown
                                style={styles.input}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={[...new Set(listAppliances.map(item => item.catagory))].map(category => ({
                                    label: category,
                                    value: category
                                }))}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Category"
                                searchPlaceholder="Search..."
                                value={selectedCategory}
                                onChange={(item) => setSelectedCategory(item.value)}
                            />
                        </View>

                        <View style={{ width: '100%', }}>
                            <Dropdown
                                style={styles.input}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={filteredPowers}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Power"
                                searchPlaceholder="Search..."
                                value={selectedPower}
                                onChange={(item) => setSelectedPower(item.value)}
                                disable={!selectedCategory}
                            />
                        </View>

                        <TextInput
                            style={[styles.input,]}
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
                                data={stat.map(place => ({ label: place.name, value: place.id.toString() }))}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select status"
                                searchPlaceholder="Search..."
                                value={status?.toString()}
                                onChange={(item) => setStatus(parseInt(item.value))}
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
                <TouchableOpacity style={styles.button} onPress={AddAppliances}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default AddCompartmentAppliances