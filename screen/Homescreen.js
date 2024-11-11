import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const coffeeList = [
  { id: '1', name: 'Americano', image: require('../assets/cafe-americano.jpg') },
  { id: '2', name: 'Cappuccino', image: require('../assets/cappuccino.png') },
  { id: '3', name: 'Latte', image: require('../assets/latte.webp') },
  { id: '4', name: 'Flat White', image: require('../assets/flat_white.webp') },
  { id: '5', name: 'Raf', image: require('../assets/raf.jpeg') },
  { id: '6', name: 'Espresso', image: require('../assets/espresso.jpeg') },
];

const { width } = Dimensions.get('window');
const itemWidth = width * 0.43;

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Home');
  const [cartCount, setCartCount] = useState(0);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const loadUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    const loadCartCount = async () => {
      const cartItems = await AsyncStorage.getItem('cartItems');
      const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
      setCartCount(parsedCartItems.length);
    };

    loadUsername();
    loadCartCount();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadCartCount = async () => {
        const cartItems = await AsyncStorage.getItem('cartItems');
        const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
        setCartCount(parsedCartItems.length);
      };

      loadCartCount();
      setSelectedIcon('Home');

      if (route.params?.showRatingModal) {
        setIsRatingModalVisible(true);
      }
    }, [route.params])
  );

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const handleCloseModal = () => {
    setIsRatingModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.coffeeItem, { width: itemWidth }]}
      onPress={() => navigation.navigate('OrderScreen', { coffeeName: item.name, coffeeImage: item.image })}
    >
      <Image source={item.image} style={styles.coffeeImage} />
      <Text style={styles.coffeeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleIconPress = (screen, icon) => {
    if (icon !== 'Home' || selectedIcon !== 'Home') {
      setSelectedIcon(icon);
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text> 
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={24} color="black" style={styles.icon} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách cà phê */}
      <Text style={styles.sectionTitle}>Select your coffee</Text>
      <FlatList
        data={coffeeList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.coffeeList}
      />

      {/* Điều hướng dưới cùng */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => handleIconPress('Home', 'Home')}>
          <Ionicons name="home-outline" size={30} color={selectedIcon === 'Home' ? 'white' : 'gray'} />
          <Text style={{ color: selectedIcon === 'Home' ? 'white' : 'gray' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('Rewards', 'Rewards')}>
          <Ionicons name="gift-outline" size={30} color={selectedIcon === 'Rewards' ? 'white' : 'gray'} />
          <Text style={{ color: selectedIcon === 'Rewards' ? 'white' : 'gray' }}>Gifts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('Receipt', 'Receipts')}>
          <Ionicons name="receipt-outline" size={30} color={selectedIcon === 'Receipts' ? 'white' : 'gray'} />
          <Text style={{ color: selectedIcon === 'Receipts' ? 'white' : 'gray' }}>Receipts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('Map', 'Map')}>
          <Ionicons name="map-outline" size={30} color={selectedIcon === 'Map' ? 'white' : 'gray'} />
          <Text style={{ color: selectedIcon === 'Map' ? 'white' : 'gray' }}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Modal đánh giá */}
      <Modal
        visible={isRatingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>The order has been completed.</Text>
            <Text style={styles.modalSubtitle}>Please, rate the service.</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => handleRatingPress(value)}>
                  <Ionicons
                    name={value <= rating ? "star" : "star-outline"}
                    size={36}
                    color={value <= rating ? '#FF9500' : '#ccc'}
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.laterButton} onPress={handleCloseModal}>
              <Text style={styles.laterButtonText}>Remind me later</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noThanksButton} onPress={handleCloseModal}>
              <Text style={styles.noThanksButtonText}>No, thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginVertical: 20,
  },
  coffeeList: {
    paddingHorizontal: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  coffeeItem: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#1e3d59',
  },
  coffeeImage: {
    width: itemWidth * 0.7,
    height: itemWidth * 0.7,
    marginBottom: 10,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  coffeeName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#2c3e50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  laterButton: {
    backgroundColor: '#FF9500',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  laterButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noThanksButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  noThanksButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
