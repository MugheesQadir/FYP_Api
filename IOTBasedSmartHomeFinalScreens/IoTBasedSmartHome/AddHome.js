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

const AddHome = ({ navigation, route }) => {
    const [name, setname] = useState('')
    const [city, setCity] = useState(null);
    const [place, setPlace_id] = useState(null);
    const [listCities, Setcities] = useState([]);
    const [listplaces, setPlaces] = useState([]);

    // const { items } = route.params;
    const [id, setid] = useState(null)

    const storage = new MMKV();

    const GetStorageData = () => {
        const storedId = storage.getNumber('person_id');
        if (storedId !== undefined) {
            setid(storedId);
        }
    };
    const getCities = async () => {
        const url = `${URL}/ListCities`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const result = await response.json();
                Setcities(result);
            } else {
                console.error('Failed to fetch cities');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const getPlaces = async (city) => {
        const url = `${URL}/ListPlacesByCityId/${city}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const result = await response.json();
                setPlaces(result);
            } else {
                console.error('Failed to fetch places');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const AddHome = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Home name')
            return;
        }
        if (!city) {
            Alert.alert('Error', 'Please Select city')
            return;
        }
        if (!place) {
            Alert.alert('Error', 'Please Select Place')
            return;
        }
        const payload = { name: name, place_id: place, person_id: id };
        try {
            const res = await fetch(`${URL}/AddHome`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            const data = await res.json()
            if (res.ok) {
                if (data.success) {
                    Alert.alert('Successfull', data.success);
                    navigation.goBack();
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
        getCities();
    }, []);

    useEffect(() => {
        if (city !== null) {
            getPlaces(city);
        }
    }, [city]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View
                        style={{ flex: 1 }}><Text style={[styles.navbarText, { marginRight: 25 }]}>
                            Add Home</Text></View>

                </View>
                <View style={[styles.innerContainer]}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input, { backgroundColor: 'white', borderColor: 'black', borderWidth: 0.7 }]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            onChangeText={setname}
                        />

                        <View style={{ position: 'absolute', width: '100%', marginTop: '20%' }}>
                            <Dropdown
                                style={styles.select}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={listCities.map(city => ({ label: city.name, value: city.id.toString() }))} // Correct structure
                                searchmaxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select City"
                                searchPlaceholder="Search..."
                                value={city?.toString()}  // Ensure correct value type
                                onChange={(selectedItem) => setCity(parseInt(selectedItem.value))}  // Correct key access
                            />

                        </View>

                        <View style={{ position: 'absolute', width: '100%', marginTop: '40%' }}>
                            <Dropdown
                                style={styles.select}
                                placeholderStyle={{ fontSize: 16, color: 'gray' }}
                                selectedTextStyle={{ fontSize: 16, }}
                                inputSearchStyle={{ height: 40, fontSize: 16, }}
                                data={listplaces.map(place => ({ label: place.name, value: place.id.toString() }))} // Correct structure
                                searchmaxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Place"
                                searchPlaceholder="Search..."
                                value={place?.toString()}  // Ensure correct value type
                                onChange={(selectedItem) => setPlace_id(parseInt(selectedItem.value))}  // Correct key access
                            />

                        </View>
                    </View>

                    <View style={[styles.Bottombtn, { position: 'absolute', marginTop: '180%' }]}>
                        <View style={{  backgroundColor: '#001F6D', padding: 10, width: '70%', borderRadius: 10 }}>
                            <TouchableOpacity onPress={AddHome}
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

export default AddHome;
