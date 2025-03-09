// client/src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3rSifeoD3Z0jcXlYrUzgFxpN4SiBnIKE",
  authDomain: "leathercraftmarket.firebaseapp.com",
  projectId: "leathercraftmarket",
  storageBucket: "leathercraftmarket.firebasestorage.app",
  messagingSenderId: "102930406039",
  appId: "1:102930406039:web:e80d8df268c0fee08467d2",
  measurementId: "G-QJECS9607J"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);