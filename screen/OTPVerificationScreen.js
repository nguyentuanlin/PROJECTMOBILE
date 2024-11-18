import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Vibration, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [showNotification, setShowNotification] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [otpError, setOtpError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const notificationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomOtp = generateRandomOtp();
    setGeneratedOtp(randomOtp);
    displayNotification();

    Vibration.vibrate([0, 500, 100, 500]);

    const countdown = setInterval(() => {
      setResendTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const generateRandomOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const displayNotification = () => {
    setShowNotification(true);
    notificationOpacity.setValue(0);

    Animated.timing(notificationOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(notificationOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowNotification(false));
      }, 3000);
    });
  };

  const handleOTPSubmit = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === generatedOtp) {
      navigation.navigate('HomeScreen');
    } else {
      setOtpError(true);
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start(() => setOtpError(false));
    }
  };

  const handleChange = (text, index) => {
    if (text.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (text, index) => {
    if (text === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      const newOtp = generateRandomOtp();
      setGeneratedOtp(newOtp);
      setOtp(['', '', '', '']);
      setResendTimer(30);
      displayNotification();

      Vibration.vibrate([0, 500, 100, 500]);
    }
  };

  return (
    <View style={styles.container}>
      {showNotification && (
        <Animated.View style={[styles.notification, { opacity: notificationOpacity }]}>
          <Icon name="checkmark-circle" size={24} color="#fff" style={styles.notificationIcon} />
          <Text style={styles.notificationText}>Your OTP is {generatedOtp}</Text>
        </Animated.View>
      )}

      <Text style={styles.title}>Verification</Text>
      <Text style={styles.instruction}>Enter the OTP code we sent you</Text>

      <Animated.View style={[styles.otpContainer, otpError && { transform: [{ translateX: shakeAnimation }] }]}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[styles.otpInput, otpError && { borderColor: 'red' }]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(digit, index);
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={handleOTPSubmit}>
        <Icon name="arrow-forward-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity onPress={handleResendOTP} disabled={resendTimer !== 0}>
          <Text style={[styles.resendLink, resendTimer !== 0 && { color: '#999' }]}>
            Resend {resendTimer !== 0 ? `in ${resendTimer}s` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  notification: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4caf50',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#999',
  },
  resendLink: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default OTPVerificationScreen;
