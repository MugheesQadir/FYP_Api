import {
    Text, View, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native'
import React, { useState, useEffect } from 'react';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import URL from './Url';

const AddCompartment = ({ navigation, route }) => {
    const [name, setname] = useState('')
    const [home_id, setid] = useState(null)

    const storage = new MMKV();

    const GetStorageData = () => {
        const storedId = storage.getNumber('home_id');
        if (storedId !== undefined) {
            setid(storedId);
        }
    };    

    const AddCompartments = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Compartment name')
            return;
        }
        const payload = { name: name, home_id:home_id};
        try {
            const res = await fetch(`${URL}/AddCompartment`,
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
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View
                        style={{ flex: 1 }}><Text style={[styles.navbarText, { marginRight: 25 }]}>
                            Add Compartment</Text></View>

                </View>
                <View style={[styles.innerContainer]}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input, { backgroundColor: 'white', borderColor: 'black', borderWidth: 0.7 }]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            onChangeText={setname}
                        />
                    </View>

                    <View style={[styles.Bottombtn, { position: 'absolute', marginTop: '180%' }]}>
                        <View style={{ position: 'absolute', backgroundColor: '#001F6D', padding: 10, width: '70%', borderRadius: 10 }}>
                            <TouchableOpacity onPress={AddCompartments}
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

export default AddCompartment;
