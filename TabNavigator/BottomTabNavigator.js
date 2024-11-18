import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screen/Homescreen'; // Màn hình Home của bạn
import RewardsScreen from '../screen/Reward'; // Màn hình Rewards của bạn
import ReceiptsScreen from '../screen/receipt'; // Màn hình Receipts

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'HomeScreen' : 'HomeScreen-outline';
          } else if (route.name === 'Rewards') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Receipts') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          }

          // Return icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#2c3e50', // Màu nền của thanh điều hướng
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 10,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Receipts" component={ReceiptsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
