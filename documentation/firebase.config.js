import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJj6rAlBlN0JI7obrTFzmPJKGQtlwQuA8",
  authDomain: "boss-car-otp.firebaseapp.com",
  projectId: "boss-car-otp",
  storageBucket: "boss-car-otp.appspot.com",
  messagingSenderId: "86957281715",
  appId: "1:86957281715:web:fd319926f1a1c93d533bc6",
  measurementId: "G-DHKNGXVBKK",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
