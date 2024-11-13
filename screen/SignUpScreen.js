import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); // Lưu thông báo lỗi cho từng trường

  const validateInputs = () => {
    const newErrors = {};

    // Kiểm tra tên không được để trống
    if (!name) {
      newErrors.name = 'Please enter your full name.';
    }

    // Kiểm tra số điện thoại hợp lệ
    const mobileRegex = /^[0-9]{10,11}$/; // Số điện thoại chỉ chứa số và từ 10 đến 11 ký tự
    if (!mobile) {
      newErrors.mobile = 'Please enter your mobile number.';
    } else if (!mobileRegex.test(mobile)) {
      newErrors.mobile = 'Invalid mobile number format.';
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Định dạng email đơn giản
    if (!email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format.';
    }

    // Kiểm tra mật khẩu tối thiểu 6 ký tự
    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    try {
      const usersData = await AsyncStorage.getItem('users');
      let users = JSON.parse(usersData) || [];

      // Kiểm tra nếu email đã được sử dụng
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        Alert.alert('Error', 'Email is already registered.');
        return;
      }

      // Thêm người dùng mới vào danh sách
      const newUser = { name, mobile, email, password };
      users.push(newUser);

      // Lưu danh sách người dùng vào AsyncStorage
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create an account here</Text>

      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors({ ...errors, name: '' }); // Xóa thông báo lỗi khi đang nhập
          }}
        />
      </View>
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <View style={styles.inputContainer}>
        <Icon name="call-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Mobile Number"
          style={styles.input}
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
            setErrors({ ...errors, mobile: '' });
          }}
          keyboardType="phone-pad"
        />
      </View>
      {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Email address"
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: '' });
          }}
          keyboardType="email-address"
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} style={styles.icon} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: '' });
          }}
          secureTextEntry
        />
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Icon name="arrow-forward-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already a member?{' '}
        <Text style={styles.signIn} onPress={() => navigation.navigate('SignIn')}>
          Sign in
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
    marginBottom: 10,
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
    paddingLeft: 40,
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
  signIn: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
