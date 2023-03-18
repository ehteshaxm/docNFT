// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCH3w9F_6urnpW5e6f7y6alxuB8W6Tup2A',
  authDomain: 'docnft-53dfb.firebaseapp.com',
  projectId: 'docnft-53dfb',
  storageBucket: 'docnft-53dfb.appspot.com',
  messagingSenderId: '63868601150',
  appId: '1:63868601150:web:1392c66e25dfb35c65a26f',
  measurementId: 'G-675JTZETQ2',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
