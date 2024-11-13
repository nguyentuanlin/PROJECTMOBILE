import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    setErrorMessage(''); // Reset lỗi khi bắt đầu đăng nhập
    try {
      const usersData = await AsyncStorage.getItem('users');
      const users = JSON.parse(usersData) || [];
      // Tìm người dùng trong danh sách
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Lưu tên người dùng vào AsyncStorage
        await AsyncStorage.setItem('username', user.name);

        // Kiểm tra quyền của người dùng
        if (user.role === 'admin') {
          navigation.navigate('AdminDashboard'); // Điều hướng đến Dashboard của Admin
        } else {
          // Điều hướng đến OTPVerification cho người dùng bình thường
          navigation.navigate('OTPVerification', { userEmail: email });
        }
      } else {
        setErrorMessage('The email or password is incorrect. Please try again.'); // Thông báo lỗi
      }
    } catch (error) {
      console.error('Error retrieving users:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Welcome back</Text>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Email address"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
          <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Forgot Password Button */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Icon name="arrow-forward-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.footerText}>
        New member?{' '}
        <Text style={styles.signUp} onPress={() => navigation.navigate('SignUp')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
  },
  icon: {
    paddingHorizontal: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#333',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#333',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginVertical: 30,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
  },
  signUp: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
