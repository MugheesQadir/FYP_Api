import {
    StyleSheet, Text, View, Image, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native'
import React, { useState } from 'react'
import styles from './Styles'
import Icon from 'react-native-vector-icons/Feather';
import URL from './Url';

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setemail] = useState('')
    const [Password, setPassword] = useState('')
    const [cpass, setConpass] = useState('')

    const SignUp = async () => {
        if (!email || !Password || !name || !cpass) {
                    Alert.alert('Error', 'Please enter all fields');
                    return;
                }
        var person = { name: name, email: email, password: Password ,role:'user'};
        try {
            if (Password == '' || cpass == '') {
                Alert.alert('Error', 'Please! Enter all fields')
                return;
            }

            if (Password == cpass) {
                var url = `${URL}/SignUp_Person`;
                var res = await fetch(url,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(person),
                    }
                )
                const data = await res.json()
                if (res.ok) {
                    if (data.success) {
                        Alert.alert('SignUp Successful', data.success);
                        navigation.goBack();
                        setConpass('')
                        setName('')
                        setPassword('')
                        setemail('')
                    } else {
                        Alert.alert('SignUp Failed', data.message || 'Something went wrong');
                    }
                } else {
                    Alert.alert('SignUp Failed', data.message || 'Server error occurred');
                }
            }
            else {
                Alert.alert('Confirm Password is Not matched')
            }
        }
        catch (ea) {

        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}><Text style={[styles.navbarText, { marginRight: 25 }]}>Sign Up</Text></View>

                </View>

                <View style={styles.innerContainer}>


                    <Image source={require('../Images/Iot4.png')} style={styles.image} />

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        placeholderTextColor={'gray'}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        placeholderTextColor={'gray'}
                        onChangeText={setemail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={Password}
                        placeholderTextColor={'gray'}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={cpass}
                        placeholderTextColor={'gray'}
                        onChangeText={setConpass}
                    />

                    <View style={styles.Bottombtn}>

                        <View style={{ position:'absolute', backgroundColor: '#001F6D', padding: 10, width: '70%', borderRadius: 10 ,}}>
                            <TouchableOpacity onPress={SignUp}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>SignUp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    )
}

export default SignUp
