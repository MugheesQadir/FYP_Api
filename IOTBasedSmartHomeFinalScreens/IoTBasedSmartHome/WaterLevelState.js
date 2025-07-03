import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Animated } from 'react-native';
import React, { useState, useCallback, useRef } from 'react';
import URL from './Url';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';

const WaterLevelState = ({ navigation }) => {
    const [waterLevel, SetWaterLevel] = useState(20);
    const [levelDisplay, SetDisplay] = useState('empty');
    const waterHeight = useRef(new Animated.Value(0)).current; // for smooth height animation
    const intervalRef = useRef(null);

    const maxTankHeight = 250; // Height in pixels of the tank (for simulation)

    const levelDis = () => {
        if (waterLevel < 6) {
            SetDisplay('Level : OverFlow');
        } else if (waterLevel >= 6 && waterLevel < 8) {
            SetDisplay('Level : 100%');
        } else if (waterLevel >= 8 && waterLevel < 12) {
            SetDisplay('Level : 80%');
        } else if (waterLevel >= 12 && waterLevel < 16) {
            SetDisplay('Level : 50%');
        } else if (waterLevel >= 16 && waterLevel < 19) {
            SetDisplay('Level : 30%');
        } else if (waterLevel >= 19) {
            SetDisplay('Level : Empty');
        }
    };

    const Get_water_level_State = async () => {
        try {
            const response = await fetch(`${URL}/get_water_level_state`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const result = await response.json();
                SetWaterLevel(result.state);
            }
        } catch (error) {
            console.error("Error feching water state:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            // This runs when screen comes into focus
            Get_water_level_State();

            intervalRef.current = setInterval(() => {
                Get_water_level_State();
            }, 1000);

            return () => {
                // This runs when screen goes out of focus
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            };
        }, [])
    );

    // When waterLevel changes, animate the blue fill height
    useFocusEffect(
        useCallback(() => {
            levelDis();

            let levelPercentage = 0;

            if (waterLevel >= 6 && waterLevel <= 19) {
                levelPercentage = 1 - ((waterLevel - 6) / (19 - 6)); // Inverted so 6 = full, 19 = empty
            } else if (waterLevel < 6) {
                levelPercentage = 1; // Overflow = full
            } else {
                levelPercentage = 0; // Empty = empty
            }

            const newHeight = maxTankHeight * levelPercentage;

            Animated.timing(waterHeight, {
                toValue: newHeight,
                duration: 500,
                useNativeDriver: false,
            }).start();

        }, [waterLevel])
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { flex: 1, alignItems: 'center', backgroundColor: '#f5f5f5' }]}>

            {/* Navbar */}
            <View style={[styles.navbar]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 0.90, justifyContent: 'center' }}>
                    <Text style={styles.navbarText}>Water Level</Text>
                </View>
            </View>

            {/* Water Tank Simulation - Pure Views No Image */}
            <View style={localStyles.tank}>
                <Animated.View style={[localStyles.water, { height: waterHeight }]} />
            </View>

            {/* Level Text */}
            <View style={[styles.button, { marginTop: 20 }]}>
                <Text style={styles.buttonText}>{levelDisplay}</Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const localStyles = StyleSheet.create({
    tank: {
        width: 150,
        height: 250, // Total height of the tank
        borderWidth: 2,
        borderColor: '#001F6D',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#E0E0E0', // Tank background
        marginTop: 50,
        justifyContent: 'flex-end' // water rises from bottom
    },
    water: {
        width: '100%',
        backgroundColor: '#4FC3F7', // Water color (Blue)
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});

export default WaterLevelState;
