import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

// Import các màn hình
import Home from './screen/Home';
import SignInScreen from './screen/SignInScreen';
import SignUpScreen from './screen/SignUpScreen';
import ForgotPasswordScreen from './screen/ForgotPasswordScreen';
import OTPVerificationScreen from './screen/OTPVerificationScreen';
import Map from './screen/map';
import HomeScreen from './screen/Homescreen';
import OrderScreen from './screen/Orderscreen';
import Assemblage from './screen/assemblage';
import Cart from './screen/Cart';
import PaymentScreen from './screen/PaymentScreen';
import OrderConfirmationScreen from './screen/OrderConfirmationScreen';
import ProfileScreen from './screen/Profile';
import RewardsScreen from './screen/Reward';
import ReceiptScreen from './screen/receipt';
import AdminDashboard from './screen/AdminDashboard';
import SelectBaristaScreen from './screen/SelectBaristaScreen';
import AdditivesScreen from './screen/AdditivesScreen';
import ChatScreen from './screen/ChatScreen'; // Import màn hình ChatScreen

// Hàm khởi tạo người dùng
const initializeUsers = async () => {
  const users = [
    { name: "Admin User", email: "admin@gmail.com", password: "123", role: "admin" },
    { name: "Tuan Linh", email: "tuanlinh@gmail.com", password: "123", role: "user" },
    { name: "User 2", email: "user2@example.com", password: "password456", role: "user" }
  ];
  await AsyncStorage.setItem('users', JSON.stringify(users));
};

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const setupUsers = async () => {
      const existingUsers = await AsyncStorage.getItem('users');
      if (!existingUsers) {
        await initializeUsers();
      }
    };
    setupUsers();
  }, []);

  return (
    <CartProvider>
      <OrderProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home" 
            screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#000',
              headerTitle: '',
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen 
              name="HomeScreen" 
              component={HomeScreen} 
              options={{
                headerLeft: () => null,
                headerBackVisible: false,
              }} 
            />
            <Stack.Screen name="OrderScreen" component={OrderScreen} />
            <Stack.Screen name="Assemblage" component={Assemblage} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
            <Stack.Screen name="Receipt" component={ReceiptScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} /> 
            <Stack.Screen 
              name="SelectBaristaScreen" 
              component={SelectBaristaScreen} 
              options={{ title: 'Select a Barista' }} 
            />
            <Stack.Screen 
              name="AdditivesScreen" 
              component={AdditivesScreen} 
              options={{ title: 'Select Additives' }} 
            />
            <Stack.Screen 
              name="ChatScreen" 
              component={ChatScreen} 
              options={({ route }) => ({ title: `Chat with ${route.params.barista.name}` })} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </OrderProvider>
    </CartProvider>
  );
};

export default App;
``
