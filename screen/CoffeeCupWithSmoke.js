import React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CoffeeCupWithSmoke = ({ animatedValue, greetingMessage }) => {
  const messageStyle = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -40], // Move upward
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2], // Scale effect
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Ionicons name="cafe-outline" size={40} color="orange" />
      <Animated.View style={[styles.messageContainer, messageStyle]}>
        <Text style={styles.greetingText}>{greetingMessage}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    marginLeft: -50, // Center the message based on its width
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  greetingText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default CoffeeCupWithSmoke;
