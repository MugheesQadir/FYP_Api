import {
    Text, View, TouchableOpacity, KeyboardAvoidingView,
    Platform, ScrollView, StyleSheet
} from 'react-native';
import React, { useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { MMKV } from 'react-native-mmkv';
import { useFocusEffect } from '@react-navigation/native';
import URL from './Url';

const storage = new MMKV();

const DashBoard = ({ navigation, route }) => {
    const [items, setItems] = useState(route.params?.items || {});
    const [home_id, sethomeId] = useState(items?.home_id || null);

    const [menuVisible, setMenuVisible] = useState(false);

    const setStorageData = useCallback(() => {
        if (items?.home_id) {
            storage.set('home_id', Number(items.home_id));
        }
    });

    const getStorageData = useCallback(() => {
        const storedId = storage.getNumber('home_id');
        if (storedId !== undefined) {
            sethomeId(storedId);
        }
    });

    useFocusEffect(
        useCallback(() => {
            setStorageData();
            getStorageData();
        }, [])
    );

    const dashboardItems = [
        { id: 1, title: 'Compartment', icon: 'box', screen: 'Compartment' },
        { id: 2, title: 'Water Level', icon: 'droplet', screen: 'WaterLevelState' },
        { id: 3, title: 'Temperature', icon: 'thermometer', screen: 'Temperature' },
        { id: 4, title: 'Geyser', icon: 'sun', screen: 'Geyser' },
        { id: 5, title: 'Panic Button', icon: 'alert-triangle' }
    ];

    const handleNavigate = (screen) => {
        if (screen) {
            navigation.navigate(screen, { items: items });
        }
    };

    // const renderDashboardItem = ({ id, title, icon, screen }) => (
    //     <TouchableOpacity
    //         key={id}
    //         style={styles.dashboardbutton}
    //         activeOpacity={0.85}
    //         onPress={() => handleNavigate(screen)}
    //     >
    //         <Icon name={icon} size={36} color="#002255" />
    //         <Text style={styles.dashboradtest}>{title}</Text>
    //     </TouchableOpacity>
    // );

    const renderDashboardItem = ({ id, title, icon, screen }) => {
        const isPanicButton = title === 'Panic Button';

        return (
            <TouchableOpacity
                key={id}
                style={styles.dashboardbutton}
                activeOpacity={0.85}
                onPress={() => {
                    if (isPanicButton) {
                        set_panic_alert_state(); 
                        panic_button_pressed_turn_off_all_appliances_locks_by_home_id()
                    } else {
                        handleNavigate(screen);
                    }
                }}
            >
                <Icon name={icon} size={36} color="#002255" />
                <Text style={styles.dashboradtest}>{title}</Text>
            </TouchableOpacity>
        );
    };

    // const add_mainLog_by_home_id = async () => {
    //     if (!home_id) {
    //         Alert.alert('Error', 'home id missing')
    //         return;
    //     }
    //     const payload = { triggered_by: 'Remotely', messagee: 'Panic Button Pressed', home_id: home_id };
    //     try {
    //         const res = await fetch(`${URL}/add_mainLog_by_home_id`,
    //             {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify(payload),
    //             });
    //         const data = await res.json()
    //         if (res.ok) {
    //             if (data.success) {
    //                 Alert.alert('Successfull', data.success);
    //             } else {
    //                 Alert.alert('Failed', data.error || 'Something went wrong');
    //             }
    //         } else {
    //             Alert.alert('Failed', data.error || 'Server error occurred');
    //         }
    //     } catch (error) {
    //         Alert.alert('Error', error.message);
    //     }
    // };

    const panic_button_pressed_turn_off_all_appliances_locks_by_home_id = async () => {
        try {
            const response = await fetch(`${URL}/panic_button_pressed_turn_off_all_appliances_locks_by_home_id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ home_id:items.home_id }), // example: { "state": 1 }
            });

            if (response.ok) {
                return;
            } else {
                console.error('Failed to turn of all appliances with home id');
            }
        } catch (error) {
            console.error('Error setting panic alert state:', error);
        }
    };

    const rows = [];
    for (let i = 0; i < dashboardItems.length; i += 2) {
        const pair = dashboardItems.slice(i, i + 2);
        rows.push(
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
                {pair.map(renderDashboardItem)}
            </View>
        );
    }

    const set_panic_alert_state = async () => {
        try {
            const response = await fetch(`${URL}/set_panic_alert_state`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state: 1 }), // example: { "state": 1 }
            });

            if (response.ok) {
                return;
            } else {
                console.error('Failed to set panic alert state');
            }
        } catch (error) {
            console.error('Error setting panic alert state:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={[styles.navbar]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.navbarText}>Smart Home</Text>
                </View>
                <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                    <Icon name="more-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {menuVisible && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 25,
                        backgroundColor: 'white',
                        elevation: 5,
                        borderRadius: 8,
                        borderColor: '#002255',
                        borderWidth: 2,
                        paddingVertical: 20,
                        paddingHorizontal: 25,
                        zIndex: 999
                    }}
                >
                    <TouchableOpacity onPress={() => {
                        setMenuVisible(false);
                        navigation.navigate('LogRecord', { items: items })
                    }}>
                        <Text style={{ fontSize: 16, paddingVertical: 6 }}>Records</Text>
                    </TouchableOpacity>
                </View>
            )}


            <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
                <View style={styles.innerContainer}>{rows}</View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default DashBoard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    navbar: {
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    navbarText: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontWeight: '800',
    },
    innerContainer: {
        paddingHorizontal: 20,
    },
    dashboardbutton: {
        backgroundColor: '#F4F7FF',
        paddingVertical: 30,
        paddingHorizontal: 16,
        borderRadius: 20,
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#002255',
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 100,
        // elevation: 10,
        borderColor: '#002255',
        borderWidth: 0.5
    },
    dashboradtest: {
        fontSize: 14,
        fontWeight: '700',
        color: '#002255',
        marginTop: 10,
        textAlign: 'center',
    },
});
