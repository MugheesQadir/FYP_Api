import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native'
import React from 'react';
import styles from './Styles';

const MainScreen = ({ navigation }) => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.navbar}>
                <View style={{ flex: 1 }}><Text style={styles.navbarText}>Main Screen</Text></View>
            </View>

            <View style={[styles.innerContainer,{ flex:1, justifyContent: 'center', backgroundColor: 'white',marginTop:0 }]}>
                <Image
                    source={require('../Images/Iot4.png')}
                    style={styles.image}
                />

                <Text style={styles.description}>IoT based smart homes use interconnected devices to offer remote control, energy efficiency, enhanced security, and automation.</Text>

                <View style={{ backgroundColor: '#001F6D', padding: 10, width: '70%', borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
            </KeyboardAvoidingView >
  )
};

export default MainScreen

