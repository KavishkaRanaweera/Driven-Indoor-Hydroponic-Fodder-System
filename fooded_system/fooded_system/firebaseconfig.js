import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA4DZiwnud1-3cktIFA_YmPE8l_RRBsPvM",
  authDomain: "hydroponicapp-a24f3.firebaseapp.com",
  databaseURL: "https://hydroponicapp-a24f3-default-rtdb.firebaseio.com",
  projectId: "hydroponicapp-a24f3",
  storageBucket: "hydroponicapp-a24f3.appspot.com",
  messagingSenderId: "865975689371",
  appId: "1:865975689371:web:d107cc0272ffef140aa63e",
  measurementId: "G-5R4R49VJB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };