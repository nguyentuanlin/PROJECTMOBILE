import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const baristas = [
  { id: 1, name: 'Tuan Linh', role: 'Top barista', image: require('../assets/linh.jpg'), isAvailable: true },
  { id: 2, name: 'Tien Luyen', role: 'Top barista', image: require('../assets/luyen.jpg'), isAvailable: true },
  { id: 3, name: 'Hung Cuong', role: 'Barista', image: require('../assets/cuong.jpg'), isAvailable: false },
];

const SelectBaristaScreen = () => {
  const navigation = useNavigation();

  const handleSelectBarista = (barista) => {
    // Điều hướng đến màn hình chat và truyền thông tin của barista qua route params
    navigation.navigate('ChatScreen', { barista });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a barista</Text>
      {baristas.map((barista) => (
        <TouchableOpacity
          key={barista.id}
          style={styles.baristaCard}
          onPress={() => handleSelectBarista(barista)}
        >
          <Image source={barista.image} style={styles.baristaImage} />
          <View style={styles.baristaInfo}>
            <Text style={styles.baristaName}>{barista.name}</Text>
            <Text style={styles.baristaRole}>{barista.role}</Text>
            <Text style={styles.availability}>
              {barista.isAvailable ? 'Available' : 'Not Available'}
            </Text>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: barista.isAvailable ? 'green' : 'red' }]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  baristaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  baristaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  baristaInfo: {
    flex: 1,
    marginLeft: 15,
  },
  baristaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  baristaRole: {
    fontSize: 14,
    color: '#666',
  },
  availability: {
    fontSize: 12,
    color: '#888',
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
});

export default SelectBaristaScreen;
