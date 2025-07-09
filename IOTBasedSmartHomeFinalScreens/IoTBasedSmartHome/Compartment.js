import {
    Text, View, TouchableOpacity, Pressable,
    KeyboardAvoidingView, Platform, FlatList,
    Alert, ScrollView, TextInput
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import URL from './Url';
import { Checkbox } from 'react-native-paper';


const storage = new MMKV();

const Compartment = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const [items, setItems] = useState(route.params?.items || {});
    const [home_id, sethomeId] = useState(items?.home_id || null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCompartments, setSelectedCompartments] = useState([]);
    const [categories, setCatagories] = useState([])
    const [powers, setpowerss] = useState([])
    const [selectedpower, setSelectedpower] = useState('All');
    const [isChecked, setIsChecked] = useState(false);
    const [sortMode, setSortMode] = useState('all'); // 'all' or 'activeOnly'
    const [searchText, setSearchText] = useState('');
    const [allAppliances, setAllAppliances] = useState([]);



    console.log(selectedCompartments)
    // const categories = ['All', 'Lights', 'Fans', 'Tap valve', 'Light', 'Fan', 'Tap_valvee'];

    const setStorageData = useCallback(() => {
        if (items?.home_id) {
            storage.set('home_id', Number(items.home_id));
        }
    });

    // const getAppliances = async () => {
    //     const url = `${URL}/ListAppliance`;
    //     try {
    //         const response = await fetch(url);
    //         if (response.ok) {
    //             const result = await response.json(); // result is an array of appliances
    //             const uniqueCategories = ['All', ...new Set(result.map(item => item.catagory))];
    //             const uniquepower = ['All', ...new Set(result.map(item => item.power,item=>item.catagory))];
    //             setCatagories(uniqueCategories);
    //             setpowerss(uniquepower)
    //         } else {
    //             console.error('Failed to fetch Appliances');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data: ', error);
    //     }
    // };

    const getAppliances = async () => {
    const url = `${URL}/ListAppliance`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const result = await response.json();
            const uniqueCategories = ['All', ...new Set(result.map(item => item.catagory))];
            
            setCatagories(uniqueCategories);
            setAllAppliances(result);

            // ✅ Show all powers by default (on initial load)
            const allPowers = ['All', ...new Set(result.map(item => item.power))].sort((a, b) => a - b);
            setpowerss(allPowers);

        } else {
            console.error('Failed to fetch Appliances');
        }
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};



    const getStorageData = useCallback(() => {
        const storedId = storage.getNumber('home_id');
        if (storedId !== undefined) {
            sethomeId(storedId);
        }
    });

    // const handleCategorySelect = (category) => {
    //     setSelectedCategory(category);
    //     setSelectedCompartments([]);
    // };

    const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCompartments([]);
    setSelectedpower('All');

    if (category === 'All') {
        // ✅ Get powers from all appliances
        const allPowers = [...new Set(allAppliances.map(item => item.power))].sort((a, b) => a - b);
        setpowerss(['All', ...allPowers]);
    } else {
        // ✅ Get powers from selected category only
        const filtered = allAppliances.filter(item => item.catagory === category);
        const uniquePowers = [...new Set(filtered.map(item => item.power))];
        setpowerss(['All', ...uniquePowers]);
    }
};



    const handlePowerSelect = (power) => {
        setSelectedpower(power);
        setSelectedCompartments([]);
    };


    const handleCompartmentSelect = (compartmentId) => {
        setSelectedCompartments(prev => {
            if (prev.includes(compartmentId)) {
                return prev.filter(id => id !== compartmentId);
            } else {
                return [...prev, compartmentId];
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            if (home_id) {
                if (sortMode === 'activeOnly') {
                    get_compartments_with_active_appliances(home_id);
                } else {
                    getCompartmentByHomeId(home_id);
                }
            }
        }, [home_id, sortMode])
    );


    const getCompartmentByHomeId = useCallback(async (home_id) => {
        if (!home_id) return;
        try {
            const response = await fetch(`${URL}/List_Compartment_By_Home_Id/${home_id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    });

    const get_compartments_with_active_appliances = useCallback(async (home_id) => {
        if (!home_id) return;
        try {
            const response = await fetch(`${URL}/get_compartments_with_active_appliances/${home_id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    });

    useFocusEffect(
        useCallback(() => {
            getAppliances()
            setStorageData();
            getStorageData();
        }, [])
    );
    // ✅ 
    useFocusEffect(
        useCallback(() => {
            // if (home_id) getCompartmentByHomeId(home_id);
            if (isChecked) {
                if (home_id) get_compartments_with_active_appliances(home_id);
            }
            else {
                if (home_id) getCompartmentByHomeId(home_id);
            }
        }, [])
    );

    const FlatListData = useCallback(({ item }) => (
        <View style={styles.row}>
            <Pressable
                style={[styles.listItem, {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '82.5%',
                    marginHorizontal: 0,
                }]}
                onPress={() => navigation.navigate('CompartmentAppliance', { items: item })}
            >
                <Text style={styles.listText}>{item.compartment_name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditCompartment', { items: item })}>
                    <View style={styles.infoIcon}>
                        <Text style={styles.infoText}>i</Text>
                    </View>
                </TouchableOpacity>
            </Pressable>

            {/* Checkbox Container */}
            <View style={styles.checkboxContainer}>
                <View style={styles.CheckBoxsimulatedBorder} />
                <Checkbox
                    status={selectedCompartments.includes(item.compartment_id) ? 'checked' : 'unchecked'}
                    onPress={() => handleCompartmentSelect(item.compartment_id)}
                    color="#001F6D"
                    uncheckedColor="#B0B7C3"
                />
            </View>
        </View>
    ), [selectedCompartments]);

    // const toggleCheckbox = () => {
    //     var val = !isChecked;
    //     setIsChecked(val);
    //     if (val) {
    //         if (home_id) get_compartments_with_active_appliances(home_id);
    //     }
    //     else {
    //         if (home_id) getCompartmentByHomeId(home_id);
    //     }

    // };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
            <View style={[styles.navbar]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 0.90, justifyContent: 'center' }}>
                    <Text style={styles.navbarText}>Compartment</Text>
                </View>
            </View>

            {/* <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                <TextInput
                    placeholder="Search compartment..."
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{
                        height: 45,
                        borderColor: '#001F6D',
                        borderWidth: 1.2,
                        borderRadius: 10,
                        paddingHorizontal: 15,
                        fontSize: 16,
                        backgroundColor: 'white',
                        color: 'black'
                    }}
                    placeholderTextColor="#777"
                />
            </View> */}

            <View style={styles.section}>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 0, marginTop: 0 }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>abc</Text>
                    <Checkbox
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={toggleCheckbox}
                        color="#001F6D"
                        uncheckedColor="#B0B7C3"
                    />

                </View> */}
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', margin: 10 }}>
                    <TouchableOpacity onPress={() => setSortMode('all')}
                        style={{ marginLeft: 50, flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 16 }}>OFF</Text>
                        <Icon name="arrow-down" size={22} color={sortMode === 'all' ? '#001F6D' : 'gray'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSortMode('activeOnly')}
                        style={{ marginLeft: 100, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 16 }}>ON</Text>
                        <Icon name="arrow-up" size={22} color={sortMode === 'activeOnly' ? '#001F6D' : 'gray'} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Appliances</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.selectedCategory
                            ]}
                            onPress={() => handleCategorySelect(category)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category && styles.selectedCategoryText
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>Power</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {powers.map((power) => (
                        <TouchableOpacity
                            key={power}
                            style={[
                                styles.categoryButton,
                                selectedpower === power && styles.selectedCategory
                            ]}
                            onPress={() => handlePowerSelect(power)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedpower === power && styles.selectedCategoryText
                            ]}>
                                {power}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={{ flex: 7 }}>
                <Text style={{ marginLeft: 25, bottom: 8, fontSize: 15, fontWeight: '600', fontStyle: 'italic' }}>{items.home_name}</Text>
                {/* {data.length > 0 ?
                    // <FlatList
                    //     data={data}
                    //     // keyExtractor={(item) => item.Compartment_Appliance_id.toString()}
                    //     renderItem={FlatListData}
                    //     contentContainerStyle={{ paddingBottom: 100 }}
                    //     initialNumToRender={5}
                    //     maxToRenderPerBatch={10}
                    //     windowSize={5}
                    //     removeClippedSubviews={true}
                    // />
                    <FlatList
                        data={data.filter(item =>
                            item.compartment_name.toLowerCase().includes(searchText.toLowerCase())
                        )}
                        renderItem={FlatListData}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={true}
                    /> */}

                {data.length > 0 ? (
                    <>
                        {/* 👇 Search Input Here */}
                        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                            <TextInput
                                placeholder="Search compartment..."
                                value={searchText}
                                onChangeText={setSearchText}
                                style={{
                                    height: 45,
                                    borderColor: '#001F6D',
                                    borderWidth: 1.2,
                                    borderRadius: 10,
                                    paddingHorizontal: 15,
                                    fontSize: 16,
                                    backgroundColor: 'white',
                                    color: 'black'
                                }}
                                placeholderTextColor="#777"
                            />
                        </View>

                        {/* FlatList rendering filtered results */}
                        <FlatList
                            data={data.filter(item =>
                                item.compartment_name.toLowerCase().includes(searchText.toLowerCase())
                            )}
                            renderItem={FlatListData}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            initialNumToRender={5}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            removeClippedSubviews={true}
                        />
                    </>
                )

                    :
                    <View>
                        <View style={[styles.listItem]}>
                            <Text style={[styles.listText, { fontSize: 17 }]}>Please Add Compartment</Text>
                            <View>
                                <View style={styles.infoIcon}>
                                    <Text style={styles.infoText}>!</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: '10%', backgroundColor: '' }}>
                            <Text style={{ fontSize: 15 }}>Note :</Text>
                            <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                                <Text style={[styles.listText, { color: 'black', fontSize: 16, marginLeft: 0 }]}>No Compartment available</Text>
                                <Text style={[styles.listText, { color: 'black', fontSize: 15, marginLeft: 6, marginTop: 15 }]}>Please press add button to add new Compartments</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',  // space between the buttons
                alignItems: 'center',
                marginVertical: 10,
            }}>
            </View>

            <View style={[styles.Bottombtn, {
                padding: 18,
                flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1.5,
                borderColor: 'darkblue', borderRadius: 12, outlineColor: '#B0B7C3', outlineWidth: 1,
                outlineStyle: 'solid', backgroundColor: '#B0B7C3'
            }]}>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#78081C', width: '35%', marginStart: 20 }]}
                    onPress={() => {
                        if (selectedCompartments.length === 0) {
                            Alert.alert('Alert', 'Please select at least one compartment');
                        } else {
                            // Save values to MMKV storage before navigating
                            storage.set('selectedCompartments', JSON.stringify(selectedCompartments));
                            storage.set('selectedCategory', selectedCategory);
                            storage.set('selectedpower',selectedpower)

                            // Navigate and pass the data
                            navigation.navigate('ApplianceWiseAppliances', {
                                selectedCategory,
                                selectedpower,
                                selectedCompartments
                            });
                        }
                    }}
                >
                    <Text style={[styles.buttonText, { fontSize: 17 }]}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: '35%', marginEnd: 20 }]}
                    // onPress={() => navigation.navigate('AddCompartment', { items })}
                    onPress={() => navigation.navigate('AddCompartment', { items: items })}
                >
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Compartment;
