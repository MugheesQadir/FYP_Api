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
    const [name,setName] = useState('')
    const [Appliances, setAppliances] = useState(null);
    const [status, setstatus] = useState(null);
    const [port,setPort] = useState('')
    const [listAppliances, setListAppliances] = useState([]);

    const stat = [{id:0,name:'Off'},{id:1,name:'On'}]

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

        const AddAppliances = async () => {
            if(!name){
                Alert.alert('Error','Please Enter Appliance name')
                return;
            }
            if (!Appliances) {
                Alert.alert('Error', 'Please Select Appliances')
                return;
            }
            if(!port){
                Alert.alert('Error','Please insert Port')
            }
            if (status === null || status === undefined) {
                Alert.alert('Error', 'Please Select status');
                return;
            }
            
            const payload = { name:name,compartment_id: compartment_id, appliance_id: Appliances,status:status ,port:port};
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
                    <View style={{ flex: 0.90,justifyContent:'center' }}>
                        <Text style={styles.navbarText}>Add Appliance</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>                        

                        <View style={{width: '100%',}}>
                            <Dropdown
                                style={styles.input}
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
                            style={[styles.input,]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            onChangeText={setName}
                        />

                        <View style={{width: '100%' }}>
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
