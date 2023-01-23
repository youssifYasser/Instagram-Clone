// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDTFf3nXfE90WdVl6-BiaoA6tpiVqKznRU',
  authDomain: 'instagram-clone-bc0d3.firebaseapp.com',
  projectId: 'instagram-clone-bc0d3',
  storageBucket: 'instagram-clone-bc0d3.appspot.com',
  messagingSenderId: '459127615072',
  appId: '1:459127615072:web:9c648c316715771fe09d05',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

const storage = getStorage(app);

export { app, db, storage };
