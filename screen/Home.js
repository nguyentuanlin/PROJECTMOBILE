import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, ImageBackground } from 'react-native';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useWindowDimensions } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const scrollRef = useRef();
  const descriptionOpacity = useRef(new Animated.Value(0)).current;

  const descriptions = [
    { title: 'LLC Coffee', subtitle: 'Feel yourself like a barista!', description: 'Magic coffee on order.', image: require('../assets/logo.jpg') },
    { title: 'Premium Beans', subtitle: 'Only the best for our customers', description: 'Sourced from around the world.', image: require('../assets/beans.webp') },
    { title: 'Handcrafted Drinks', subtitle: 'Every cup made with love', description: 'Discover our selection of custom drinks.', image: require('../assets/phacafe.webp') },
  ];

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        PoppinsBold: require('../fonts/DancingScript-VariableFont_wght.ttf'),
        PoppinsRegular: require('../fonts/DancingScript-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
      fadeInText();
    }
    loadFonts();
  }, []);

  const fadeInText = () => {
    descriptionOpacity.setValue(0);
    Animated.timing(descriptionOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (currentPage < descriptions.length - 1) {
        handlePageChange(currentPage + 1);
      } else {
        clearInterval(autoScroll);
      }
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    scrollRef.current.scrollTo({ x: newPage * width, animated: true });
    setCurrentPage(newPage);
    fadeInText();
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#f2f4f6', '#ffffff']} style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const newPage = Math.round(event.nativeEvent.contentOffset.x / width);
          if (newPage !== currentPage) {
            setCurrentPage(newPage);
            fadeInText();
          }
        }}
        scrollEventThrottle={16}
        ref={scrollRef}
      >
        {descriptions.map((item, index) => (
          <View key={index} style={[styles.pageContainer, { width }]}>
            <ImageBackground
              source={item.image}
              style={[styles.image, { width, height: height * 0.5 }]}
              imageStyle={styles.blurEffect}
              blurRadius={15}
              resizeMode="cover"
            >
              <Image source={item.image} style={[styles.innerImage, { width: width * 0.75, height: height * 0.4 }]} />
            </ImageBackground>
            <Animated.View style={[styles.textContainer, { opacity: descriptionOpacity }]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {Array.from({ length: descriptions.length }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              currentPage === index ? styles.activeDot : null,
              { transform: [{ scale: currentPage === index ? 1.2 : 1 }] },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (currentPage === descriptions.length - 1) {
            navigation.navigate('SignIn');
          } else {
            handlePageChange(currentPage + 1);
          }
        }}
      >
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: -10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#3E4C59',
    fontWeight: '600',
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurEffect: {
    opacity: 0.5,
  },
  innerImage: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'PoppinsBold',
    color: '#3E4C59',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'PoppinsRegular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bbb',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#3E4C59',
  },
  button: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#3E4C59',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  arrow: {
    fontSize: 24,
    color: '#FFF',
  },
});

export default WelcomeScreen;
