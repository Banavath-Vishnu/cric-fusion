// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Only import analytics if you're using it
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPGEFUKrRQWK-hJUS1_kIe0o27jxyQzmg",
  authDomain: "cricket-blog-f981d.firebaseapp.com",
  projectId: "cricket-blog-f981d",
  storageBucket: "cricket-blog-f981d.appspot.com",
  messagingSenderId: "537900209438",
  appId: "1:537900209438:web:8cf199812cafe108eb650f",
  measurementId: "G-3C84WNMGWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Only initialize analytics if in browser environment
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export the Firebase app instance (needed for OAuth.jsx)
export { app };
