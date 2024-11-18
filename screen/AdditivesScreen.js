import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AdditivesScreen = ({ navigation, route }) => {
  const { selectedAdditives, onSelect } = route.params;
  const additivesList = ['Ceylon cinnamon', 'Grated chocolate', 'Liquid chocolate', 'Marshmallow', 'Whipped cream', 'Cream', 'Nutmeg', 'Ice cream'];

  const [localSelectedAdditives, setLocalSelectedAdditives] = useState([...selectedAdditives]);

  const toggleAdditive = (additive) => {
    setLocalSelectedAdditives((prev) => 
      prev.includes(additive) 
        ? prev.filter(item => item !== additive) 
        : [...prev, additive]
    );
  };

  const handleDone = () => {
    onSelect(localSelectedAdditives);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Additives</Text>
      {additivesList.map((additive) => (
        <TouchableOpacity
          key={additive}
          onPress={() => toggleAdditive(additive)}
          style={[styles.additiveOption, localSelectedAdditives.includes(additive) && styles.additiveOptionSelected]}
        >
          <Text style={[styles.additiveText, localSelectedAdditives.includes(additive) && styles.selectedText]}>
            {additive}
          </Text>
          {localSelectedAdditives.includes(additive) && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  additiveOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#FFF',
  },
  additiveOptionSelected: {
    borderColor: '#FF4500',
    backgroundColor: '#FFF5F0',
  },
  additiveText: {
    fontSize: 18,
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#FF4500',
  },
  checkmark: {
    fontSize: 20,
    color: '#FF4500',
    fontWeight: 'bold',
  },
  doneButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdditivesScreen;
