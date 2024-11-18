import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';

const PaymentScreen = ({ route, navigation }) => {
  const { totalPrice } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [currentTime, setCurrentTime] = useState('');
  const { clearCart, cartItems } = useContext(CartContext);
  const { addOrderToHistory } = useContext(OrderContext);
  const [userName, setUserName] = useState(''); // Biến lưu tên người dùng

  useEffect(() => {
    // Lấy tên người dùng từ AsyncStorage
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('username');
      if (name) setUserName(name);
    };
    fetchUserName();

    // Cập nhật thời gian mỗi giây
    const intervalId = setInterval(() => {
      const currentTimeVN = new Date().toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(currentTimeVN);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Xác thực và xử lý thanh toán
  const handlePaymentSuccess = () => {
    authenticatePayment();
  };

  const authenticatePayment = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Authentication error', 'Please set up biometric authentication on your device.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to pay with Face ID',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        processOrder();
      } else {
        Alert.alert('Authentication failed', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Authentication error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    }
  };

  // Hàm xử lý đơn hàng
  const processOrder = () => {
    const orderDetails = {
      items: cartItems,
      totalPrice,
      time: currentTime,
      address: 'LLC 1, 276 Thái Hà, quận Đống Đa, Hà Nội',
      paymentMethod,
    };

    addOrderToHistory(orderDetails);

    Alert.alert('Payment Successful', `Your account has been charged BYN ${totalPrice}.`);
    clearCart();

    // Điều hướng đến màn hình xác nhận đơn hàng
    navigation.navigate('OrderConfirmation', {
      orderTime: currentTime,
      address: orderDetails.address,
    });

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Payment</Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Current Time (Hanoi):</Text>
        <Text style={styles.timeValue}>{currentTime}</Text>
      </View>

      <View style={styles.paymentContainer}>
        <View style={styles.storeInfo}>
          <Ionicons name="cart-outline" size={24} color="black" />
          <View style={styles.storeTextContainer}>
            <Text style={styles.storeName}>{userName || 'Alex'}</Text>
            <Text style={styles.storeDetails}>LLC Coffee</Text>
            <Text style={styles.storeDetails}>LLC 1, 276 Thái Hà, quận Đống Đa, Hà Nội</Text>
          </View>
        </View>

        {/* Tùy chọn thanh toán */}
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'online' && styles.selectedOption]}
            onPress={() => setPaymentMethod('online')}
          >
            <View style={styles.optionContent}>
              <Ionicons name="radio-button-on" size={20} color={paymentMethod === 'online' ? '#000' : '#ccc'} />
              <Text style={styles.optionText}>Online payment</Text>
            </View>
            <Image source={require('../assets/assist.png')} style={styles.paymentLogo} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedOption]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.optionContent}>
              <Ionicons name="radio-button-on" size={20} color={paymentMethod === 'card' ? '#000' : '#ccc'} />
              <Text style={styles.optionText}>Credit Card</Text>
            </View>
            <View style={styles.cardIcons}>
              <Image source={require('../assets/visa.png')} style={styles.cardIcon} />
              <Image source={require('../assets/Mastercard.png')} style={styles.cardIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>BYN {totalPrice}</Text>
        </View>

        <View style={styles.payContainer}>
          <TouchableOpacity style={styles.payButton} onPress={handlePaymentSuccess}>
            <View style={styles.payButtonContent}>
              <Ionicons name="card-outline" size={20} color="#fff" />
              <Text style={styles.payButtonText}> Pay Now</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.totalPrice}>Total Price: BYN {totalPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  timeContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timeLabel: {
    fontSize: 16,
    color: '#777',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  storeTextContainer: {
    marginLeft: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeDetails: {
    fontSize: 14,
    color: '#777',
  },
  paymentOptions: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: '#000',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  paymentLogo: {
    width: 60,
    height: 30,
    resizeMode: 'contain',
  },
  cardIcons: {
    flexDirection: 'row',
  },
  cardIcon: {
    width: 40,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountValue: {
    fontSize: 16,
  },
  payContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  },
});

export default PaymentScreen;
