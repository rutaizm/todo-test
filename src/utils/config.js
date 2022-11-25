import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDklvbfZwMW_t-hsof3i5qhoMNRyceB4PE",
    authDomain: "todo-test-7d5ed.firebaseapp.com",
    projectId: "todo-test-7d5ed",
    storageBucket: "todo-test-7d5ed.appspot.com",
    messagingSenderId: "805237603524",
    appId: "1:805237603524:web:5d89c596f85a83d80d1d91",
    measurementId: "G-79DVKN2MH4"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db };