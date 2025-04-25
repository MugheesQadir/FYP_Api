import { StyleSheet, Text, View, Image, TouchableOpacity, Alert ,KeyboardAvoidingView} from 'react-native';
import React, { useEffect, useState,useCallback } from 'react';
import URL from './Url';
import styles from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';


const WaterLevelState = ({ navigation }) => {
    const [waterLevel, SetWaterLevel] = useState(0)
    const [levelDisplay,SetDisplay] = useState('empty')
    const [imageUrl, setImageUrl] = useState('');

    const images = {
        full: require('../Images/full.png'),
        per80 : require('../Images/80.png'),
        per50 : require('../Images/50.png'),
        per30 : require('../Images/30.png'),
        empty : require('../Images/empty.jpeg'),
    };    

    const levelDis = () => {
        if (waterLevel < 6) {
            SetDisplay('OverFlow');
        } else if(waterLevel >= 6 && waterLevel < 8) {
            SetDisplay('100%');
            setImageUrl(images.full);
        } else if (waterLevel >= 8 && waterLevel < 12) {
            SetDisplay('80%');
            setImageUrl(images.per80);
        } else if (waterLevel >= 12 && waterLevel < 16) {
            SetDisplay('50%');
            setImageUrl(images.per50);
        } else if (waterLevel >= 16 && waterLevel < 19) {
            SetDisplay('30%');
            setImageUrl(images.per30);
        } else if (waterLevel >= 19) {
            SetDisplay('Empty');
            setImageUrl(images.empty);
        }
    }

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
          const interval = setInterval(Get_water_level_State, 200);
      
          return () => clearInterval(interval);
        }, [])
      );
      
      useFocusEffect(
        useCallback(() => {
          levelDis();
        }, [waterLevel])
      );
      

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container,{flex: 1, alignItems: 'center', backgroundColor: '#f5f5f5'}]}>
            <View style={[styles.navbar,{}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navbarText, { fontSize: 22, textAlign: 'center', color: 'black',marginRight:22 }]}>Water Level</Text>
        </View>
      </View>

            <Image
                source={imageUrl ? imageUrl : require('../Images/empty.jpeg')}
                style={[styles.image,{width: 300,
                    height: 350,
                    borderWidth: 1,
                    borderRadius: 50,
                    resizeMode: 'stretch',
                    marginTop: 45,}]}
            />

            <View style={[{backgroundColor: 'orange', width: '98%', margin: 5, marginTop: 10, padding: 15, width: '70%', borderRadius: 10, backgroundColor: '#001F6D', padding: 8 }]}>
                <Text style={[{fontSize: 22, textAlign: 'center', color: 'black', color: 'white' }]}>
                    Level : {levelDisplay}</Text>
            </View>
        </KeyboardAvoidingView>
    )
}

export default WaterLevelState