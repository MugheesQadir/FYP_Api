import {
    Text, View, TouchableOpacity, Pressable,
    KeyboardAvoidingView, Platform, FlatList,
    Alert
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import URL from './Url';

const storage = new MMKV();

const Home = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const [items, setItems] = useState(route.params?.items || {});
    const [id, setId] = useState(items?.id || null);

    const setStorageData = () => {
        if (items?.id) {
            storage.set('person_id', Number(items.id));
        }
    };

    const getStorageData = () => {
        const storedId = storage.getNumber('person_id');
        if (storedId !== undefined) {
            setId(storedId);
        }
    };

    const getHomeByPersonId = async (personId) => {
        if (!personId) return;
        try {
            const response = await fetch(`${URL}/List_Home_By_Person_Id/${personId}`);
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

    useFocusEffect(
        useCallback(() => {
            setStorageData();
            getStorageData();
        }, [])
    );
    // ✅ 
    useFocusEffect(
        useCallback(() => {
            if (id) getHomeByPersonId(id);
        }, [id])
    );

    const FlatListData = ({ item }) => (
        <Pressable style={[styles.listItem]} onPress={() => navigation.navigate('DashBoard', { items: item })}>
            <Text style={styles.listText}>{item.home_name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditHome', { items: item })}>
                <View style={styles.infoIcon}>
                    <Text style={styles.infoText}>i</Text>
                </View>
            </TouchableOpacity>
        </Pressable>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
            <View style={[styles.navbar]}>
                    <TouchableOpacity >
                        <Icon name="arrow-left" size={24} color="transparent" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90,justifyContent:'center' }}>
                        <Text style={styles.navbarText}>Home</Text>
                    </View>
                </View>

            <View style={{ flex: 1 }}>
                {data.length > 0 ?
                    <FlatList
                        data={data}
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
                            <Text style={styles.listText}>Please Add Homes</Text>
                            <View>
                                <View style={styles.infoIcon}>
                                    <Text style={styles.infoText}>!</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: '10%', backgroundColor: '' }}>
                            <Text style={{ fontSize: 15 }}>Note :</Text>
                            <View style={{ justifyContent: 'center', padding: 50, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: 'lightgray' }}>
                                <Text style={[styles.listText, { color: 'black', fontSize: 18, marginLeft: 0 }]}>No Homes available</Text>
                                <Text style={[styles.listText, { color: 'black', fontSize: 15, marginLeft: 6, marginTop: 15 }]}>Please press + icon to add home</Text>
                            </View>
                        </View>
                    </View>
                }

                {/* Floating Button */}
                <Pressable
                    style={styles.floatingButton}
                    onPress={() => navigation.navigate('AddHome', { items })}
                >
                    <Text style={styles.floatingButtonText}>+</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Home;
