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

    const UpdateCompartments = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Compartment name');
            return;
        }
        if (!home_id) {
            Alert.alert('Error', 'Home ID is missing');
            return;
        }

        const payload = { id: compartment_id, name: name, home_id: home_id };

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
        if (items?.compartment_id) {
            setCompartment_id(items.compartment_id);
        }
        if (items?.compartment_name) {
            setname(items.compartment_name);
        }
        GetStorageData()
    }, []);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90,justifyContent:'center' }}>
                        <Text style={styles.navbarText}>Edit Compartment</Text>
                    </View>
                </View>
                <View style={[styles.innerContainer,{flex:4}]}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            value={name}
                            onChangeText={setname}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.Bottombtn, {flex:0.3, flexDirection: 'row', justifyContent: 'space-evenly' }]}>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'maroon', width: '35%', marginStart: 20 }]}
                    onPress={DeleteCompartments}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {  width: '35%', marginEnd: 20 }]}
                    onPress={UpdateCompartments}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default EditCompartment;
