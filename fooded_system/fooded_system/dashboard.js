import { useEffect, useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Animated,ScrollView, Image, Modal } from "react-native";
import { FullWindowOverlay } from "react-native-screens";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { database } from './firebaseconfig';
import { ref, onValue } from 'firebase/database';
  

const dashboard = () => {
  const [data, setData] = useState(null);
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeButtonId, setActiveButtonId] = useState(null);
  const [error, setError] = useState(null);
  const [lightStatus, setLightStatus] = useState(false);
  const fadeAnim = new Animated.Value(1);
  const [isModalVisible, setIsModalVisible] = useState(false);


 // Function to generate PDF
 const generatePDF = async () => {
  const htmlContent = `
    <h1>Sensor Data Summary</h1>
    <p><strong>Temperature:</strong> ${data?.temp?.toFixed(1) || '--'} °C</p>
    <p><strong>Turbidity:</strong> ${data?.turb?.toFixed(1) || '--'} NTU</p>
    <p><strong>TDS:</strong> ${data?.tds?.toFixed(1) || '--'} ppm</p>
    <p><strong>Water Level:</strong> ${data?.waterLevel?.toFixed(1) || '--'} %</p>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri); // Open sharing options
  } catch (error) {
    alert('Error generating PDF: ' + error);
  }
};

  const buttons = [
    { 
      id: 1, 
      image: require('./assests/tomato.png'), 
      label: 'Tomato',
      content: {
        title: 'Tomato Growth Info',
        text: 'Optimal conditions for tomatoes:\n- Temperature: 20-30°C\n- pH: 5.5-6.8\n- EC: 2.0-5.0 mS/cm'
      }
    },
    { 
      id: 2, 
      image: require('./assests/tomato.png'), 
      label: 'Strawberry',
      content: {
        title: 'Strawberry Care Guide',
        text: 'Strawberry requirements:\n- Temperature: 15-25°C\n- pH: 5.5-6.5\n- EC: 1.0-2.5 mS/cm'
      }
    },
    { 
      id: 3, 
      image: require('./assests/tomato.png'), 
      label: 'Green Chilly',
      content: {
        title: 'Chilli Plant Tips',
        text: 'Chilli plant preferences:\n- Temperature: 25-30°C\n- pH: 6.0-6.5\n- EC: 1.5-3.0 mS/cm'
      }
    },
  ];

  const selectedContent = buttons.find(btn => btn.id === activeButtonId)?.content;

  useEffect(() => {
    try {
      const dbRef = ref(database, 'sensors');
      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setDevices(snapshot.val());
          setError(null);
        } else {
          setError('No data available');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const toggleDevice = async (devicePath) => {
    try {
      const deviceRef = ref(database, `devices/${devicePath}`);
      await set(deviceRef, !devices[devicePath]);
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  const DeviceControl = ({ deviceName, icon, onColor, offColor, label }) => (
    <TouchableOpacity 
      style={styles.deviceButton}
      onPress={() => toggleDevice(deviceName)}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={32} 
        color={devices[deviceName] ? onColor : offColor} 
      />
      <Text style={styles.deviceLabel}>{label}</Text>
      <Text style={styles.deviceStatus}>
        {devices[deviceName] ? 'ON' : 'OFF'}
      </Text>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading sensor data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.square1}>
        <Text style={styles.valueText}>Temp</Text>
        <Text style={styles.valueText}>
          {data.temp?.toFixed(1) || '--'}°C
        </Text>


      </View>
      <View style={styles.square2}>
        <Text>Terbility</Text>
        <Text style={styles.valueText}>
          {data.turb?.toFixed(1) || '--'} NTU
        </Text>
      </View>


      <View style={styles.square3}>
        <Text>TDS</Text>
        <Text style={styles.valueText}>
          {data.tds?.toFixed(1) || '--'} ppm
        </Text>
      </View>


      <View style={styles.square4}>
      <ScrollView 
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.horizontalScroll}
  >
    <DeviceControl
      deviceName="redLight"
      icon="alarm-light"
      onColor="#FF0000"
      offColor="#550000"
      label="RED LIGHT"
    />
    <DeviceControl
      deviceName="blueLight"
      icon="alarm-light"
      onColor="#0000FF"
      offColor="#000055"
      label="BLUE LIGHT"
    />
    <DeviceControl
      deviceName="hotLight"
      icon="white-balance-sunny"
      onColor="#FF4500"
      offColor="#552200"
      label="HEATER"
    />
    <DeviceControl
      deviceName="coolFan"
      icon="fan"
      onColor="#00FF00"
      offColor="#005500"
      label="COOL FAN"
    />
  </ScrollView>
      </View>


      <View style={styles.square5}>
        <Text>Water-Level</Text>
        <Text style={styles.valueText}>
          {data.waterLevel?.toFixed(1) || '--'}%
        </Text>
      </View>


      <View style={styles.square6}>
      {/* Summary Button */}
      <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
        <Text style={styles.buttonText}>Generate PDF</Text>
      </TouchableOpacity>
      </View>


      <View style={styles.square7}>
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn.id}
            style={styles.button}
            onPress={() => setActiveButtonId(btn.id)}
          >
            <Image source={btn.image} style={styles.buttonImage} />
            <Text style={styles.buttonLabel}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal */}
      <Modal
        visible={!!activeButtonId}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveButtonId(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedContent && (
              <>
                <Text style={styles.modalTitle}>{selectedContent.title}</Text>
                <Text style={styles.modalText}>{selectedContent.text}</Text>
              </>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setActiveButtonId(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#abffbd", // Background color for the app
  },
  square1: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 150, // Width of the square
    height: 155, // Height of the square
    backgroundColor: "#6b0311", // Background color of the square
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: 10, // Rounded corners (optional)
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  square2: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 150, // Width of the square
    height: 75, // Height of the square
    backgroundColor: "#007BFF", // Background color of the square
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: 10, // Rounded corners (optional)
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  square3: {
    position: "absolute",
    top: 140,
    right: 20,
    width: 150, // Width of the square
    height: 75, // Height of the square
    backgroundColor: "#00ca76", // Background color of the square
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: 10, // Rounded corners (optional)
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  square4: {
    position: "absolute",
    top: 260,
    left: 20,
    width: 335, // Width of the square
    height: 100, // Height of the square
    backgroundColor: "#fdc304", // Background color of the square
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: 10, // Rounded corners (optional)
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  square5: {
    position: "absolute",
    top: 400,
    left: 20,
    width: 150, // Width of the square
    height: 155, // Height of the square
    backgroundColor: "#129efc", // Background color of the square
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: 10, // Rounded corners (optional)
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  square6: {
    position: "absolute",
    top: 400,
    right: 20,
    width: 150, // Width of the square
    height: 155, // Height of the square
    backgroundColor: "#b15f6d", // Background color of the square
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    borderRadius: 10, // Rounded corners (optional)
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  square7: {
    position: "absolute",
    top: 580,
    left: 20,
    width: 335, // Width of the rectangle
    height: 100, // Height of the rectangle
    borderWidth: 5, // Outline width
    borderColor: "#FFD700", // Bright outline color (gold)
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 80, // Image width
    height: 80, // Image height
    borderRadius: 40, // Rounded image (half of width/height for circle)
  },
  valueText: {
    color: "#fff", // Text color
    fontSize: 24, // Font size of the value
    fontWeight: "bold", // Bold text
  },
  horizontalScroll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  deviceButton: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 100,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#a34242',
  },
  deviceLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center', // Add this for text centering
  },
  deviceStatus: {
    color: '#e2cdcd',
    fontSize: 12,
    textAlign: 'center', // Add this for text centering
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  buttonLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#6b0311',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: "#abffbd",
    alignItems: "center",
    justifyContent: "center",
  },
  pdfButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default dashboard;
