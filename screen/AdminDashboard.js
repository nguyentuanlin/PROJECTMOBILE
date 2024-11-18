import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadSalesData();
  }, []);

  // Load sales data from storage
  const loadSalesData = async () => {
    const storedData = await AsyncStorage.getItem('salesData');
    const parsedData = JSON.parse(storedData) || [];
    setSalesData(parsedData);
    calculateTotalRevenue(parsedData);
  };

  // Calculate total revenue
  const calculateTotalRevenue = (data) => {
    const total = data.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setTotalRevenue(total);
  };

  // Add a new product
  const addProduct = async () => {
    if (!productName || !productPrice) {
      Alert.alert('Error', 'Please enter product name and price.');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      price: parseFloat(productPrice),
      quantity: 0,
    };

    const updatedData = [...salesData, newProduct];
    setSalesData(updatedData);
    await AsyncStorage.setItem('salesData', JSON.stringify(updatedData));
    setProductName('');
    setProductPrice('');
    Alert.alert('Success', 'Product added successfully.');
  };

  // Record sale for a product
  const recordSale = async (id) => {
    const updatedData = salesData.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setSalesData(updatedData);
    await AsyncStorage.setItem('salesData', JSON.stringify(updatedData));
    calculateTotalRevenue(updatedData);
  };

  // Render a product item
  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
      <Text style={styles.productQuantity}>Sold: {item.quantity}</Text>
      <TouchableOpacity style={styles.saleButton} onPress={() => recordSale(item.id)}>
        <Text style={styles.saleButtonText}>Record Sale</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Add Product Section */}
      <View style={styles.addProductContainer}>
        <TextInput
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
        />
        <TextInput
          placeholder="Product Price"
          value={productPrice}
          onChangeText={setProductPrice}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button title="Add Product" onPress={addProduct} />
      </View>

      {/* Sales Data Section */}
      <Text style={styles.sectionTitle}>Sales Today</Text>
      <FlatList
        data={salesData}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        style={styles.productList}
      />

      {/* Total Revenue */}
      <View style={styles.revenueContainer}>
        <Text style={styles.revenueText}>Total Revenue Today: ${totalRevenue.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  addProductContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productList: {
    flex: 1,
  },
  productItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
  },
  productQuantity: {
    fontSize: 14,
    color: '#555',
  },
  saleButton: {
    marginTop: 10,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  revenueContainer: {
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: 10,
  },
  revenueText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AdminDashboard;
