import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

// Import Background Image
const backgroundImage = require('./background.jpg'); 

const FirstPage = ({ navigation }) => {
    const handlePress = () => {
        navigation.navigate('dashboard');
    };

    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.background}
            resizeMode="cover" 
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handlePress} // Navigate to Dashboard on press
                >
                    <Text style={styles.buttonText}>Start!</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns the button to the bottom
        alignItems: 'flex-end', // Aligns the button to the right
        padding: 60, // Adds some padding to the right corner
    },
    button: {
        backgroundColor: 'rgba(76, 175, 80, 0.5)', // 50% transparent green
        padding: 10,
        borderRadius: 12,
        elevation: 3,
        borderWidth: 3,
        borderColor: '#fff', // Bright outline
        width: 100, // Adjust width as needed
        height: 50, // Adjust height as needed
        overflow: 'hidden', // Ensures the arrow shape is maintained
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold', // Bold text
        textAlign: 'center',
    },
});

export default FirstPage;
