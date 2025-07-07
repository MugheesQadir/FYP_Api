import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const iconMap = {
  success: { name: 'checkcircle', color: '#28C76F' },
  error: { name: 'closecircle', color: '#EA5455' },
  warning: { name: 'warning', color: '#FF9F43' },
  info: { name: 'infocirlce', color: '#00CFE8' },
};

const EmergencyAlert = ({ visible, title, message, type = 'info', onClose }) => {
  const scale = new Animated.Value(1);
  const icon = iconMap[type] || iconMap.info;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();

      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* <Animated.View style={[styles.iconContainer, { backgroundColor: icon.color, transform: [{ scale }] }]}>
            <AntDesign name={icon.name} size={60} color="#fff" />
          </Animated.View> */}

          <Text style={[styles.title, { color: '#ff6b6b'/*icon.color*/ }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#ff6b6b' }]} onPress={onClose}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EmergencyAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '85%',
  },
  iconContainer: {
    padding: 20,
    borderRadius: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    marginVertical: 12,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
