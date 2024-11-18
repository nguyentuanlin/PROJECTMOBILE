import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigation = useNavigation();

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDeleteItem = (id) => {
    removeFromCart(id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1.2) }],
  }));

  const renderRightActions = (item) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
      <Animated.View style={animatedStyle}>
        <Icon name="delete" size={30} color="#e74c3c" />
      </Animated.View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
          </View>
          <Text style={styles.itemPrice}>BYN {item.price ? item.price.toFixed(2) : '0.00'}</Text>
        </View>
      </View>
    </Swipeable>
  );

  const handleNext = () => {
    if (cartItems.length > 0) {
      navigation.navigate('Payment', { totalPrice: totalAmount.toFixed(2) });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>My Order</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyCartText}>Your cart is empty</Text>}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Price</Text>
        <Text style={styles.totalAmount}>BYN {totalAmount.toFixed(2)}</Text>
      </View>
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Icon name="shopping-cart" size={24} color="#fff" style={styles.cartIcon} />
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemInfo: {
    marginLeft: 15,
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#007bff',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 15,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: 50,
    height: '100%',
  },
  nextButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  cartIcon: {
    marginRight: 5,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 20,
  },
});

export default CartScreen;
