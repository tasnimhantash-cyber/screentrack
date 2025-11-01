// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_p-Z9dAJOm4kiIYipNE1lw7WJgj4bLC0",
  authDomain: "screentrack-25ab8.firebaseapp.com",
  projectId: "screentrack-25ab8",
  storageBucket: "screentrack-25ab8.firebasestorage.app",
  messagingSenderId: "321520460379",
  appId: "1:321520460379:web:7786a65a7058d32c0c957e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };

