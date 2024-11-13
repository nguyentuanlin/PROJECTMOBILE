import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Animated } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import CoffeeCupWithSmoke from './CoffeeCupWithSmoke';

const { width, height } = Dimensions.get('window');

const stores = [
  { id: 1, name: 'LLC 1, 276 Thái Hà, quận Đống Đa, Hà Nội', latitude: 21.008145, longitude: 105.820829 },
  { id: 2, name: 'LLC2, Tầng 26 tòa Hei Tower, số 1 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội', latitude: 21.004531, longitude: 105.811485 },
  { id: 3, name: 'LLC3, Tầng 2 A11 khu tập thể Khương Thượng, Đống Đa, Hà Nội', latitude: 21.012507, longitude: 105.821158 },
];

const MapScreen = () => {
  const mapRef = useRef(null);
  const smokeAnimationValues = stores.map(() => new Animated.Value(0));
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  const moveToLocation = (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const startSmokeAnimation = (index) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(smokeAnimationValues[index], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(smokeAnimationValues[index], {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleUserLocation = () => {
    if (userLocation) {
      moveToLocation(userLocation.latitude, userLocation.longitude);
    } else {
      Alert.alert('Location not found', 'Unable to retrieve your location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 21.008145,
          longitude: 105.820829,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        userInterfaceStyle="dark"
        customMapStyle={mapStyle}
      >
        {stores.map((store, index) => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            onPress={() => {
              Alert.alert('Thông tin cửa hàng', store.name);
              startSmokeAnimation(index);
            }}
          >
            <CoffeeCupWithSmoke animatedValue={smokeAnimationValues[index]} greetingMessage="Chào mừng đến với cửa hàng!" />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutText}>{store.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.bottomCard}>
        <Text style={styles.title}>Chọn cửa hàng Magic Coffee</Text>
        <ScrollView>
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={styles.storeButton}
              onPress={() => moveToLocation(store.latitude, store.longitude)}
            >
              <Ionicons name="storefront-outline" size={24} color="white" />
              <Text style={styles.storeText}>{store.name}</Text>
              <Ionicons name="chevron-forward-outline" size={24} color="white" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#f0f4f8' }],
  },
  // You can customize other map elements here
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomCard: {
    backgroundColor: '#2A364A', // Màu xanh đậm cho nền thẻ phía dưới
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    height: height * 0.35,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A078D3', // Màu tím gradient cho nút cửa hàng
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  storeText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  callout: {
    width: 150,
  },
  calloutText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default MapScreen;
