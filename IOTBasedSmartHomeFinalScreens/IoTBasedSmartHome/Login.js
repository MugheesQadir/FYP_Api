import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
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

        try {
            const res = await fetch(`${URL}/login_person`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.id) {
                Alert.alert('Login Successful', `Welcome ${data.name}`);
                navigation.navigate('Home', { items: data });
                setEmail('');
                setPassword('');
            } else {
                Alert.alert('Login failed', data.error || 'Invalid credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('An error occurred. Please try again later.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            setSecureText(true);
        }, [])
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.90, justifyContent: 'center' }}>
                        <Text style={styles.navbarText}>Login</Text>
                    </View>
                </View>

                <View style={[styles.innerContainer,]}>
                    <Image source={require('../Images/Iot4.png')} style={styles.image} />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <View style={[styles.input, { flexDirection: 'row', padding: 0 }]}>
                        <TextInput
                            style={{ flex: 1, color: 'black', fontSize: 18 }}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="gray"
                            secureTextEntry={secureText}
                        />
                        <TouchableOpacity onPress={() => setSecureText(!secureText)} style={{ justifyContent: 'center' }}>
                            <Iconn
                                name={secureText ? "eye-off" : "eye"}
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.Bottombtn, {  }]}>
                    <TouchableOpacity style={styles.button} onPress={Login_method}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.buttonText}>SignUp</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
