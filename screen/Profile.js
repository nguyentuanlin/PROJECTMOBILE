import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Button, Alert, Share, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeAddresses = [
  'LLC 1, 276 Thái Hà, quận Đống Đa, Hà Nội',
  'LLC2, Tầng 26 tòa Hei Tower, số 1 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội',
  'LLC3, Tầng 2 A11 khu tập thể Khương Thượng, Đống Đa, Hà Nội',
];

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState(null);
  const [newFieldValue, setNewFieldValue] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const usersData = await AsyncStorage.getItem('users');
        const users = JSON.parse(usersData) || [];
        if (users.length > 0) {
          const currentUser = users[users.length - 1];
          setUserInfo({
            name: currentUser.name || '',
            phone: currentUser.mobile || '',
            email: currentUser.email || '',
            address: currentUser.address || storeAddresses[0],
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleEdit = (field) => {
    setFieldToEdit(field);
    setNewFieldValue(userInfo[field]);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    Alert.alert('Confirm Update', 'Do you want to save the changes?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Save',
        onPress: async () => {
          const updatedUserInfo = {
            ...userInfo,
            [fieldToEdit]: newFieldValue,
          };
          setUserInfo(updatedUserInfo);
          setIsModalVisible(false);

          try {
            const usersData = await AsyncStorage.getItem('users');
            const users = JSON.parse(usersData) || [];
            if (users.length > 0) {
              users[users.length - 1] = { ...users[users.length - 1], ...updatedUserInfo };
              await AsyncStorage.setItem('users', JSON.stringify(users));
            }
          } catch (error) {
            console.error('Error saving updated info:', error);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('users');
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          } catch (error) {
            console.error('Error logging out:', error);
          }
        },
      },
    ]);
  };

  const handleShareQRCode = () => {
    Share.share({
      message: 'Here is my Magic Coffee QR Code!',
      url: 'https://example.com/user-qr-code',
    });
  };

  const handleAddressSelect = async (address) => {
    setUserInfo((prev) => ({ ...prev, address }));
    setShowAddressModal(false);

    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersData) || [];
      if (users.length > 0) {
        users[users.length - 1] = { ...users[users.length - 1], address };
        await AsyncStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error saving updated address:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Profile</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="#000" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoText}>{userInfo.name}</Text>
          </View>
          <TouchableOpacity onPress={() => handleEdit('name')}>
            <MaterialIcons name="edit" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="#000" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoText}>{userInfo.phone}</Text>
          </View>
          <TouchableOpacity onPress={() => handleEdit('phone')}>
            <MaterialIcons name="edit" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="#000" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoText}>{userInfo.email}</Text>
          </View>
          <TouchableOpacity onPress={() => handleEdit('email')}>
            <MaterialIcons name="edit" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={24} color="#000" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Store Address</Text>
            <Text style={styles.infoText}>{userInfo.address}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddressModal(true)}>
            <MaterialIcons name="edit-location" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.qrButton} onPress={() => setShowQRCode(!showQRCode)}>
          <Ionicons name="qr-code-outline" size={24} color="#3498db" />
          <Text style={styles.qrButtonText}>Show QR Code</Text>
        </TouchableOpacity>
      </View>

      {showQRCode && (
        <View style={styles.qrContainer}>
          <QRCode value="https://example.com/user-qr-code" size={200} />
          <TouchableOpacity style={styles.shareButton} onPress={handleShareQRCode}>
            <Ionicons name="share-social-outline" size={20} color="#3498db" />
            <Text style={styles.shareButtonText}>Share QR Code</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Address Selection Modal */}
      <Modal visible={showAddressModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Store Address</Text>
            <FlatList
              data={storeAddresses}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.addressOption} onPress={() => handleAddressSelect(item)}>
                  <Text style={styles.addressText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <Button title="Cancel" color="red" onPress={() => setShowAddressModal(false)} />
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
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#e1f5fe',
    borderRadius: 10,
    marginVertical: 15,
  },
  qrButtonText: {
    marginLeft: 5,
    color: '#3498db',
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  shareButtonText: {
    marginLeft: 5,
    color: '#3498db',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addressOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
