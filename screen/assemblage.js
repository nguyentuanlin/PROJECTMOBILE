import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const CoffeeLoverAssemblage = () => {
  const navigation = useNavigation();

  const [coffeeType, setCoffeeType] = useState(0.5);
  const [roastingLevel, setRoastingLevel] = useState(3);
  const [grinding, setGrinding] = useState(true);
  const [iceLevel, setIceLevel] = useState(1);
  const [selectedMilk, setSelectedMilk] = useState('None');
  const [selectedSyrup, setSelectedSyrup] = useState('None');
  const [selectedAdditives, setSelectedAdditives] = useState([]);
  const [selectedBarista, setSelectedBarista] = useState('');
  const [totalPrice, setTotalPrice] = useState(0.00);
  const [milkModalVisible, setMilkModalVisible] = useState(false);
  const [syrupModalVisible, setSyrupModalVisible] = useState(false);

  const milkOptions = ['None', 'Cow\'s', 'Lactose-free', 'Skimmed', 'Vegetable'];
  const syrupOptions = ['None', 'Amaretto', 'Coconut', 'Vanilla', 'Caramel'];

  const calculateTotalPrice = () => {
    let price = 0.00;

    price += coffeeType === 0.5 ? 0.50 : 1.00;
    price += roastingLevel * 0.2;
    price += iceLevel * 0.3;
    if (selectedMilk !== 'None') price += 0.5;
    if (selectedSyrup !== 'None') price += 0.5;
    price += selectedAdditives.length * 0.3;

    setTotalPrice(price.toFixed(2));
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [coffeeType, roastingLevel, iceLevel, selectedMilk, selectedSyrup, selectedAdditives]);

  const toggleAdditive = (additive) => {
    setSelectedAdditives(prev =>
      prev.includes(additive)
        ? prev.filter(item => item !== additive)
        : [...prev, additive]
    );
  };

  const openBaristaSelection = () => {
    navigation.navigate('SelectBaristaScreen', {
      onSelect: (baristaName) => setSelectedBarista(baristaName),
    });
  };

  const handleSelectAdditives = () => {
    navigation.navigate('AdditivesScreen', {
      selectedAdditives,
      onSelect: (newAdditives) => setSelectedAdditives(newAdditives),
    });
  };

  const handleNextPress = () => {
    navigation.navigate('OrderScreen', { totalPrice: parseFloat(totalPrice) });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Coffee Lover Assemblage</Text>

      {/* Chọn Barista */}
      <TouchableOpacity 
        style={styles.option}
        onPress={openBaristaSelection}
      >
        <Text style={styles.label}>{selectedBarista || 'Select a barista'}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#888" />
      </TouchableOpacity>

      {/* Loại cà phê */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Coffee Type</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FF4500"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#000"
          value={coffeeType}
          onValueChange={setCoffeeType}
        />
        <View style={styles.coffeeTypes}>
          <Text>Arabica</Text>
          <Text>Robusta</Text>
        </View>
      </View>

      {/* Mức độ rang */}
      <View style={styles.option}>
        <Text style={styles.label}>Roasting Level</Text>
        <View style={styles.roastingIcons}>
          {[1, 2, 3, 4, 5].map(level => (
            <TouchableOpacity
              key={level}
              onPress={() => setRoastingLevel(level)}
              style={styles.roastingIcon}
            >
              <MaterialCommunityIcons 
                name="fire" 
                size={28} 
                color={level <= roastingLevel ? '#FF4500' : '#ccc'} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Xay cà phê */}
      <View style={styles.option}>
        <Text style={styles.label}>Grinding</Text>
        <TouchableOpacity onPress={() => setGrinding(!grinding)}>
          <MaterialCommunityIcons 
            name={grinding ? 'coffee' : 'coffee-off'}
            size={28} 
            color={grinding ? '#FF4500' : '#ccc'} 
          />
        </TouchableOpacity>
      </View>

      {/* Mức đá */}
      <View style={styles.option}>
        <Text style={styles.label}>Ice</Text>
        <View style={styles.iceIcons}>
          {['Little', 'Normal', 'A lot'].map((ice, index) => (
            <TouchableOpacity
              key={ice}
              onPress={() => setIceLevel(index + 1)}
              style={iceLevel === index + 1 ? styles.iceIconActive : styles.iceIcon}
            >
              <MaterialCommunityIcons 
                name="snowflake" 
                size={24} 
                color={iceLevel === index + 1 ? '#FFF' : '#000'}
              />
              <Text style={iceLevel === index + 1 ? styles.iceTextActive : styles.iceText}>
                {ice}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sữa */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => setMilkModalVisible(true)}
      >
        <Text style={styles.label}>Milk</Text>
        <Text style={[styles.arrow, { color: selectedMilk !== 'None' ? '#FF4500' : '#ccc' }]}>
          {selectedMilk}
        </Text>
      </TouchableOpacity>

      {/* Modal chọn sữa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={milkModalVisible}
        onRequestClose={() => setMilkModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What type of milk do you prefer?</Text>
            {milkOptions.map((milk) => (
              <Pressable
                key={milk}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedMilk(milk);
                  setMilkModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{milk}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.cancelButton}
              onPress={() => setMilkModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Syrup */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => setSyrupModalVisible(true)}
      >
        <Text style={styles.label}>Syrup</Text>
        <Text style={[styles.arrow, { color: selectedSyrup !== 'None' ? '#FF4500' : '#ccc' }]}>
          {selectedSyrup}
        </Text>
      </TouchableOpacity>

      {/* Modal chọn syrup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={syrupModalVisible}
        onRequestClose={() => setSyrupModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What flavor of syrup do you prefer?</Text>
            {syrupOptions.map((syrup) => (
              <Pressable
                key={syrup}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedSyrup(syrup);
                  setSyrupModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{syrup}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.cancelButton}
              onPress={() => setSyrupModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Button chọn phụ gia */}
      <TouchableOpacity 
        style={styles.option} 
        onPress={handleSelectAdditives}
      >
        <Text style={styles.label}>Additives</Text>
        <Text style={[styles.arrow, { color: selectedAdditives.length ? '#FF4500' : '#ccc' }]}>
          {selectedAdditives.length ? `${selectedAdditives.length} selected` : 'Select'}
        </Text>
      </TouchableOpacity>

      {/* Tổng tiền */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalPrice}>BYN {totalPrice}</Text>
      </View>

      {/* Nút tiếp theo */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  sliderContainer: {
    marginVertical: 15,
  },
  coffeeTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  roastingIcons: {
    flexDirection: 'row',
  },
  roastingIcon: {
    padding: 5,
  },
  iceIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  iceIcon: {
    padding: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    width: 70,
  },
  iceIconActive: {
    padding: 5,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    alignItems: 'center',
    width: 70,
  },
  iceText: {
    color: '#000',
    marginTop: 5,
  },
  iceTextActive: {
    color: '#FFF',
    marginTop: 5,
  },
  additivesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  additiveOption: {
    backgroundColor: '#FFF',
    borderColor: '#FF4500',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
  },
  additiveActive: {
    backgroundColor: '#FF4500',
  },
  additiveText: {
    color: '#FF4500',
  },
  additiveTextActive: {
    color: '#FFF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  nextButton: {
    backgroundColor: '#FF4500',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF4500',
    fontWeight: 'bold',
  },
});

export default CoffeeLoverAssemblage;
