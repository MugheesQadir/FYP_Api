import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import Iconn from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from '@react-navigation/native';

import URL from './Url';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);

    const Login_method = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter all fields');
            return;
        }

        const person = { email, password };
        try {
            const url = `${URL}/login_person`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(person),
            });

            const data = await res.json();  // Response ko JSON format me parse karna zaroori hai

            if (res.ok) {
                if (data.id) {
                    Alert.alert('Login Successful', `Welcome ${data.name}`);
                    navigation.navigate('Home', { items: data });
                    setEmail('')
                    setPassword('')
                } else {
                    Alert.alert('Login failed', data.error || 'Invalid credentials.');
                }
            } else {
                Alert.alert('Login failed', data.error || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('An error occurred. Please try again later.');
        }
    };

    useFocusEffect(
            useCallback(() => {
                setSecureText(true)
            }, [])
        );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.replace('MainScreen')}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}><Text style={[styles.navbarText, { marginRight: 25 }]}>Login</Text></View>

                </View>
                <View style={[styles.innerContainer, { marginTop: '10%' }]}>
                    <Image source={require('../Images/Iot4.png')} style={styles.image} />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        placeholderTextColor={'gray'}
                        onChangeText={setEmail}
                    />
                    <View style={{ flexDirection: 'row', marginBottom: 10, borderRadius: 15, backgroundColor: 'white',
                         borderColor: 'black', borderWidth: 0.7 ,width: '100%'}}>
                        <TextInput
                            style={{
                                color: 'black',
                                fontSize: 18,
                                padding: 10,
                                width: '90%',
                            }}
                            placeholder="Password"
                            value={password}
                            placeholderTextColor={'gray'}
                            secureTextEntry={secureText}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setSecureText(!secureText)}
                            style={{justifyContent:'center',alignItems:'center'}}>
                            <Iconn
                                name={secureText ? "eye-off" : "eye"} // Toggle between icons
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.Bottombtn}>
                        <View style={{ backgroundColor: '#001F6D', padding: 10, width: '70%', borderRadius: 10, marginBottom: 10 }}>
                            <TouchableOpacity onPress={Login_method}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Login</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ position: '', backgroundColor: '#001F6D', padding: 10, width: '70%', borderRadius: 10 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>SignUp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;


