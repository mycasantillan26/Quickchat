// src/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCBoq6fFPzD2L9JMLBP8Ec7AJJstPmMir0",
  authDomain: "quickchat-509b7.firebaseapp.com",
  projectId: "quickchat-509b7",
  storageBucket: "quickchat-509b7.appspot.com",
  messagingSenderId: "610842388677",
  appId: "1:610842388677:web:3833882209df243d3528ac",
  measurementId: "G-1P8DBPNP3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
