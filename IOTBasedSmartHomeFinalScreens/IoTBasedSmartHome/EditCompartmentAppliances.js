import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native'
import React, { useState, useEffect, use } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const EditCompartmentAppliances = ({ navigation, route }) => {
    const [name, setName] = useState('')
    const [Appliances, setAppliances] = useState(null);
    const [status, setstatus] = useState(null);
    const [listAppliances, setListAppliances] = useState([]);
    const [items, setItems] = useState(route.params?.items || null);
    const [Com_App_id, set_Com_App_Id] = useState(null);
    const [data, setData] = useState(null);

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

    const EditAppliances = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Appliance name')
            return;
        }
        if (!Appliances) {
            Alert.alert('Error', 'Please Select Appliances')
            return;
        }
        if (status === null || status === undefined) {
            Alert.alert('Error', 'Please Select status');
            return;
        }
        
        const payload = { id:Com_App_id,name: name, compartment_id: compartment_id, appliance_id: Appliances, status: status === 1 ? 1 : 0 };
        try {
            const res = await fetch(`${URL}/Update_Compartment_Appliance`, {
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

    const DeleteCompartmentAppliances = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Appliance name');
            return;
        }
        if (!Com_App_id) {
            Alert.alert('Error', 'Compartment Appliance ID is missing');
            return;
        }

        try {
            const res = await fetch(`${URL}/Delete_Compartment_Appliance/${Com_App_id}`, {
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


    const getCompartmentApplianceById = async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${URL}/Get_Compartment_Appliance_ById/${id}`);
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

    useEffect(() => {
            if (items) {
                set_Com_App_Id(items.Compartment_Appliance_id);  // Set home_id after receiving items
            }
        }, [items]);
    
        useEffect(() => {
            if (Com_App_id) {
                getCompartmentApplianceById(Com_App_id);
            }
        }, [Com_App_id]);
    
        useEffect(() => {
            if (data) {
                setName(data.name);
                setAppliances(data.appliance_id.toString())
                setstatus(data.status)                
            }
        }, [data]);

    useEffect(() => {
        GetStorageData()
        getAppliances();
    }, []);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View
                        style={{ flex: 1 }}><Text style={[styles.navbarText, { marginRight: 25 }]}>
                            Edit Appliance</Text></View>

                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>
                        

                        <View style={{ position: 'absolute', width: '100%', marginTop: '' }}>
                            <Dropdown
                                style={styles.select}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={listAppliances.map(appliane => ({ label: appliane.catagory, value: appliane.id.toString() }))} // Correct structure
                                searchmaxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Appliance"
                                searchPlaceholder="Search..."
                                value={Appliances?.toString()}  // Ensure correct value type
                                onChange={(selectedItem) => setAppliances(parseInt(selectedItem.value))}  // Correct key access
                            />

                        </View>

                        <TextInput
                            style={[styles.input, { position:'absolute',backgroundColor: 'white', borderColor: 'black', borderWidth: 0.7,marginTop:'19%' }]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            onChangeText={setName}
                            value={name}
                        />

                        <View style={{ position: 'absolute', width: '100%', marginTop: '40%' }}>
                            <Dropdown
                                style={styles.select}
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
                    </View>

                    <View style={[styles.Bottombtn, { position: 'absolute', marginTop: '190%', flexDirection: 'row', justifyContent: 'space-around' }]}>
                        <View style={{ position: '', backgroundColor: 'maroon', padding: 10, marginLeft: 31, width: '35%', borderRadius: 10, }}>
                            <TouchableOpacity 
                            onPress={DeleteCompartmentAppliances}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ position: '', backgroundColor: '#001F6D', padding: 10, marginRight: 31, width: '35%', borderRadius: 10 }}>
                            <TouchableOpacity 
                            onPress={EditAppliances}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default EditCompartmentAppliances