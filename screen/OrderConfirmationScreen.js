import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const OrderConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderTime, address } = route.params || { orderTime: '18:10', address: 'Bradford BD1 1PR' };
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('username');
      if (name) setUserName(name);
    };
    fetchUserName();

    // Tự động điều hướng về HomeScreen sau 3 giây
    const timer = setTimeout(() => {
      navigation.navigate('HomeScreen', { showRatingModal: true });
    }, 3000);

    // Xóa timer khi component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.imageContainer}>
        <Image source={require('../assets/sucess.png')} style={styles.successImage} />
      </View>

      {/* Success Message */}
      <Text style={styles.title}>Order Confirmed</Text>
      <Text style={styles.message}>
        Your order has been successfully placed, {userName || 'Guest'}!
      </Text>

      {/* Order Information */}
      <Text style={styles.info}>
        The order will be ready today at {orderTime} at the address:
      </Text>
      <Text style={styles.address}>{address}</Text>

      {/* QR Code Prompt */}
      <Text style={styles.qrInfo}>
        Please submit your personal QR code at the coffee shop to receive your order.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 30,
  },
  successImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4CAF50',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrInfo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
});

export default OrderConfirmationScreen;
