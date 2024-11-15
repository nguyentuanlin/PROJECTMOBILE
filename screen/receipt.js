import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { OrderContext } from '../context/OrderContext'; // Import OrderContext

const ongoingOrders = [
  { id: '1', name: 'Americano', time: '24 June | 12:30 | by 18:10', price: 3.00, address: 'Bradford BD1 1PR' },
  { id: '2', name: 'Latte', time: '24 June | 12:30 | by 18:10', price: 3.00, address: 'Bradford BD1 1PR' },
  { id: '3', name: 'Flat White', time: '24 June | 12:30 | by 18:10', price: 3.00, address: 'Bradford BD1 1PR' },
];

const OrderScreen = () => {
  const { historyOrders = [] } = useContext(OrderContext); // Lấy danh sách lịch sử đơn hàng từ OrderContext
  const [selectedTab, setSelectedTab] = useState('ongoing');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setModalVisible(false);
  };

  const orderAgain = (order) => {
    alert(`Ordered again: ${order.name}`);
  };

  const renderOngoingOrderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openOrderDetails(item)}>
      <View style={styles.orderItem}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTime}>{item.time}</Text>
          <Text style={styles.orderName}>{item.name}</Text>
          <Text style={styles.orderAddress}>{item.address}</Text>
        </View>
        <Text style={styles.orderPrice}>BYN {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHistoryOrderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <TouchableOpacity onPress={() => openOrderDetails(item)} style={{ flex: 1 }}>
        <View style={styles.orderItem}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTime}>{item.time}</Text>
            <Text style={styles.orderName}>{item.name}</Text>
            <Text style={styles.orderAddress}>{item.address}</Text>
          </View>
          <Text style={styles.orderPrice}>BYN {item.totalPrice.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => orderAgain(item)} style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Order Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>My Order</Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'ongoing' && styles.activeTab]} 
          onPress={() => setSelectedTab('ongoing')}
        >
          <Text style={[styles.tabText, selectedTab === 'ongoing' && styles.activeTabText]}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]} 
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Order List */}
      {selectedTab === 'ongoing' ? (
        <FlatList
          data={ongoingOrders}
          renderItem={renderOngoingOrderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <FlatList
          data={historyOrders} // Sử dụng dữ liệu lịch sử từ context
          renderItem={renderHistoryOrderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Order Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeOrderDetails}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Order Details</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Name:</Text>
                  <Text style={styles.modalValue}>{selectedOrder.name || "N/A"}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Time:</Text>
                  <Text style={styles.modalValue}>{selectedOrder.time}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Total Price:</Text>
                  <Text style={styles.modalValue}>BYN {selectedOrder.totalPrice?.toFixed(2) || "N/A"}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Address:</Text>
                  <Text style={styles.modalValue}>{selectedOrder.address}</Text>
                </View>
                <Button title="Close" onPress={closeOrderDetails} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 18,
    color: '#ccc',
  },
  activeTabText: {
    color: '#000',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderInfo: {
    flex: 1,
  },
  orderTime: {
    fontSize: 14,
    color: '#888',
  },
  orderName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  orderAddress: {
    fontSize: 14,
    color: '#888',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderButton: {
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  orderButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalValue: {
    fontSize: 16,
    color: '#555',
  },
});

export default OrderScreen;
