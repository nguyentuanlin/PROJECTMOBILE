import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

const initialRewardsHistory = [
  { id: '1', name: 'Americano', date: '24 June | 12:30', points: 12 },
  { id: '2', name: 'Latte', date: '22 June | 08:30', points: 12 },
  { id: '3', name: 'Raf', date: '16 June | 10:48', points: 12 },
  { id: '4', name: 'Flat White', date: '12 May | 11:25', points: 12 },
];

const drinks = [
  { id: '1', name: 'Espresso', image: require('../assets/espresso.jpeg') },
  { id: '2', name: 'americano', image: require('../assets/cafe-americano.jpg') },
  { id: '3', name: 'cappuccino', image: require('../assets/cappuccino.png') },
  { id: '4', name: 'flat_white', image: require('../assets/flat_white.webp') },
  { id: '5', name: 'latte', image: require('../assets/latte.webp') },
];

const RewardsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [cupsFilled, setCupsFilled] = useState(4);
  const [rewardsHistory, setRewardsHistory] = useState(initialRewardsHistory);
  const [showConfetti, setShowConfetti] = useState(false);
  const [points, setPoints] = useState(2750); // Khởi tạo điểm ban đầu

  const filteredDrinks = drinks.filter(drink => drink.name.toLowerCase().includes(searchText.toLowerCase()));

  const handleDrinkSelect = (drink) => {
    setSelectedDrink(drink);
    setHistoryModalVisible(true);
    setModalVisible(false);
  };

  const confirmRedeem = () => {
    Alert.alert(
      'Confirm Redemption',
      `Are you sure you want to redeem a ${selectedDrink.name}?`,
      [
        { text: 'Cancel', onPress: () => setHistoryModalVisible(false) },
        { 
          text: 'OK', 
          onPress: () => {
            Alert.alert('Success', `You have redeemed a ${selectedDrink.name}!`);
            setHistoryModalVisible(false);
            increaseCupCount();
          } 
        },
      ]
    );
  };

  const increaseCupCount = () => {
    setCupsFilled(prev => {
      if (prev < 7) {
        setPoints(points + 10); // Tăng điểm mỗi lần thêm cốc
        return prev + 1;
      } else {
        handleRewardAchieved();
        return 0; // reset số cốc sau khi đầy
      }
    });
  };

  const handleRewardAchieved = () => {
    Alert.alert('Congratulations!', 'You have earned a free drink!');
    setRewardsHistory((prevHistory) => prevHistory.slice(1));
    setShowConfetti(true);
    setPoints(points + 50); // Tăng điểm khi nhận phần thưởng
  };

  const removeRewardItem = (id) => {
    setRewardsHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    increaseCupCount(); // Tăng điểm khi xóa mục
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rewards</Text>
      </View>

      <View style={styles.loyaltyCardOuter}>
        <View style={styles.loyaltyCardContainer}>
          <Text style={styles.loyaltyText}>Loyalty card</Text>
          <View style={styles.cupContainer}>
            {Array(8).fill().map((_, index) => (
              <MaterialCommunityIcons
                key={index}
                name={index < cupsFilled ? "cup" : "cup-outline"}
                size={30}
                color={index < cupsFilled ? '#FFD700' : '#ccc'}
              />
            ))}
          </View>
          <Text style={styles.loyaltyProgressText}>{cupsFilled} / 8</Text>
        </View>
      </View>

      <View style={styles.myPointsOuter}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>My Points:</Text>
          <Text style={styles.pointsNumber}>{points}</Text> 
          <TouchableOpacity style={styles.redeemButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.redeemButtonText}>Redeem drinks</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>History Rewards</Text>
      {rewardsHistory.map((item) => (
        <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => removeRewardItem(item.id)}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
          <Text style={styles.itemPoints}>+ {item.points} Pts</Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a drink..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <Text style={styles.modalTitle}>Select a Drink</Text>
            <FlatList
              data={filteredDrinks}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.drinkItem} onPress={() => handleDrinkSelect(item)}>
                  <Image source={item.image} style={styles.drinkImage} />
                  <Text style={styles.drinkName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={historyModalVisible}
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Redeem Drink</Text>
            {selectedDrink && (
              <>
                <Text style={styles.drinkName}>{selectedDrink.name}</Text>
                <Text style={styles.pointsText}>Points Required: {selectedDrink.points} Pts</Text>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmRedeem}>
                  <Text style={styles.confirmButtonText}>Confirm Redeem</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fadeOut={true}
          onAnimationEnd={() => setShowConfetti(false)} // Dừng pháo hoa sau khi hoàn tất
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // căn giữa tiêu đề
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loyaltyCardOuter: {
    backgroundColor: '#003366', 
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  loyaltyCardContainer: {
    alignItems: 'center',
  },
  loyaltyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cupContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  loyaltyProgressText: {
    fontSize: 14,
    color: '#ccc',
  },
  myPointsOuter: {
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  redeemButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  redeemButtonText: {
    fontWeight: 'bold',
    color: '#003366',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  historyItem: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 8,
    elevation: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  itemPoints: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  drinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  drinkImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    fontWeight: 'bold',
    color: '#003366',
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default RewardsScreen;
