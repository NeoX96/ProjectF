import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

const LogoutButton = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      const response = await axios.post('/logout');
      if (response.data.success) {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LogoutButton;
