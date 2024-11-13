import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handlePasswordReset = async () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter your email address.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
    } else {
      // Kiểm tra email và hiển thị phần nhập mật khẩu
      const usersData = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersData) || [];
      const userExists = users.some(user => user.email === email);

      if (userExists) {
        Alert.alert(
          'Email Verified',
          'Please enter your new password.',
          [{ text: 'OK', onPress: () => setIsEmailVerified(true) }]
        );
      } else {
        Alert.alert('Error', 'This email is not registered.');
      }
    }
  };

  const handleSetNewPassword = async () => {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      Alert.alert('Error', 'Please fill in both password fields.');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
    } else {
      // Lưu mật khẩu mới
      const usersData = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersData) || [];
      const updatedUsers = users.map(user => 
        user.email === email ? { ...user, password: newPassword } : user
      );
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

      Alert.alert('Success', 'Password reset successful!', [
        { text: 'OK', onPress: () => navigation.navigate('SignIn') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.instruction}>Enter your email to reset your password.</Text>
      
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={24} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />
      </View>
      
      {!isEmailVerified ? (
        <TouchableOpacity style={styles.arrowButton} onPress={handlePasswordReset}>
          <View style={styles.arrowContainer}>
            <Icon name="arrow-forward" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={24} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#888"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={24} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#888"
            />
          </View>

          <TouchableOpacity style={styles.arrowButton} onPress={handleSetNewPassword}>
            <View style={styles.arrowContainer}>
              <Icon name="checkmark" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, 
  },
  icon: {
    marginRight: 10, 
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  arrowButton: {
    position: 'absolute',
    bottom: 20,
    right: 20, 
  },
  arrowContainer: {
    backgroundColor: '#3498db', 
    width: 50,
    height: 50,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ForgotPasswordScreen;
