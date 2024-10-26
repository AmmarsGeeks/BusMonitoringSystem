import 'firebase/auth';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';


//const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_SDK_CONFIG);
const firebaseConfig = {
    apiKey: "AIzaSyCMzIhuKv2MtyKUw06dxhahf8YhhtzlGWM",
    authDomain: "buspassengermonitoring.firebaseapp.com",
    databaseURL: "https://buspassengermonitoring-default-rtdb.firebaseio.com",
    projectId: "buspassengermonitoring",
    storageBucket: "buspassengermonitoring.appspot.com",
    messagingSenderId: "463068539519",
    appId: "1:463068539519:web:44b70dd13efbb65ef7ad4a",
    measurementId: "G-3X83ZE0GZ5"
  };

const app = firebase.initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: `BOz9wXrQ5xVSfsEDefXmWUADmhaKLTSF7cv32PcZGfUX7IpzzIW4n--sghm6u9ubmPWT_FJB2AsUZlI073Xa148` })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};


export const requestPermission = async () => {
  console.log('Requesting permission for notifications...');
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    // After permission is granted, get the token
    getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Current FCM token:', currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token.', err);
      });
  } else {
    console.log('Notification permission denied.');
  }
};



// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });


export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
