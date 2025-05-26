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

const EditHome = ({ navigation, route }) => {
    const [name, setname] = useState('')
    const [city, setCity] = useState(null);
    const [place, setPlace_id] = useState(null);
    const [listCities, Setcities] = useState([]);
    const [listplaces, setPlaces] = useState([]);
    const [items, setItems] = useState(route.params?.items || null);
    const [home_id, setHomeId] = useState(null);
    const [id, setid] = useState(null)

    const storage = new MMKV();

    useEffect(() => {
        if (items) {
            setHomeId(items.home_id);  // Set home_id after receiving items
            setname(items.home_name);
            setCity(items.city_id)
            setPlace_id(items.place_id)
        }
        getCities()
        if(city) getPlaces(city)
    }, [items]);



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

    // const getStorageData = () => {
    //     const storedId = storage.getNumber('person_id');
    //     if (storedId !== undefined) {
    //         setid(storedId);
    //     }
    // };

    const UpdateHome = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Home name');
            return;
        }
        if (!city) {
            Alert.alert('Error', 'Please Select city');
            return;
        }
        if (!place || place === "") {
            Alert.alert('Error', 'Please Select Place');
            return;
        }
        if (!home_id) {
            Alert.alert('Error', 'Home ID is missing');
            return;
        }

        const payload = { id: home_id, name: name, place_id: place};

        try {
            const res = await fetch(`${URL}/UpdateHome`, {
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

    const DeleteHome = async () => {
        if (!name) {
            Alert.alert('Error', 'Please Enter Home name');
            return;
        }
        if (!home_id) {
            Alert.alert('Error', 'Home ID is missing');
            return;
        }

        try {
            const res = await fetch(`${URL}/DeleteHome/${home_id}`, {
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

    // useEffect(() => {
    //     if (items?.home_id) {
    //         setHomeId(items.home_id);  // Set home_id after receiving items
    //     }
    //     if (items?.home_name) {
    //         setname(items.home_name);  // Set home_name after receiving items
    //     }
    //     getCities();
    //     getStorageData()
    // }, []);

    useEffect(() => {
        if (city !== null) {
            getPlaces(city);
        }
    }, [city]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90, justifyContent: 'center' }}>
                        <Text style={styles.navbarText}>Edit Home</Text>
                    </View>
                </View>
                <View style={[styles.innerContainer]}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.input]}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            value={name}
                            onChangeText={setname}
                        />

                        <View style={{ width: '100%', }}>
                            <Dropdown
                                style={styles.input}
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

                        <View style={{ width: '100%' }}>
                            <Dropdown
                                style={styles.input}
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
                </View>
                <View style={[styles.Bottombtn, { flex: 0.3, flexDirection: 'row', justifyContent: 'space-evenly' }]}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: 'maroon', width: '35%', marginStart: 20 }]}
                        onPress={DeleteHome}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#001F6D', width: '35%', marginEnd: 20 }]}
                        onPress={UpdateHome}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditHome;
