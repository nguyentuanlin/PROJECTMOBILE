  import React, { useState, useEffect, useContext } from 'react';
  import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import { CartContext } from '../context/CartContext'; // Import CartContext

  const basePrice = 3.00;

  const OrderScreen = ({ route, navigation }) => {
    const { addToCart, cartItems } = useContext(CartContext); // Lấy cartItems từ CartContext
    const { 
      coffeeName = 'Cappuccino', 
      coffeeImage = require('../assets/cappuccino.png'), 
    } = route.params || {};

    const [quantity, setQuantity] = useState(1);
    const [ristretto, setRistretto] = useState('One');
    const [takeaway, setTakeaway] = useState(false);
    const [volume, setVolume] = useState(350);
    const [prepareByTime, setPrepareByTime] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
      if (prepareByTime) {
        const intervalId = setInterval(() => {
          const currentTimeVN = new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
          setCurrentTime(currentTimeVN);
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(intervalId); // Dọn dẹp khi component bị hủy
      } else {
        setCurrentTime('');
      }
    }, [prepareByTime]);

    const handleIncrease = () => setQuantity(quantity + 1);
    const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const calculatePrice = () => {
      let price = basePrice;
      if (volume === 450) price += 0.5;
      if (volume === 550) price += 1.0;
      if (takeaway) price += 0.3;
      return price * quantity;
    };

    const handleAddToCart = () => {
      const item = {
        id: Math.random().toString(), // Unique ID for the item
        name: coffeeName,
        quantity,
        price: parseFloat(calculatePrice()), // Đảm bảo price là số
        image: coffeeImage,
        ristretto,
        volume,
        takeaway,
      };
      addToCart(item); // Thêm sản phẩm vào giỏ hàng
      navigation.navigate('Cart'); // Điều hướng tới màn hình giỏ hàng
    };

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Order</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <View style={styles.cartIconContainer}>
              <Ionicons name="cart-outline" size={24} color="black" />
              {/* Hiển thị số lượng sản phẩm trong giỏ */}
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Coffee Image */}
        <View style={styles.imageContainer}>
          <Image source={coffeeImage} style={styles.coffeeImage} />
        </View>

        {/* Coffee Name and Quantity */}
        <View style={styles.row}>
          <Text style={styles.coffeeName}>{coffeeName}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ristretto Selection */}
        <View style={styles.optionRow}>
          <Text style={styles.optionTitle}>Ristretto</Text>
          <View style={styles.selectionContainer}>
            {['One', 'Two'].map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, ristretto === option && styles.selectedOption]}
                onPress={() => setRistretto(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Onsite / Takeaway */}
        <View style={styles.optionRow}>
          <Text style={styles.optionTitle}>Onsite / Takeaway</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => setTakeaway(false)}>
              <Ionicons name="cafe-outline" size={40} color={!takeaway ? '#000' : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTakeaway(true)}>
              <Ionicons name="fast-food-outline" size={40} color={takeaway ? '#000' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Volume Selection */}
        <View style={styles.optionRow}>
          <Text style={styles.optionTitle}>Volume, ml</Text>
          <View style={styles.selectionContainer}>
            {[250, 350, 450].map(vol => (
              <TouchableOpacity
                key={vol}
                style={[styles.optionButton, volume === vol && styles.selectedOption]}
                onPress={() => setVolume(vol)}>
                <Ionicons name="cafe-outline" size={30} color={volume === vol ? '#000' : '#ccc'} />
                <Text style={styles.optionText}>{vol}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prepare by a certain time */}
        <View style={styles.optionRow}>
          <Text style={styles.optionTitle}>Prepare by a certain time today?</Text>
          <Switch value={prepareByTime} onValueChange={setPrepareByTime} />
          {prepareByTime && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{currentTime}</Text>
            </View>
          )}
        </View>

        {/* Special Request Button */}
        <TouchableOpacity
          style={styles.specialRequestButton}
          onPress={() => navigation.navigate('Assemblage')}
        >
          <Text style={styles.specialRequestText}>Coffee lover assemblage</Text>
        </TouchableOpacity>

        {/* Total Amount */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.amountText}>BYN {calculatePrice().toFixed(2)}</Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.nextButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f4',
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    cartIconContainer: {
      position: 'relative',
    },
    cartBadge: {
      position: 'absolute',
      right: -10,
      top: -10,
      backgroundColor: '#ff0000',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    coffeeImage: {
      width: 200,
      height: 150,
      borderRadius: 10,
      resizeMode: 'contain',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    coffeeName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 5,
      borderRadius: 5,
      backgroundColor: '#f8f8f8',
    },
    quantityText: {
      marginHorizontal: 10,
      fontSize: 18,
      color: '#333',
    },
    buttonText: {
      fontSize: 18,
      color: '#000',
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#555',
    },
    selectionContainer: {
      flexDirection: 'row',
    },
    optionButton: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 8,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    selectedOption: {
      backgroundColor: '#87cefa',
      borderColor: '#87cefa',
    },
    optionText: {
      fontSize: 14,
      color: '#333',
      marginTop: 5,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 150,
    },
    specialRequestButton: {
      backgroundColor: '#f39c12',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 20,
    },
    specialRequestText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
    },
    totalText: {
      fontSize: 18,
      color: '#333',
    },
    amountText: {
      fontSize: 18,
      color: '#333',
    },
    nextButton: {
      backgroundColor: '#27ae60',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    nextButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    timeContainer: {
      marginTop: 10,
    },
    timeText: {
      fontSize: 18,
      color: '#333',
    },
  });

  export default OrderScreen;
