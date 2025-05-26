import {
    Text, View, TouchableOpacity, Pressable,
    KeyboardAvoidingView, Platform, FlatList,
    Alert, ScrollView
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

    const categories = ['All', 'Lights', 'Fans', 'Tap valve', 'Light', 'Fan', 'Tap_valvee'];

    // const setStorageData = useCallback(() => {
    //     if (items?.home_id) {
    //         storage.set('home_id', Number(items.home_id));
    //     }
    // });

    // const getStorageData = useCallback(() => {
    //     const storedId = storage.getNumber('home_id');
    //     if (storedId !== undefined) {
    //         sethomeId(storedId);
    //     }
    // });

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
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

    // const ApplianceItem = ({ item }) => (
    //     <View style={styles.applianceItem}>
    //         <Text style={styles.applianceName}>{item.name}</Text>
    //         <Text style={styles.applianceType}>{item.type}</Text>
    //     </View>
    // );

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
    useFocusEffect(
        useCallback(() => {
            // setStorageData();
            // getStorageData();
            if(items){
                sethomeId(items.home_id)
            }
        }, [])
    );
    // ✅ 
    useFocusEffect(
        useCallback(() => {
            if (home_id) getCompartmentByHomeId(home_id);
        }, [home_id])
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

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
            <View style={[styles.navbar]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 0.90, justifyContent: 'center' }}>
                    <Text style={styles.navbarText}>Compartment--{selectedCompartments}</Text>
                </View>
            </View>

            <View style={styles.section}>
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
            </View>

            <View style={{ flex: 7 }}>
                <Text style={{ marginLeft: 25, bottom: 8, fontSize: 15, fontWeight: '600', fontStyle: 'italic' }}>{items.home_name}</Text>
                {data.length > 0 ?
                    <FlatList
                        data={data}
                        // keyExtractor={(item) => item.Compartment_Appliance_id.toString()}
                        renderItem={FlatListData}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={true}
                    />

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
            <View style={[styles.Bottombtn, {
                    padding: 18,
                    flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1.5,
                    borderColor: 'darkblue', borderRadius: 12, outlineColor: '#B0B7C3', outlineWidth: 1,
                    outlineStyle: 'solid', backgroundColor: '#B0B7C3'
                }]}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#78081C', width: '35%', marginStart: 20 }]}
                        onPress={() => navigation.navigate('ApplianceSchedules', { items: compartmentId })}>
                        <Text style={[styles.buttonText, { fontSize: 17 }]}>Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#001F6D', width: '35%', marginEnd: 20 }]}
                         onPress={() => navigation.navigate('AddCompartment', { items })}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
        </KeyboardAvoidingView>
    );
};

export default Compartment;
